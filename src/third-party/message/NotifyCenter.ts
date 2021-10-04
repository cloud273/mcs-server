import { Device } from "../../common/entity/Device";
import { MessageCenter } from "./MessageCenter";
import { NotifyType, DeviceOS } from "../../common/object/Enum";
import { Log } from "../../../node/library/log/Log";

export class NotifyCenter {

    static async pushDevice(device: Device, title: string, type: NotifyType) {
        switch (device.os) {
            case DeviceOS.ios: {
                await MessageCenter.sendApns(device.token, device.topic, title, null, type, device.production)
                .then(obj => {
                    Log.message("APNS notification success", obj)
                })
                .catch(err => {
                    Log.error("APNS notification error", err)
                })
                break
            }
            case DeviceOS.android: {
                await MessageCenter.sendFcm(device.token, title, null, type)
                .then(obj => {
                    Log.message("Firebase notification success", obj)
                })
                .catch(err => {
                    Log.error("Firebase notification error", err)
                })
                break
            }
            default : {
                Log.error("Push notification unsupported device", device)
            }
        }
    }

    static async sendEmail(to: string, subject: string, message: string, type: NotifyType) {
        await MessageCenter.sendCsEmail(to, subject, message, type)
        .then(obj => {
            Log.message("Send email success", obj)
        })
        .catch(err => {
            Log.error("Send email error", err)
        })
    }

    static async sendSms(to: string, message: string, type: NotifyType) {
        await MessageCenter.sendSms(to, message, type)
        .then(obj => {
            Log.message("Send sms success", obj)
        })
        .catch(err => {
            Log.error("Send sms error", err)
        })
    }


}
