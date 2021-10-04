import { Response, Request } from "express";
import { JsonController, Res, Post, Req, OnUndefined } from "routing-controllers";
import { FormRequest } from "../../support/formdata/FormRequest";

@JsonController("/upload")
export class UploadController {

    @Post("/image")
    @OnUndefined(400)
    async uploadImage(@Req() request: Request, @Res() response: Response) {
        const form = await FormRequest.parse(request)
        if (form != undefined && Object.keys(form.files).length == 1 && Object.keys(form.body).length == 0) {
            const image = form.fileUrl("image", true)
            if (image != undefined ) {
                return response.status(200).send({
                    image: image
                })
            }
        }
         
    }

}