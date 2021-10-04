import { Request, Response } from "express";
import { Post, Req, JsonController, OnUndefined, Res, Patch, Get } from "routing-controllers";
import { Admin } from "../../entity/admin/Admin";
import { Auth } from "../../support/authenticate/Auth";
import { AdminAccountService } from "../../service/admin/AdminAccountService";
import { Deserialize } from "../../../node/library/utility/Function";
import { AdminDevice } from "../../entity/admin/AdminDevice";
import { DeviceService } from "../../service/device/DeviceService";
import { AccountService } from "../../service/account/AccountService";
import { AdminLoginBody } from "../../common/request/account/LoginBody";
import { UpdatePasswordBody } from "../../common/request/account/UpdatePasswordBody";
import { BaseAccountService } from "../../service/account/BaseAccountService";
import { Language } from "../../common/object/Enum";
import { PasswordResetRequestBody } from "../../common/request/account/PasswordResetRequestBody";
import { PasswordResetBody } from "../../common/request/account/PasswordResetBody";

@JsonController("/admin")
export class AdminAccountController {

    @Post("/login")
    @OnUndefined(400)
    async login(@Req() request: Request, @Res() response: Response) {
        const data = Deserialize(AdminLoginBody, request.body)
        if (data.validateCreate()) {
            const result = await BaseAccountService.login(Admin, data.login.username, data.login.password)
            if (result != undefined) {
                if (result.code == 200) {
                    const token = result.data.token
                    await DeviceService.save(token, data.device)
                }
                return response.status(result.code).send(result.data)
            } 
        }
    }

    @Patch("/update-password")
    @OnUndefined(400)
    async updatePassword(@Req() request: Request, @Res() response: Response) {
        const token = request.get('token')
        const data = Deserialize(UpdatePasswordBody, request.body)
        if (token != undefined && data.validate()) {
            const result = await BaseAccountService.updatePassword(Admin, token, data.password, data.newPassword)
            if (result != undefined) {
                return response.status(result.code).send(result.data)
            } 
        }
    }

    @Patch("/reset-password-request")
    @OnUndefined(400)
    async resetPasswordRequest(@Req() request: Request, @Res() response: Response) {
        const language = Language[request.get('language')]
        const data = Deserialize(PasswordResetRequestBody, request.body)
        if (data.validate() && language != undefined) {
            const result = await BaseAccountService.resetPasswordRequest(Admin, data.username, language)
            if (result != undefined) {
                return response.status(result.code).send(result.data)
            } 
        }
    }

    @Patch("/reset-password")
    @OnUndefined(400)
    async resetPassword(@Req() request: Request, @Res() response: Response) {
        const data = Deserialize(PasswordResetBody, request.body)
        if (data.validate()) {
            const result = await BaseAccountService.resetPassword(Admin, data.username, data.password, data.code)
            if (result != undefined) {
                return response.status(result.code).send(result.data)
            } 
        }
    }

    @Post()
    @OnUndefined(400)
    async create(@Req() request: Request, @Res() response: Response) {
        if (Auth.adminAuthenticate(request)) {
            const data = Deserialize(Admin, request.body)
            if (data.validateCreate()) {
                const result = await AdminAccountService.create(data)
                return response.status(result.code).send(result.data)          
            }
        }
    }

    @Patch()
    @OnUndefined(400)
    async updatePartial(@Req() request: Request, @Res() response: Response) {
        const token = request.get('token')
        const data = Deserialize(Admin, request.body)
        if (token != null && data.validateUpdatePartial()) {
            const result = await AdminAccountService.update(token, data)
            return response.status(result.code).send(result.data)          
        }
    }

    @Get()
    @OnUndefined(400)
    async get(@Req() request: Request, @Res() response: Response) {
        const token = request.get('token')
        if (token != null) {
            const result = await AccountService.getDetail(Admin, token)
            return response.status(result.code).send(result.data)
        }
    }

    @Post("/device")
    @OnUndefined(400)
    async setDevice(@Req() request: Request, @Res() response: Response) {
        const token = request.get('token')
        const data = Deserialize(AdminDevice, request.body)
        if (token != null && data.validateCreate()) {
            const result = await DeviceService.save(token, data)
            return response.status(result.code).send(result.data)          
        }
    }
    
}