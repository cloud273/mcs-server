import { Response } from "express";
import { JsonController, Get, Res } from "routing-controllers";
import { ConfigService } from "../../service/other/misc/ConfigService";

@JsonController("/config")
export class ConfigController {

    @Get()
    async get(@Res() response: Response) {
        return response.status(200).send(ConfigService.instance.get()) 
    }

    @Get("/reasons")
    async getPackage(@Res() response: Response) {
        return response.status(200).send(ConfigService.instance.getReasons()) 
    }

    @Get("/countries")
    async getCountry(@Res() response: Response) {
        return response.status(200).send(ConfigService.instance.getCountry()) 
    }
    
    @Get("/specialties")
    async getSpecialty(@Res() response: Response) {
        return response.status(200).send(ConfigService.instance.getSpecialty()) 
    }

}