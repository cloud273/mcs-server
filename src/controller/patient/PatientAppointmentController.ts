import { Request, Response } from "express";
import { Req, Post, JsonController, Res, Get, Patch, OnUndefined } from "routing-controllers";
import { Deserialize } from "../../../node/library/utility/Function";
import { PatientAppointmentService } from "../../service/patient/PatientAppointmentService";
import { Appointment } from "../../entity/appointment/Appointment";
import { IdQuery } from "../../common/request/id/IdQuery";
import { AppointmentListQuery } from "../../common/request/appointment/AppointmentListQuery";
import { AppointmentUpdateStatusBody } from "../../common/request/appointment/AppointmentUpdateStatusBody";

@JsonController("/patient/appointment")
export class PatientAppointmentController {

    @Post()
    @OnUndefined(400)
    async create(@Req() request: Request, @Res() response: Response) {
        const token = request.get('token')
        const data = Deserialize(Appointment, request.body)
        if (token != null && data.validateCreate()) {
            const result = await PatientAppointmentService.create(token, data)
            return response.status(result.code).send(result.data)          
        }
    }

    @Get("/list")
    @OnUndefined(400)
    async list(@Req() request: Request, @Res() response: Response) {
        const token = request.get('token')
        const data = Deserialize(AppointmentListQuery, request.query)
        if (token != null && data.validate()) {
            const result = await PatientAppointmentService.gets(token, data.type, data.statusTypes, data.from, data.to)
            return response.status(result.code).send(result.data)   
        }
    }

    @Get()
    @OnUndefined(400)
    async get(@Req() request: Request, @Res() response: Response) {
        const token = request.get('token')
        const data = Deserialize(IdQuery, request.query)
        if (token != null && data.validate()) {
            const result = await PatientAppointmentService.get(token, data.id)
            return response.status(result.code).send(result.data)   
        }
    }

    @Patch("/cancel")
    @OnUndefined(400)
    async cancel(@Req() request: Request, @Res() response: Response) {
        const token = request.get('token')
        const data = Deserialize(AppointmentUpdateStatusBody, request.body)
        if (token != null && data.validate()) {
            const result = await PatientAppointmentService.cancel(token, data.id, data.note)
            return response.status(result.code).send(result.data)   
        }
    }

}