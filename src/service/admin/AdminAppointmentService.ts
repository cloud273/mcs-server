import { Result } from "../../common/object/Result"
import { PackageType, StatusType, UserType } from "../../common/object/Enum"
import { SsoService } from "../../third-party/sso/SsoService"
import { Admin } from "../../entity/admin/Admin"
import { NotifyService } from "../other/notify/NotifyService"
import { AppointmentRepository } from "../../repository/AppointmentRepository"
import { AppointmentService } from "../appointment/AppointmentService"

export class AdminAppointmentService {

    static async gets(token: string, type: PackageType, statusTypes: StatusType[] | undefined, from: Date, to: Date): Promise<Result> {
        let action = async (accountId: number): Promise<Result> => {
            const list = await AppointmentRepository.getListActiveAppointmentByAdmin(type, statusTypes, from, to)
            return Result.success(list)
        }
        return SsoService.actionToken(Admin, token, action)
    }

    static async get(token: string, id: number): Promise<Result> {
        let action = async (accountId: number): Promise<Result> => {
            const obj = await AppointmentRepository.getActiveAppointmentByAdmin(id)
            if (obj != undefined) {
                return Result.success(obj)
            } else {
                return Result.notFound()
            }
        }
        return SsoService.actionToken(Admin, token, action)
    }
 
    static async reject(token: string, id: number, note: string): Promise<Result> {
        let action = async (accountId: number): Promise<Result> => {
            const obj = await AppointmentRepository.getActiveAppointmentByAdmin(id)
            if (obj != undefined) {
                const success = await AppointmentService.updateStatusActivatedAppointment(id, UserType.system, StatusType.rejected, note)
                if (success) {
                    NotifyService.appointmentRejectedByAdmin(id, note)
                    return Result.success()   
                } else {
                    return Result.notFound()
                }
            } else {
                return Result.notFound()
            }
        }
        return SsoService.actionToken(Admin, token, action)
    }

}
