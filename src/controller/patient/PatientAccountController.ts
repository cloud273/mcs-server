import { Request, Response } from "express";
import { Req, Post, JsonController, Res, OnUndefined, Patch, Put, Get } from "routing-controllers";
import { Patient } from "../../entity/patient/Patient";
import { PatientAccountService } from "../../service/patient/PatientAccountService";
import { Language } from "../../common/object/Enum";
import { Deserialize } from "../../../node/library/utility/Function";
import { PatientDevice } from "../../entity/patient/PatientDevice";
import { DeviceService } from "../../service/device/DeviceService";
import { PatientLoginBody } from "../../common/request/account/LoginBody";
import { PatientRegisterBody } from "../../common/request/account/PatientRegisterBody";
import { ActivateRequestBody } from "../../common/request/account/ActivateRequestBody";
import { ActivateBody } from "../../common/request/account/ActivateBody";
import { UpdatePasswordBody } from "../../common/request/account/UpdatePasswordBody";
import { BaseAccountService } from "../../service/account/BaseAccountService";
import { PasswordResetRequestBody } from "../../common/request/account/PasswordResetRequestBody";
import { PasswordResetBody } from "../../common/request/account/PasswordResetBody";
import { UpdateUsernameBody } from "../../common/request/account/UpdateUsernameBody";
import { UpdateUsernameRequestBody } from "../../common/request/account/UpdateUsernameRequestBody";

@JsonController("/patient")
export class PatientAccountController {

    @Post("/register")
    @OnUndefined(400)
    async register(@Req() request: Request, @Res() response: Response) {
        const language = Language[request.get('language')]
        const data = Deserialize(PatientRegisterBody, request.body)
        if (data.validate() && language != undefined) {
            const result = await BaseAccountService.register(Patient, data.username, data.password, language)
            if (result != undefined) {
                return response.status(result.code).send(result.data)
            }
        }
         
    }

    @Patch("/activate-request")
    @OnUndefined(400)
    async activateRequest(@Req() request: Request, @Res() response: Response) {
        const language = Language[request.get('language')]
        const data = Deserialize(ActivateRequestBody, request.body)
        if (data.validate() && language != undefined) {
            const result = await BaseAccountService.activateRequest(Patient, data.username, language)
            if (result != undefined) {
                return response.status(result.code).send(result.data)
            } 
        }
    }

    @Patch("/activate")
    @OnUndefined(400)
    async activate(@Req() request: Request, @Res() response: Response) {
        const data = Deserialize(ActivateBody, request.body)
        if (data.validate()) {
            const result = await BaseAccountService.activate(Patient, data.username, data.code)
            if (result != undefined) {
                return response.status(result.code).send(result.data)
            } 
        }
    }

    @Post("/login")
    @OnUndefined(400)
    async login(@Req() request: Request, @Res() response: Response) {
        const data = Deserialize(PatientLoginBody, request.body)
        if (data.validateCreate()) {
            const result = await BaseAccountService.login(Patient, data.login.username, data.login.password)
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
            const result = await BaseAccountService.updatePassword(Patient, token, data.password, data.newPassword)
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
            const result = await BaseAccountService.resetPasswordRequest(Patient, data.username, language)
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
            const result = await BaseAccountService.resetPassword(Patient, data.username, data.password, data.code)
            if (result != undefined) {
                return response.status(result.code).send(result.data)
            } 
        }
    }

    @Patch("/update-username-request")
    @OnUndefined(400)
    async updateUsernameRequest(@Req() request: Request, @Res() response: Response) {
        const token = request.get('token')
        const language = Language[request.get('language')] 
        const data = Deserialize(UpdateUsernameRequestBody, request.body)
        if (token != null && language != null && data.validate()) {
            const result = await PatientAccountService.updateUsernameRequest(token, data.password, data.username, language)
                return response.status(result.code).send(result.data)
        }
    }

    @Patch("/update-username")
    @OnUndefined(400)
    async updateUsername(@Req() request: Request, @Res() response: Response) {
        const token = request.get('token')
        const data = Deserialize(UpdateUsernameBody, request.body)
        if (token != null && data.validate()) {
            const result = await PatientAccountService.updateUsername(token, data.username, data.code)
            return response.status(result.code).send(result.data)
        }
    }

    @Post()
    @OnUndefined(400)
    async create(@Req() request: Request, @Res() response: Response) {
        const token = request.get('token')
        const data = Deserialize(Patient, request.body)
        if (token != null && data.validateCreate()) {
            const result = await PatientAccountService.save(token, data)
            return response.status(result.code).send(result.data)          
        }
    }

    @Put()
    @OnUndefined(400)
    async update(@Req() request: Request, @Res() response: Response) {
        const token = request.get('token')
        const data = Deserialize(Patient, request.body)
        if (token != null && data.validateUpdate()) {
            const result = await PatientAccountService.update(token, data)
            return response.status(result.code).send(result.data)          
        }
    }

    @Patch()
    @OnUndefined(400)
    async updatePartial(@Req() request: Request, @Res() response: Response) {
        const token = request.get('token')
        const data = Deserialize(Patient, request.body)
        if (token != null && data.validateUpdatePartial()) {
            const result = await PatientAccountService.update(token, data)
            return response.status(result.code).send(result.data)          
        }
    }

    @Get()
    @OnUndefined(400)
    async get(@Req() request: Request, @Res() response: Response) {
        const token = request.get('token')
        if (token != null) {
            const result = await PatientAccountService.get(token)
            return response.status(result.code).send(result.data)
        }
    }
    
    @Post("/device")
    @OnUndefined(400)
    async setDevice(@Req() request: Request, @Res() response: Response) {
        const token = request.get('token')
        const data = Deserialize(PatientDevice, request.body)
        if (token != null && data.validateCreate()) {
            const result = await DeviceService.save(token, data)
            return response.status(result.code).send(result.data)          
        }
    }

}