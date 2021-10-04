import { Constant } from "../../../Constant";
import { ApiResponse, Api } from "../../../node/library/http/Api";

export class MessageCenter {

    private static host = Constant.message.host
    private static token = Constant.message.token

    private static async request(endPoint: string, method: string, qs: {} | null, body: {} | null) : Promise<ApiResponse> {
        const uri = this.host + '/api' + endPoint
        const headers = {
            token: this.token
        }
        return Api.request(uri, method, qs, headers, body)
    }

    private static async sendEmail(to: string, sender: string, subject: string, message: string, type: string) : Promise<ApiResponse> {
        const body = {
            to: to,
            sender: sender,
            subject: subject,
            message: message,
            type: type
        }
        return this.request("/email", 'POST', null, body)
    }

    public static async sendCsEmail(to: string, subject: string, message: string, type: string) : Promise<ApiResponse> {
        return this.sendEmail(to, Constant.message.email.customerService, subject, message, type)
    }

    public static async sendSms(to: string, message: string, type: string) : Promise<any> {
        const body = {
            phone: to,
            message: message,
            type: type
        }
        return this.request("/sms", 'POST', null, body)
    }

    public static async sendApns(device: string, appBundle: string, title: string, payload: string, type: string, isProduction: boolean) : Promise<any> {
        const body = {
            devices: [device],
            appBundle: appBundle,
            title: title,
            payload: payload,
            type: type,
            projectId: Constant.message.apns.projectId,
            isProduction: isProduction
        }
        return this.request("/apns", 'POST', null, body)
    }

    public static async sendFcm(device: string, title: string, content: string, type: string) : Promise<any> {
        const body = {
            devices: [device],
            projectId: Constant.message.fcm.projectId,
            title: title,
            body: content,
            type: type,
        }
        return this.request("/fcm", 'POST', null, body)
    }

}