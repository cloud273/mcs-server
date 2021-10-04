import { ObjectType } from "typeorm";
import { Integer } from "../../../../node/library/utility/Integer";
import { Constant } from "../../../../Constant";
import { Account } from "../../../common/entity/Account";

export class AccountCodeService {

    public static update = new AccountCodeService({}, Constant.verifyCode.timeout, Constant.verifyCode.numTry)

    constructor(private data, private timeout: number, private count: number) {
        
    }

    public verify<T extends Account>(table: ObjectType<T>, username: string, code: string, deleteOnSuccess: boolean = true): boolean {
        const map = this.data[table.name]
        if (map != null) {
            const obj = map[username]
            if (obj != null) {
                const d = obj.d as number
                let t = obj.t as number
                const c = obj.c as string
                if (new Date().second() - d < this.timeout) {
                    if (c == code) {
                        if (deleteOnSuccess) {
                            this.delete(table, username)
                        }
                        return true
                    } else {
                        t = t + 1
                        if (t < this.count) {
                            obj.t = t
                        } else {
                            delete map[username]
                        }
                    }
                } else {
                    delete map[username]
                }
            }
        }
        return false
    }

    public set<T extends Account>(table: ObjectType<T>, username: string, code: string) {
        let map = this.data[table.name]
        if (map == null) {
            map = {}
            this.data[table.name] = map
        }
        map[username] = {
            "c": code,
            "d": new Date().second(),
            "t": 0
        }
    }

    public delete<T extends Account>(table: ObjectType<T>, username: string) {
        let map = this.data[table.name]
        if (map != null) {
            delete map[username]
        }
    }
    
    public generate<T extends Account>(table: ObjectType<T>, username: string): string {
        const result = Integer.RandomWithLength(6).toString()
        this.set(table, username, result)
        return result
    }

}
