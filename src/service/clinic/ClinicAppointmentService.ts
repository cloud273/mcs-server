import { Result } from "../../common/object/Result"
import { PackageType, StatusType, UserType } from "../../common/object/Enum"
import { SsoService } from "../../third-party/sso/SsoService"
import { ClinicUser } from "../../entity/clinic/ClinicUser"
import { NotifyService } from "../other/notify/NotifyService"
import { AppointmentRepository } from "../../repository/AppointmentRepository"
import { AppointmentService } from "../appointment/AppointmentService"

export class ClinicAppointmentService {
    
    static async gets(token: string, type: PackageType, statusTypes: StatusType[] | undefined, from: Date, to: Date): Promise<Result> {
        let action = async (accountId: number): Promise<Result> => {
            const list = await AppointmentRepository.getListActiveAppointmentByClinicAdmin(accountId, type, statusTypes, from, to)
            return Result.success(list)
        }
        return SsoService.actionToken(ClinicUser, token, action)
    }

    static async get(token: string, id: number): Promise<Result> {
        let action = async (accountId: number): Promise<Result> => {
            const obj = await AppointmentRepository.getActiveAppointmentByClinicAdmin(accountId, id)
            if (obj != undefined) {
                return Result.success(obj)
            } else {
                return Result.notFound()
            }
        }
        return SsoService.actionToken(ClinicUser, token, action)
    }
 
    static async accept(token: string, id: number, note: string): Promise<Result> {
        let action = async (accountId: number): Promise<Result> => {
            const obj = await AppointmentRepository.getActiveAppointmentByClinicAdmin(accountId, id)
            if (obj != undefined) {
                if (obj.isAcceptable) {
                    const success = await AppointmentService.updateStatusActivatedAppointment(id, UserType.clinic, StatusType.accepted, note)
                    if (success) {
                        NotifyService.appointmentAcceptedByClinic(id, note)
                        return Result.success()   
                    } else {
                        return Result.notFound()
                    }
                } else {
                    return Result.notAcceptable()
                }
            } else {
                return Result.notFound()
            }
        }
        return SsoService.actionToken(ClinicUser, token, action)
    }

    static async reject(token: string, id: number, note: string): Promise<Result> {
        let action = async (accountId: number): Promise<Result> => {
            const obj = await AppointmentRepository.getActiveAppointmentByClinicAdmin(accountId, id)
            if (obj != undefined) {
                if (obj.isRejectable) {
                    const success = await AppointmentService.updateStatusActivatedAppointment(id, UserType.clinic, StatusType.rejected, note)
                    if (success) {
                        NotifyService.appointmentRejectedByClinic(id, note)
                        return Result.success()   
                    } else {
                        return Result.notFound()
                    }
                } else {
                    return Result.notAcceptable()
                }
            } else {
                return Result.notFound()
            }
        }
        return SsoService.actionToken(ClinicUser, token, action)
    }

}
