import { Request, Response } from "express";
import { Post, Req, JsonController, Res, Put, Get, Patch, OnUndefined } from "routing-controllers";
import { Deserialize } from "../../../node/library/utility/Function";
import { AdminClinicService } from "../../service/admin/AdminClinicService";
import { Schedule } from "../../entity/clinic/Schedule";
import { IdBody } from "../../common/request/id/IdBody";
import { PackageIdQuery } from "../../common/request/id/PackageIdQuery";

@JsonController("/admin/schedule")
export class AdminScheduleController {

    @Post()
    @OnUndefined(400)
    async create(@Req() request: Request, @Res() response: Response) {
        const token = request.get('token')
        const data = Deserialize(Schedule, request.body)
        if (token != null && data.validateCreate()) {
            const result = await AdminClinicService.saveSchedule(token, data)
            return response.status(result.code).send(result.data)          
        }
    }

    @Put()
    @OnUndefined(400)
    async update(@Req() request: Request, @Res() response: Response) {
        const token = request.get('token')
        const data = Deserialize(Schedule, request.body)
        if (token != null && data.validateUpdateWithID()) {
            const result = await AdminClinicService.updateSchedule(token, data)
            return response.status(result.code).send(result.data)          
        }
    }

    @Get("/list")
    @OnUndefined(400)
    async list(@Req() request: Request, @Res() response: Response) {
        const token = request.get('token')
        const data = Deserialize(PackageIdQuery, request.query)
        if (token != null && data.validate()) {
            const result = await AdminClinicService.getListSchedule(token, data.packageId, undefined)
            return response.status(result.code).send(result.data) 
        }
    }

    @Patch("/deactivate")
    @OnUndefined(400)
    async deactivate(@Req() request: Request, @Res() response: Response) {
        const token = request.get('token')
        const data = Deserialize(IdBody, request.body)
        if (token != null && data.validate()) {
            const result = await AdminClinicService.deactivate(Schedule, token, data.id)
            return response.status(result.code).send(result.data)
        }
    }

}
