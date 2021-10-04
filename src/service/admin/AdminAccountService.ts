import { Result } from "../../common/object/Result";
import { BaseAccountService } from "../account/BaseAccountService";
import { Admin } from "../../entity/admin/Admin";
import { SsoService } from "../../third-party/sso/SsoService";
import { BaseService } from "../../common/business/BaseService";

export class AdminAccountService {

    static async create(account: Admin): Promise<Result> {
        let result = await BaseAccountService.adminCreate(Admin, account.username, account.password)
        if (result.isCreated) {
            account.sso = account.username
            result = await BaseService.save(account)
        }
        return result
    }

    static async update(token: string, data: Admin): Promise<Result> {
        let action = async (accountId: number): Promise<Result> => {
            return BaseService.update(Admin, data, accountId, false)
        }
        return SsoService.actionToken(Admin, token, action)
    }

}