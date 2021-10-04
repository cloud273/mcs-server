import { Request, Response } from "express";
import { Req, JsonController, Res, OnUndefined, Get } from "routing-controllers";
import { Deserialize } from "../../../node/library/utility/Function";
import { DoctorService } from "../../service/doctor/DoctorService";
import { IdQuery } from "../../common/request/id/IdQuery";
import { WorkingTimeQuery } from "../../common/request/doctor/WorkingTimeQuery";

@JsonController("/doctor")
export class DoctorController {

    @Get()
    @OnUndefined(400)
    async get(@Req() request: Request, @Res() response: Response) {
        const token = request.get('token')
        if (token != null) {
            const result = await DoctorService.getDoctorWithCert(token)
            return response.status(result.code).send(result.data)
        }
    }

    @Get("/info")
    @OnUndefined(400)
    async getInfo(@Req() request: Request, @Res() response: Response) {
        const token = request.get('token')
        if (token != null) {
            const result = await DoctorService.getDoctorClinicInfoWithCert(token)
            return response.status(result.code).send(result.data)
        }
    }

    @Get("/clinic")
    @OnUndefined(400)
    async getClinic(@Req() request: Request, @Res() response: Response) {
        const token = request.get('token')
        if (token != null) {
            const result = await DoctorService.getClinicWithCert(token)
            return response.status(result.code).send(result.data)
        }
    }

    @Get("/working-time/list")
    @OnUndefined(400)
    async getListWorkingTime(@Req() request: Request, @Res() response: Response) {
        const token = request.get('token')
        const data = Deserialize(WorkingTimeQuery, request.query)
        if (token != null && data.validate()) {
            const result = await DoctorService.getListWorkingTime(token, data.from, data.to)
            return response.status(result.code).send(result.data)
        }
    }

    @Get("/package/list")
    @OnUndefined(400)
    async getListPackage(@Req() request: Request, @Res() response: Response) {
        const token = request.get('token')
        if (token != null) {
            const result = await DoctorService.getListPackage(token)
            return response.status(result.code).send(result.data)
        }
    }

    @Get("/package")
    @OnUndefined(400)
    async getPackage(@Req() request: Request, @Res() response: Response) {
        const token = request.get('token')
        const data = Deserialize(IdQuery, request.query)
        if (token != null && data.validate()) {
            const result = await DoctorService.getPackageWithSchedule(token, data.id, new Date())
            return response.status(result.code).send(result.data)
        }
    }

}