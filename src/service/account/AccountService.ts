import { Account } from "../../common/entity/Account";
import { ObjectType } from "typeorm";
import { Result } from "../../common/object/Result";
import { BaseService } from "../../common/business/BaseService";
import { SsoService } from "../../third-party/sso/SsoService";

export class AccountService {

    static async getDetail<T extends Account>(table: ObjectType<T>, token: string): Promise<Result> {
        let action = async (accountId: number): Promise<Result> => {
            return BaseService.getDetail(table, accountId, false)
        }
        return SsoService.actionToken(table, token, action)
    }

}