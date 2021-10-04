import { Result } from "../../common/object/Result"
import { PackageType, StatusType, UserType } from "../../common/object/Enum"
import { SsoService } from "../../third-party/sso/SsoService"
import { Doctor } from "../../entity/clinic/Doctor"
import { NotifyService } from "../other/notify/NotifyService"
import { AppointmentRepository } from "../../repository/AppointmentRepository"
import { AppointmentService } from "../appointment/AppointmentService"

export class DoctorAppointmentService {

    static async gets(token: string, type: PackageType, statusTypes: StatusType[] | undefined, from: Date, to: Date): Promise<Result> {
        let action = async (accountId: number): Promise<Result> => {
            const list = await AppointmentRepository.getListActiveAppointmentByDoctor(accountId, type, statusTypes, from, to)
            return Result.success(list)
        }
        return SsoService.actionToken(Doctor, token, action)
    }

    static async get(token: string, id: number): Promise<Result> {
        let action = async (accountId: number): Promise<Result> => {
            const obj = await AppointmentRepository.getActiveAppointmentByDoctor(accountId, id)
            if (obj != undefined) {
                return Result.success(obj)
            } else {
                return Result.notFound()
            }
        }
        return SsoService.actionToken(Doctor, token, action)
    }

    static async begin(token: string, id: number, note: string): Promise<Result> {
        let action = async (accountId: number): Promise<Result> => {
            const obj = await AppointmentRepository.getActiveAppointmentByDoctor(accountId, id)
            if (obj != undefined) {
                if (obj.isBeginable) {
                    const success = await AppointmentService.updateStatusActivatedAppointment(id, UserType.doctor, StatusType.started, note)
                    if (success) {
                        NotifyService.appointmentBegunByDoctor(id, note)
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
        return SsoService.actionToken(Doctor, token, action)
    }

    static async finish(token: string, id: number, note: string): Promise<Result> {
        let action = async (accountId: number): Promise<Result> => {
            const obj = await AppointmentRepository.getActiveAppointmentByDoctor(accountId, id)
            if (obj != undefined) {
                if (obj.isFinishable) {
                    const success = await AppointmentService.updateStatusActivatedAppointment(id, UserType.doctor, StatusType.finished, note)
                    if (success) {
                        NotifyService.appointmentFinishedByDoctor(id, note)
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
        return SsoService.actionToken(Doctor, token, action)
    }

}
