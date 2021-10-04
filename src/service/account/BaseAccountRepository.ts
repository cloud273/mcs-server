import { EntityRepository, EntityManager, ObjectType } from "typeorm";
import { Cond } from "../../../node/library/sql/Cond";
import { BaseAccount } from "./BaseAccount";
import { Where } from "../../../node/library/sql/Where";

@EntityRepository()
export class BaseAccountRepository {

    constructor(private manager: EntityManager) {

    }

    public async get<T extends BaseAccount>(table: ObjectType<T>, username: string): Promise<T> {
        return this.manager.createQueryBuilder(table, "t")
                            .select(['t.id', 't.sso', 't.deactivated'])
                            .where(Where.and([Cond.equal("username", username)], "t"))
                            .getOne()
    }

}