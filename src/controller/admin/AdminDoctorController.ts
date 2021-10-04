import { Request, Response } from "express";
import { Post, Req, JsonController, Res, Put, Patch, Get, OnUndefined } from "routing-controllers";
import { Deserialize } from "../../../node/library/utility/Function";
import { Doctor } from "../../entity/clinic/Doctor";
import { AdminClinicService } from "../../service/admin/AdminClinicService";
import { IdBody } from "../../common/request/id/IdBody";
import { IdQuery } from "../../common/request/id/IdQuery";
import { ClinicIdQuery } from "../../common/request/id/ClinicIdQuery";

@JsonController("/admin/doctor")
export class AdminDoctorController {

    @Post()
    @OnUndefined(400)
    async create(@Req() request: Request, @Res() response: Response) {
        const token = request.get('token')
        const data = Deserialize(Doctor, request.body)
        if (token != null && data.validateCreate()) {
            const result = await AdminClinicService.createDoctor(token, data)
            return response.status(result.code).send(result.data)          
        }
    }

    @Put()
    @OnUndefined(400)
    async update(@Req() request: Request, @Res() response: Response) {
        const token = request.get('token')
        const data = Deserialize(Doctor, request.body)
        if (token != null && data.validateUpdateWithID()) {
            const result = await AdminClinicService.updateDoctor(token, data)
            return response.status(result.code).send(result.data)          
        }
    }

    @Patch()
    @OnUndefined(400)
    async updatePartial(@Req() request: Request, @Res() response: Response) {
        const token = request.get('token')
        const data = Deserialize(Doctor, request.body)
        if (token != null && data.validateUpdatePartialWithID()) {
            const result = await AdminClinicService.updateDoctor(token, data)
            return response.status(result.code).send(result.data)          
        }
    }

    @Get()
    @OnUndefined(400)
    async get(@Req() request: Request, @Res() response: Response) {
        const token = request.get('token')
        const data = Deserialize(IdQuery, request.query)
        if (token != null && data.validate()) {
            const result = await AdminClinicService.getDoctor(token, data.id, undefined)
            return response.status(result.code).send(result.data)
        }
    }

    @Get("/list")
    @OnUndefined(400)
    async list(@Req() request: Request, @Res() response: Response) {
        const token = request.get('token')
        const data = Deserialize(ClinicIdQuery, request.query)
        if (token != null && data.validate()) {
            const result = await AdminClinicService.getListDoctor(token, data.clinicId, undefined)
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
            const result = await AdminClinicService.deactivate(Doctor, token, data.id)
            return response.status(result.code).send(result.data)
        }
    }

}