import { Request, Response } from "express";
import { Req, Post, JsonController, Patch, Res, OnUndefined } from "routing-controllers";
import { Doctor } from "../../entity/clinic/Doctor";
import { Deserialize } from "../../../node/library/utility/Function";
import { DoctorDevice } from "../../entity/clinic/DoctorDevice";
import { DeviceService } from "../../service/device/DeviceService";
import { DoctorLoginBody } from "../../common/request/account/LoginBody";
import { UpdatePasswordBody } from "../../common/request/account/UpdatePasswordBody";
import { BaseAccountService } from "../../service/account/BaseAccountService";
import { Language } from "../../common/object/Enum";
import { PasswordResetRequestBody } from "../../common/request/account/PasswordResetRequestBody";
import { PasswordResetBody } from "../../common/request/account/PasswordResetBody";

@JsonController("/doctor")
export class DoctorAccountController {

    @Post("/login")
    @OnUndefined(400)
    async login(@Req() request: Request, @Res() response: Response) {
        const data = Deserialize(DoctorLoginBody, request.body)
        if (data.validateCreate()) {
            const result = await BaseAccountService.login(Doctor, data.login.username, data.login.password)
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
            const result = await BaseAccountService.updatePassword(Doctor, token, data.password, data.newPassword)
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
            const result = await BaseAccountService.resetPasswordRequest(Doctor, data.username, language)
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
            const result = await BaseAccountService.resetPassword(Doctor, data.username, data.password, data.code)
            if (result != undefined) {
                return response.status(result.code).send(result.data)
            } 
        }
    }

    @Post("/device")
    @OnUndefined(400)
    async setDevice(@Req() request: Request, @Res() response: Response) {
        const token = request.get('token')
        const data = Deserialize(DoctorDevice, request.body)
        if (token != null && data.validateCreate()) {
            const result = await DeviceService.save(token, data)
            return response.status(result.code).send(result.data)          
        }
    }

}