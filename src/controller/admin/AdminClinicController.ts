import { Request, Response } from "express";
import { Post, Req, JsonController, Res, OnUndefined, Put, Patch, Get } from "routing-controllers";
import { Deserialize } from "../../../node/library/utility/Function";
import { Clinic } from "../../entity/clinic/Clinic";
import { AdminClinicService } from "../../service/admin/AdminClinicService";
import { IdBody } from "../../common/request/id/IdBody";
import { IdQuery } from "../../common/request/id/IdQuery";
import { ClinicCreateBody } from "../../common/request/clinic/ClinicCreateBody";

@JsonController("/admin/clinic")
export class AdminClinicController {

    @Post()
    @OnUndefined(400)
    async create(@Req() request: Request, @Res() response: Response) {
        const token = request.get('token')
        const data = Deserialize(ClinicCreateBody, request.body)
        if (token != null && data.validateCreate()) {
            const result = await AdminClinicService.createClinic(token, data.clinic, data.user)
            return response.status(result.code).send(result.data)          
        }
    }

    @Put()
    @OnUndefined(400)
    async update(@Req() request: Request, @Res() response: Response) {
        const token = request.get('token')
        const data = Deserialize(Clinic, request.body)
        if (token != null && data.validateUpdateWithID()) {
            const result = await AdminClinicService.update(token, data)
            return response.status(result.code).send(result.data)          
        }
    }

    @Get()
    @OnUndefined(400)
    async get(@Req() request: Request, @Res() response: Response) {
        const token = request.get('token')
        const data = Deserialize(IdQuery, request.query)
        if (token != null && data.validate()) {
            const result = await AdminClinicService.getClinicWithCert(token, data.id, undefined)
            return response.status(result.code).send(result.data)
        }
    }

    @Get("/list")
    @OnUndefined(400)
    async list(@Req() request: Request, @Res() response: Response) {
        const token = request.get('token')
        if (token != null) {
            const result = await AdminClinicService.getListClinic(token, undefined)
            return response.status(result.code).send(result.data)
        }
    }

    @Patch("/deactivate")
    @OnUndefined(400)
    async deactivate(@Req() request: Request, @Res() response: Response) {
        const token = request.get('token')
        const data = Deserialize(IdBody, request.body)
        if (token != null && data.validate()) {
            // TODO
            const result = await AdminClinicService.deactivate(Clinic, token, data.id)
            return response.status(result.code).send(result.data)
        }
    }

}