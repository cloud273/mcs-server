import { getManager, ObjectType } from "typeorm";
import { SqlWhere } from "../../../support/utility/SqlUtility";
import { Log } from "../../../../node/library/log/Log";
import { BaseAccount } from "../../account/BaseAccount";
import { Cond } from "../../../../node/library/sql/Cond";
import AsyncLock = require('async-lock');

export class BaseAccountCache <T extends BaseAccount> {

    private map: Map<string, number>

    private lockName: string

    private lock = new AsyncLock({maxPending: 100000})

    constructor(private table: ObjectType<T>, private owner: string) {
        this.lockName = `___BaseAccountCache_${this.table.name}___`
    }

    private _delete(id: number) {
        let ks = []
        for (const [k, v] of Object.entries(this.map)) {
            if (v == id) {
                ks.push(k)
            }
        }
        for (const k of ks) {
            this.map.delete(k)
        }
    }

    private _set(sso: string, id: number) {
        this.map.set(sso, id)
    }

    private _initialize() {
        this.map = new Map()
    }

    private async _getInDb(sso: string): Promise<number | null> {
        const query = getManager()
        .createQueryBuilder(this.table, "t")
        .select(["t.id"])
        if (this.owner != undefined) {
            query.innerJoin(`t.${this.owner}`, 'o', SqlWhere.get(null, false, 'o'))
        }
        const obj = await query
        .where(SqlWhere.get([Cond.equal('sso', sso)], false, "t"))
        .getOne()
        if (obj != null) {
            this.lock.acquire(this.lockName, () => {
                this._set(sso, obj.id)
            })
            .catch( (err)=> {
                Log.error(this.lockName, err)
            })
            return obj.id
        } else {
            return null
        }
    }

    public initialize() {
        this.lock.acquire(this.lockName, () => {
            this._initialize()
        })
        .catch( (err)=> {
            Log.error(this.lockName, err)
        })
    }

    public async get(sso: string): Promise<number | null> {
        let result = this.map.get(sso)
        if (result == null) {
            result = await this._getInDb(sso)
        }
        return result
    }

    public remove(id: number) {
        this.lock.acquire(this.lockName, () => {
            this._delete(id)
        })
        .catch( (err)=> {
            Log.error(this.lockName, err)
        })
    }

}
