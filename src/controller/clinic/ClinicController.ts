import { Request, Response } from "express";
import { Req, JsonController, Res, OnUndefined, Get } from "routing-controllers";
import { Deserialize } from "../../../node/library/utility/Function";
import { IdQuery } from "../../common/request/id/IdQuery";
import { ClinicService } from "../../service/clinic/ClinicService";
import { DoctorIdQuery } from "../../common/request/id/DoctorIdQuery";
import { DoctorWorkingTimeQuery } from "../../common/request/clinic/DoctorWorkingTimeQuery";

@JsonController("/clinic")
export class ClinicController {

    @Get()
    @OnUndefined(400)
    async getClinic(@Req() request: Request, @Res() response: Response) {
        const token = request.get('token')
        if (token != null) {
            const result = await ClinicService.getClinicWithCert(token)
            return response.status(result.code).send(result.data)
        }
    }

    @Get("/doctor/list")
    @OnUndefined(400)
    async getListDoctor(@Req() request: Request, @Res() response: Response) {
        const token = request.get('token')
        if (token != null) {
            const result = await ClinicService.getListDoctor(token)
            return response.status(result.code).send(result.data)
        }
    }

    @Get("/doctor")
    @OnUndefined(400)
    async getDoctor(@Req() request: Request, @Res() response: Response) {
        const token = request.get('token')
        const data = Deserialize(IdQuery, request.query)
        if (token != null && data.validate()) {
            const result = await ClinicService.getDoctorWithCert(token, data.id)
            return response.status(result.code).send(result.data)
        }
    }

    @Get("/doctor/package/list")
    @OnUndefined(400)
    async getPackageList(@Req() request: Request, @Res() response: Response) {
        const token = request.get('token')
        const data = Deserialize(DoctorIdQuery, request.query)
        if (token != null && data.validate()) {
            const result = await ClinicService.getListPackage(token, data.doctorId)
            return response.status(result.code).send(result.data)
        }
    }

    @Get("/doctor/working-time/list")
    @OnUndefined(400)
    async getListWorkingTime(@Req() request: Request, @Res() response: Response) {
        const token = request.get('token')
        const data = Deserialize(DoctorWorkingTimeQuery, request.query)
        if (token != null && data.validate()) {
            const result = await ClinicService.getListWorkingTime(token, data.doctorId, data.from, data.to)
            return response.status(result.code).send(result.data)
        }
    }

    @Get("/doctor/package")
    @OnUndefined(400)
    async getPackage(@Req() request: Request, @Res() response: Response) {
        const token = request.get('token')
        const data = Deserialize(IdQuery, request.query)
        if (token != null && data.validate()) {
            const result = await ClinicService.getPackageWithSchedule(token, data.id, new Date())
            return response.status(result.code).send(result.data)
        }
    }

}