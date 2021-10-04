import { Request, Response } from "express";
import { Post, Req, JsonController, Res, OnUndefined } from "routing-controllers";
import { Deserialize } from "../../../node/library/utility/Function";
import { WorkingDay } from "../../entity/clinic/WorkingDay";
import { ClinicService } from "../../service/clinic/ClinicService";

@JsonController("/clinic/doctor/working-day")
export class ClinicWorkingDayController {

    @Post()
    @OnUndefined(400)
    async create(@Req() request: Request, @Res() response: Response) {
        const token = request.get('token')
        const data = Deserialize(WorkingDay, request.body)
        if (token != null && data.validateCreate()) {
            const result = await ClinicService.saveWorkingDay(token, data)
            return response.status(result.code).send(result.data)          
        }
    }

}
