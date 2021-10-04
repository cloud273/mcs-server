import { Request, Response } from "express";
import { JsonController, Req, OnUndefined, Res, Get } from "routing-controllers";
import { Deserialize } from "../../../node/library/utility/Function";
import { PatientBookingService } from "../../service/patient/PatientBookingService";
import { DoctorListQuery } from "../../common/request/booking/DoctorListQuery";
import { DoctorQuery } from "../../common/request/booking/DoctorQuery";
import { TimeQuery } from "../../common/request/booking/TimeQuery";
import { WorkingTimeQuery } from "../../common/request/booking/WorkingTimeQuery";
import { SpecialtyListQuery } from "../../common/request/booking/SpecialtyListQuery";

@JsonController("/patient/booking")
export class PatientBookingController {

    @Get("/specialty/list")
    @OnUndefined(400)
    async getSpecialtyList(@Req() request: Request, @Res() response: Response) {
        const token = request.get('token')
        if (request.query.symptoms != undefined) {
            const str = Buffer.from(request.query.symptoms, 'base64').toString('utf-8')
            if (str != undefined) {
                request.query.symptoms = JSON.parse(str)
            } 
        }
        
        const data = Deserialize(SpecialtyListQuery, request.query)
        if (token != null && data.validate()) {
            const result = await PatientBookingService.getListSpecialty(token, data.symptoms)
            return response.status(result.code).send(result.data) 
        }
    }

    @Get("/doctor/list")
    @OnUndefined(400)
    async getDoctorList(@Req() request: Request, @Res() response: Response) {
        const token = request.get('token')
        const data = Deserialize(DoctorListQuery, request.query)
        if (token != null && data.validate()) {
            const result = await PatientBookingService.getListDoctor(token, data.type, data.specialty)
            return response.status(result.code).send(result.data)      
        }
    }

    @Get("/doctor")
    @OnUndefined(400)
    async getDoctor(@Req() request: Request, @Res() response: Response) {
        const token = request.get('token')
        const data = Deserialize(DoctorQuery, request.query)
        if (token != null && data.validate()) {
            const result = await PatientBookingService.getDoctor(token, data.id, data.type, data.specialty)
            return response.status(result.code).send(result.data)      
        }
    }

    @Get("/working-time/list")
    @OnUndefined(400)
    async workingTimes(@Req() request: Request, @Res() response: Response) {
        const token = request.get('token')
        const data = Deserialize(WorkingTimeQuery, request.query)
        if (token != null && data.validate()) {
            const result = await PatientBookingService.getListActiveWorkingTime(token, data.packageId, data.from, data.to)
            return response.status(result.code).send(result.data)      
        }
    }

    @Get("/time/list")
    @OnUndefined(400)
    async bookingTimes(@Req() request: Request, @Res() response: Response) {
        const token = request.get('token')
        const data = Deserialize(TimeQuery, request.query)
        if (token != null && data.validate()) {
            const result = await PatientBookingService.getListActiveBookingTime(token, data.packageId, data.from, data.to)
            return response.status(result.code).send(result.data)      
        }
    }

}