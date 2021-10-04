import { IncomingForm, Files, Fields } from "formidable"
import { Constant } from "../../../Constant"
import { File } from "formidable"
import { Request } from "express";

import typeis = require('type-is');
import Fs = require('fs');
import Path = require('path');

export class FormRequest {


    constructor(public request: Request, public files: Files, public body: Fields) {

    }

    public static async parse(request: Request): Promise<FormRequest| undefined> {
        let result: FormRequest
        const type = typeis(request, ['urlencoded', 'json', 'multipart'])
        if (type == 'multipart') {
            const form = new IncomingForm()
            form.uploadDir = Constant.image.tmp
            form.maxFileSize = 20 * 1024 * 1024
            form.multiples = false
            await new Promise((resolve, reject) => {
                form.parse(request, (error: any, fields: Fields, files: Files) => {
                    if (error == null) {
                        result = new FormRequest(request, files, fields) 
                    } 
                    resolve()
                });
            });
        } 
        return result
    }

    public fileUrl(key: string, isImage: boolean = true): string | undefined {
        const file = this.files[key]
        if (file != null && (!isImage || file.type == "image/jpeg" || file.type == "image/png")) {
            const oldPath = file.path
            let newPath = ""
            let existed = true
            let filename = null
            do {
                filename = String.Random()
                newPath = Path.join(Constant.image.dir, filename)
                existed = Fs.existsSync(newPath)
            } while (existed)
            Fs.renameSync(oldPath, newPath)
            return filename
        } else {
            return undefined
        }
    }

    public get(key: string): string | undefined {
        return this.request.get(key)
    }

    public image(key: string): File | undefined {
        if (this.files != null) {
            const file = this.files[key]
            if (file != null && (file.type == "image/jpeg" || file.type == "image/png")) {
                return file
            }
        }
        return undefined
    }

    public file(key: string): File | undefined {
        if (this.files != null) {
            return this.files[key]
        }
        return undefined
    }

}