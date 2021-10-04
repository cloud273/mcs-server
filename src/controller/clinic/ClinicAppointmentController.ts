import { Request, Response } from "express";
import { Req, JsonController, Res, Get, Patch, OnUndefined } from "routing-controllers";
import { Deserialize } from "../../../node/library/utility/Function";
import { IdQuery } from "../../common/request/id/IdQuery";
import { AppointmentListQuery } from "../../common/request/appointment/AppointmentListQuery";
import { AppointmentUpdateStatusBody } from "../../common/request/appointment/AppointmentUpdateStatusBody";
import { ClinicAppointmentService } from "../../service/clinic/ClinicAppointmentService";

@JsonController("/clinic/appointment")
export class ClinicAppointmentController {

    @Get("/list")
    @OnUndefined(400)
    async list(@Req() request: Request, @Res() response: Response) {
        const token = request.get('token')
        const data = Deserialize(AppointmentListQuery, request.query)
        if (token != null && data.validate()) {
            const result = await ClinicAppointmentService.gets(token, data.type, data.statusTypes, data.from, data.to)
            return response.status(result.code).send(result.data)   
        }
    }

    @Get()
    @OnUndefined(400)
    async get(@Req() request: Request, @Res() response: Response) {
        const token = request.get('token')
        const data = Deserialize(IdQuery, request.query)
        if (token != null && data.validate()) {
            const result = await ClinicAppointmentService.get(token, data.id)
            return response.status(result.code).send(result.data)   
        }
    }

    @Patch("/accept")
    @OnUndefined(400)
    async accept(@Req() request: Request, @Res() response: Response) {
        const token = request.get('token')
        const data = Deserialize(AppointmentUpdateStatusBody, request.body)
        if (token != null && data.validate()) {
            const result = await ClinicAppointmentService.accept(token, data.id, data.note)
            return response.status(result.code).send(result.data)   
        }
    }

    @Patch("/reject")
    @OnUndefined(400)
    async reject(@Req() request: Request, @Res() response: Response) {
        const token = request.get('token')
        const data = Deserialize(AppointmentUpdateStatusBody, request.body)
        if (token != null && data.validate()) {
            const result = await ClinicAppointmentService.reject(token, data.id, data.note)
            return response.status(result.code).send(result.data)   
        }
    }

}