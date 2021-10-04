import { Result } from "../../common/object/Result";
import { getCustomRepository, ObjectType } from "typeorm";
import { Language } from "../../common/object/Enum";
import { SsoService } from "../../third-party/sso/SsoService";
import { BaseAccount } from "./BaseAccount";
import { BaseAccountRepository } from "./BaseAccountRepository";

export class BaseAccountService {

    static async register<T extends BaseAccount>(table: ObjectType<T>, username: string, password: string, language: Language): Promise<Result> {
        const account = await getCustomRepository(BaseAccountRepository).get(table, username)
        if (account == undefined) {
            const response = await SsoService.register(table, username, password, language)
            return Result.initApiResponse(response)
        } else {
            return Result.existed()
        }
    }

    static async activateRequest<T extends BaseAccount>(table: ObjectType<T>, username: string, language: Language): Promise<Result> {
        const response = await SsoService.resetActivationCode(table, username, language)
        return Result.initApiResponse(response)
    }

    static async activate<T extends BaseAccount>(table: ObjectType<T>, username: string, code: string): Promise<Result> {
        const response = await SsoService.activate(table, username, code)
        return Result.initApiResponse(response)
    }

    static async login<T extends BaseAccount>(table: ObjectType<T>, username: string, password: string): Promise<Result> {
        let result: Result
        const account = await getCustomRepository(BaseAccountRepository).get(table, username)
        if (account == undefined) {
            let response = await SsoService.login(table, username, password)
            if (response.code == 200) {
                response.code = 202
            }
            result = Result.initApiResponse(response)
        } else {
            if (account.deactivated) {
                result = Result.init(423)
            } else {
                let response = await SsoService.login(table, account.sso, password)
                result = Result.initApiResponse(response)
            }
        }
        return result
    }

    static async updatePassword<T extends BaseAccount>(table: ObjectType<T>, token: string, password: string, newPassword: string): Promise<Result> {
        const response = await SsoService.updatePassword(table, token, password, newPassword)
        return Result.initApiResponse(response)
    }

    static async resetPasswordRequest<T extends BaseAccount>(table: ObjectType<T>, username: string, language: Language): Promise<Result> {
        const account = await getCustomRepository(BaseAccountRepository).get(table, username)
        const sso = (account == undefined) ? username : (account.deactivated ? undefined : account.sso)
        if (sso == undefined) {
            return Result.notFound()
        } else {
            const response = await SsoService.resetPasswordRequest(table, sso, language)
            return Result.initApiResponse(response)
        }
    }

    static async resetPassword<T extends BaseAccount>(table: ObjectType<T>, username: string, password: string, code: string): Promise<Result> {
        const account = await getCustomRepository(BaseAccountRepository).get(table, username)
        const sso = (account == undefined) ? username : (account.deactivated ? undefined : account.sso)
        if (sso == undefined) {
            return Result.notFound()
        } else {
            const response = await SsoService.resetPassword(table, sso, password, code)
            return Result.initApiResponse(response)
        }
    }

    static async adminCreate<T extends BaseAccount>(table: ObjectType<T>, username: string, password: string): Promise<Result> {
        const response = await SsoService.adminCreateAccount(table, username, password, true)
        return Result.initApiResponse(response)
    }

}