import { Request, Response } from "express";
import { Req, Post, JsonController, Get, Put, Delete, Res, OnUndefined } from "routing-controllers";
import { PatientHealthService } from "../../service/patient/PatientHealthService";
import { Allergy } from "../../entity/patient/Allergy";
import { Surgery } from "../../entity/patient/Surgery";
import { Medication } from "../../entity/patient/Medication";
import { Deserialize } from "../../../node/library/utility/Function";
import { IdQuery } from "../../common/request/id/IdQuery";

@JsonController("/patient/health")
export class PatientHealthController {

    @Get()
    @OnUndefined(400)
    async get(@Req() request: Request, @Res() response: Response) {
        const token = request.get('token')
        if (token != null) {
            const result = await PatientHealthService.get(token)
            return response.status(result.code).send(result.data)
        }
    }

    @Post("/allergy")
    @OnUndefined(400)
    async createAllergy(@Req() request: Request, @Res() response: Response) {
        const token = request.get('token')
        const data = Deserialize(Allergy, request.body)
        if (token != null && data.validateCreate()) {
            const result = await PatientHealthService.insert(token, data)
            return response.status(result.code).send(result.data)          
        }
    }

    @Put("/allergy")
    @OnUndefined(400)
    async updateAllergy(@Req() request: Request, @Res() response: Response) {
        const token = request.get('token')
        const data = Deserialize(Allergy, request.body)
        if (token != null && data.validateUpdateWithID()) {
            const result = await PatientHealthService.update(token, data)
            return response.status(result.code).send(result.data)          
        }
    }

    @Delete("/allergy")
    @OnUndefined(400)
    async deleteAllergy(@Req() request: Request, @Res() response: Response) {
        const token = request.get('token')
        const data = Deserialize(IdQuery, request.query)
        if (token != null && data.validate()) {
            const result = await PatientHealthService.delete(Allergy, token, data.id)
            return response.status(result.code).send(result.data)
        }
    }

    @Post("/surgery")
    @OnUndefined(400)
    async createSurgery(@Req() request: Request, @Res() response: Response) {
        const token = request.get('token')
        const data = Deserialize(Surgery, request.body)
        if (token != null && data.validateCreate()) {
            const result = await PatientHealthService.insert(token, data)
            return response.status(result.code).send(result.data)          
        }
    }

    @Put("/surgery")
    @OnUndefined(400)
    async updateSurgery(@Req() request: Request, @Res() response: Response) {
        const token = request.get('token')
        const data = Deserialize(Surgery, request.body)
        if (token != null && data.validateUpdateWithID()) {
            const result = await PatientHealthService.update(token, data)
            return response.status(result.code).send(result.data)          
        }
    }

    @Delete("/surgery")
    @OnUndefined(400)
    async deleteSurgery(@Req() request: Request, @Res() response: Response) {
        const token = request.get('token')
        const data = Deserialize(IdQuery, request.query)
        if (token != null && data.validate()) {
            const result = await PatientHealthService.delete(Surgery, token, data.id)
            return response.status(result.code).send(result.data)
        }
    }

    @Put("/medication")
    @OnUndefined(400)
    async updateMedication(@Req() request: Request, @Res() response: Response) {
        const token = request.get('token')
        const data = Deserialize(Medication, request.body)
        if (token != null && data.validateUpdateWithID()) {
            const result = await PatientHealthService.update(token, data)
            return response.status(result.code).send(result.data)          
        }
    }

}