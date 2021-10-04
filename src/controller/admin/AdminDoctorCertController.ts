import { Request, Response } from "express";
import { Post, Req, JsonController, Res, Put, Patch, OnUndefined } from "routing-controllers";
import { Deserialize } from "../../../node/library/utility/Function";
import { DoctorCert } from "../../entity/clinic/DoctorCert";
import { AdminClinicService } from "../../service/admin/AdminClinicService";
import { IdBody } from "../../common/request/id/IdBody";

@JsonController("/admin/doctor-certificate")
export class AdminDoctorCertController {

    @Post()
    @OnUndefined(400)
    async create(@Req() request: Request, @Res() response: Response) {
        const token = request.get('token')
        const data = Deserialize(DoctorCert, request.body)
        if (token != null && data.validateCreate()) {
            const result = await AdminClinicService.save(token, data)
            return response.status(result.code).send(result.data)          
        }
    }

    @Put()
    @OnUndefined(400)
    async update(@Req() request: Request, @Res() response: Response) {
        const token = request.get('token')
        const data = Deserialize(DoctorCert, request.body)
        if (token != null && data.validateUpdateWithID()) {
            const result = await AdminClinicService.update(token, data)
            return response.status(result.code).send(result.data)          
        }
    }

    @Patch("/deactivate")
    @OnUndefined(400)
    async deactivate(@Req() request: Request, @Res() response: Response) {
        const token = request.get('token')
        const data = Deserialize(IdBody, request.body)
        if (token != null && data.validate()) {
            const result = await AdminClinicService.deactivate(DoctorCert, token, data.id)
            return response.status(result.code).send(result.data)
        }
    }

}