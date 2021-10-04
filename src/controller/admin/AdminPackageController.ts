import { Request, Response } from "express";
import { Post, Req, JsonController, Res, Put, Get, Patch, OnUndefined } from "routing-controllers";
import { Deserialize } from "../../../node/library/utility/Function";
import { Package } from "../../entity/clinic/Package";
import { AdminClinicService } from "../../service/admin/AdminClinicService";
import { IdBody } from "../../common/request/id/IdBody";
import { DoctorIdQuery } from "../../common/request/id/DoctorIdQuery";

@JsonController("/admin/package")
export class AdminPackageController {

    @Post()
    @OnUndefined(400)
    async create(@Req() request: Request, @Res() response: Response) {
        const token = request.get('token')
        const data = Deserialize(Package, request.body)
        if (token != null && data.validateCreate()) {
            const result = await AdminClinicService.savePackage(token, data)
            return response.status(result.code).send(result.data)          
        }
    }

    @Put()
    @OnUndefined(400)
    async update(@Req() request: Request, @Res() response: Response) {
        const token = request.get('token')
        const data = Deserialize(Package, request.body)
        if (token != null && data.validateUpdateWithID()) {
            const result = await AdminClinicService.update(token, data)
            return response.status(result.code).send(result.data)          
        }
    }
    
    @Get("/list")
    @OnUndefined(400)
    async list(@Req() request: Request, @Res() response: Response) {
        const token = request.get('token')
        const data = Deserialize(DoctorIdQuery, request.query)
        if (token != null && data.validate()) {
            const result = await AdminClinicService.getListPackage(token, data.doctorId, undefined)
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
            const result = await AdminClinicService.deactivate(Package, token, data.id)
            return response.status(result.code).send(result.data)
        }
    }

}
