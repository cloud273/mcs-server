import { Request } from "express";
import { Constant } from "../../../Constant";

export class Auth {

    public static authenticate(request: Request) : boolean {
        const app = request.get('app')
        const os =request.get('os')
        return app != null && os != null
    }

    public static adminAuthenticate(request: Request): boolean {
        if (this.authenticate(request)) {
            return (request.get("fn") == Constant.authenticate.fn 
                    && request.get("ln") == Constant.authenticate.ln 
                    && request.get("bd") == Constant.authenticate.bd 
                    && request.get("ad") == Constant.authenticate.ad)
        }
        return false
    }

}