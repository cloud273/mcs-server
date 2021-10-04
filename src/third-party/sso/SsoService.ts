import { Constant } from "../../../Constant";
import { ApiResponse, Api } from "../../../node/library/http/Api";
import { Result } from "../../common/object/Result";
import { AccountCacheService } from "../../service/other/cache/AccountCacheService";
import { BaseAccount } from "../../service/account/BaseAccount";
import { ObjectType } from "typeorm";

export class SsoService {

    private static host = Constant.sso.host
    private static token = Constant.sso.token

    private static async userRequest(endPoint: string, method: string, qs: {} | null, body: {} | null) : Promise<ApiResponse> {
        const uri = this.host + '/api' + endPoint
        return Api.request(uri, method, qs, null, body)
    }

    private static async adminRequest(endPoint: string, method: string, qs: {} | null, body: {} | null) : Promise<ApiResponse> {
        const uri = this.host + '/api' + endPoint
        const headers = {
            token: this.token
        }
        return Api.request(uri, method, qs, headers, body)
    }

    /*
     * 400: Bad request, 
     * 403: Invalid token or type, 
     * 500: Unknown
     */
    public static async actionToken<T extends BaseAccount>(type: ObjectType<T>, token: string, action: (accountId: number) => Promise<Result>) : Promise<Result> {
        return this.actionTokenPassword(type, token, null, action)
    }

    /*
     * 400: Bad request, 
     * 403: Invalid token or type, 
     * 404: Invalid password, 
     * 500: Unknown
     */
    public static async actionTokenPassword<T extends BaseAccount>(type: ObjectType<T>, token: string, password: string | null, action: (accountId: number) => Promise<Result>) : Promise<Result> {
        let ssoAction = async (sso: string): Promise<Result> => {
            let result: Result
            const id = await AccountCacheService.instance.get(type, sso)
            if(id == null) {
                result = Result.forbidden()
            } else {
                result = await action(id)
            }
            return result
        }
        return this.ssoActionTokenPassword(type, token, password, ssoAction)
    }

    /*
     * 400: Bad request, 
     * 403: Invalid token or type, 
     * 404: Invalid password, 
     * 500: Unknown
     */
    public static async ssoActionToken<T extends BaseAccount>(type: ObjectType<T>, token: string, action: (sso: string) => Promise<Result>) : Promise<Result> {
        return this.ssoActionTokenPassword(type, token, null, action)
    }

    /*
     * 400: Bad request, 
     * 403: Invalid token or type, 
     * 404: Invalid password, 
     * 500: Unknown
     */
    public static async ssoActionTokenPassword<T extends BaseAccount>(type: ObjectType<T>,token: string, password: string | null, action: (sso: string) => Promise<Result>) : Promise<Result> {
        let result: Result
        const response = await this.get(type, token, password)
        if (response.code == 200) {
            const username = response.data.username
            result = await action(username)
        } else {
            result = Result.initApiResponse(response)
        }
        return result
    }

    /*
     * 200: {username: string} 
     * 400: Bad request, 
     * 403: Invalid token or type, 
     * 404: Invalid password, 
     * 500: Unknown
     */
    public static async get<T extends BaseAccount>(type: ObjectType<T>, token: string, password: string | null) : Promise<ApiResponse> {
        const qs = {
            token: token,
            type: type.name.toLowerCase()
        }
        if (password != null) {
            qs["password"] = password
        }
        return this.userRequest('/account', 'GET', qs, null)
    }

    /*
     * 201: {code: sms|email} 
     * 400: Bad request, 
     * 409: Existed, 
     * 500: Unknown
     */
    public static async register<T extends BaseAccount>(type: ObjectType<T>, username: string, password: string, language: string | null) : Promise<ApiResponse> {
        const body = {
            username: username,
            password: password,
            type: type.name.toLowerCase(),
            language: language
        }
        return this.userRequest('/account', 'POST', null, body)
    }

    /*
     * 200: {code: sms|email} 
     * 400: Bad request, 
     * 404: Not found, 
     * 500: Unknown
     */
    public static async resetActivationCode<T extends BaseAccount>(type: ObjectType<T>, username: string, language: string | null) : Promise<ApiResponse> {
        const body = {
            username: username,
            type: type.name.toLowerCase(),
            language: language
        }
        return this.userRequest('/account/reset-activation-code', 'PATCH', null, body)
    }

    /*
     * 200: {message: successful} 
     * 400: Bad request,
     * 403: Invalid code,  
     * 404: Not found, 
     * 406: Expired code, 
     * 500: Unknown
     */
    public static async activate<T extends BaseAccount>(type: ObjectType<T>,  username: string, code: string) : Promise<ApiResponse> {
        const body = {
            username: username,
            type: type.name.toLowerCase(),
            code: code
        }
        return this.userRequest('/account/activate', 'PATCH', null, body)
    }

    /*
     * 200: {code: sms|email} 
     * 400: Bad request, 
     * 404: Not found, 
     * 500: Unknown
     */
    public static async resetPasswordRequest<T extends BaseAccount>(type: ObjectType<T>, username: string, language: string | null) : Promise<ApiResponse> {
        const body = {
            username: username,
            type: type.name.toLowerCase(),
            language: language
        }
        return this.userRequest('/account/reset-password-request', 'PATCH', null, body)
    }

    /*
     * 200: {code: sms|email} 
     * 400: Bad request, 
     * 403: Invalid code, 
     * 404: Not found, 
     * 406: Expired code, 
     * 500: Unknown
     */
    public static async resetPassword<T extends BaseAccount>(type: ObjectType<T>, username: string, password: string, code: string) : Promise<ApiResponse> {
        const body = {
            username: username,
            password: password,
            type: type.name.toLowerCase(),
            code: code
        }
        return this.userRequest('/account/reset-password', 'PATCH', null, body)
    }

    /*
     * 200: {token: string} 
     * 400: Bad request, 
     * 401: Invalid password, 
     * 403: Inactived, 
     * 404: Not found, 
     * 500: Unknown
     */
    public static async login<T extends BaseAccount>(type: ObjectType<T>, username: string, password: string) : Promise<ApiResponse> { 
        const body = {
            username: username,
            password: password,
            type: type.name.toLowerCase()
        }
        return this.userRequest('/account/login', 'PATCH', null, body)
    }

    /*
     * 200: {token: string} 
     * 400: Bad request, 
     * 403: Invalid token, 
     * 404: Invalid password, 
     * 500: Unknown
     */
    public static async updatePassword<T extends BaseAccount>(type: ObjectType<T>, token: string, password: string, newPassword: string) : Promise<ApiResponse> {
        const body = {
            token: token,
            type: type.name.toLowerCase(),
            password: password,
            newPassword: newPassword
        }
        return this.userRequest('/account/update-password', 'PATCH', null, body)
    }

    /*
     * 200: 
        {
            "id": 0,
            "username": "nglequduph@gmail.com",
            "type": "account",
            "actived": true,
            "token": "string",
            "code": "string"
        }
     * 400: Bad request,
     * 403: Invalid token, 
     * 500: Unknown
     */
    public static async adminGetAccount<T extends BaseAccount>(type: ObjectType<T>, username: string) : Promise<ApiResponse> {
        const qs = {
            username: username,
            type: type.name.toLowerCase()
        }
        return this.adminRequest('/admin/account', 'GET', qs, null)
    }

    /*
     * 201: {message: sucessful} 
     * 400: Bad request,
     * 403: Invalid token, 
     * 409: Existed, 
     * 500: Unknown
     */
    public static async adminCreateAccount<T extends BaseAccount>(type: ObjectType<T>, username: string, password: string, actived: boolean) : Promise<ApiResponse> {
        const body = {
            username: username,
            password: password,
            type: type.name.toLowerCase(),
            actived: actived
        }
        return this.adminRequest('/admin/account', 'POST', null, body)
    }

    /*
     * 200: {message: sucessful} 
     * 400: Bad request,
     * 403: Invalid token, 
     * 404: Not found, 
     * 500: Unknown
     */
    public static async adminDeleteAccount<T extends BaseAccount>(type: ObjectType<T>, username: string) : Promise<ApiResponse> {
        const qs = {
            username: username,
            type: type.name.toLowerCase()
        }
        return this.adminRequest('/admin/account', 'DELETE', qs, null)
    }

    /*
     * 200: {message: sucessful} 
     * 400: Bad request,
     * 403: Invalid token, 
     * 404: Not found, 
     * 409: Existed, 
     * 500: Unknown
     */
    public static async adminUpdateAccountUsername<T extends BaseAccount>(type: ObjectType<T>, username: string, newUsername: string) : Promise<ApiResponse> { 
        const body = {
            username: username,
            newUsername: newUsername,
            type: type.name.toLowerCase()
        }
        return this.adminRequest('/admin/account/username', 'PATCH', null, body)
    }

    /*
     * 200: {message: sucessful} 
     * 400: Bad request,
     * 403: Invalid token, 
     * 404: Not found, 
     * 500: Unknown
     */
    public static async adminDeleteAccountToken<T extends BaseAccount>(type: ObjectType<T>, username: string) : Promise<ApiResponse> { 
        const body = {
            username: username,
            type: type.name.toLowerCase()
        }
        return this.adminRequest('/admin/account/delete-token', 'PATCH', null, body)
    }

    /*
     * 200: 
        {
            "id": 0,
            "username": "nglequduph@gmail.com",
            "type": "account",
            "actived": true,
            "token": "string",
            "code": "string"
        }
     * 400: Bad request,
     * 403: Invalid token, 
     * 500: Unknown
     */
    public static async adminGetList<T extends BaseAccount>(type: ObjectType<T>) : Promise<ApiResponse> {
        const qs = {
            type: type.name.toLowerCase()
        }
        return this.adminRequest('/admin/account/list', 'GET', qs, null)
    }

}