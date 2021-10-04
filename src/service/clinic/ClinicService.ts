import { Result } from "../../common/object/Result";
import { SsoService } from "../../third-party/sso/SsoService";
import { BaseService } from "../../common/business/BaseService";
import { OwnerBaseService } from "../../common/business/OwnerBaseService";
import { BaseRepository } from "../../common/business/basic/BaseRepository";
import { WorkingDay } from "../../entity/clinic/WorkingDay";
import { CheckActiveRepository } from "../../repository/CheckActiveRepository";
import { ClinicUser } from "../../entity/clinic/ClinicUser";
import { CommonRepository } from "../../repository/CommonRepository";
import { Package } from "../../entity/clinic/Package";
import { Doctor } from "../../entity/clinic/Doctor";
import { WorkingTimeService } from "../other/misc/WorkingTimeService";

export class ClinicService {

    //-------------------Clinic---------------------//
    static async getClinicWithCert(token: string): Promise<Result> {
        let action = async (accountId: number): Promise<Result> => {
            const user = await BaseRepository.getById(ClinicUser, ['clinicId'], accountId, false)
            if (user != undefined) {
                const obj = await CommonRepository.getClinicWithCert(user.clinicId, false)
                if (obj != undefined) {
                    return Result.success(obj)
                } else {
                    return Result.unknown()
                }
            } else {
                return Result.unknown()
            }
        }
        return SsoService.actionToken(ClinicUser, token, action)
    }

    //-------------------Doctor---------------------//
    static async getListDoctor(token: string): Promise<Result> {
        let action = async (accountId: number): Promise<Result> => {
            const user = await BaseRepository.getById(ClinicUser, ['clinicId'], accountId, false)
            if (user != undefined) {
                const list = await CommonRepository.getListActiveDoctorByClinic(user.clinicId)
                return Result.success(list)
            } else {
                return Result.unknown()
            }
        }
        return SsoService.actionToken(ClinicUser, token, action)
    }

    static async getDoctorWithCert(token: string, id: number): Promise<Result> {
        let action = async (accountId: number): Promise<Result> => {
            const user = await BaseRepository.getById(ClinicUser, ['clinicId'], accountId, false)
            if (user != undefined) {
                const obj = await CommonRepository.getActiveDoctorWithCertByClinic(id, user.clinicId)
                if (obj == undefined) {
                    return Result.notFound()
                } else {
                    return Result.success(obj)
                }
            } else {
                return Result.unknown()
            }
        }
        return SsoService.actionToken(ClinicUser, token, action)
    }

    //-------------------Package-Schedule---------------------//
    static async getListPackage(token: string, doctorId: number): Promise<Result> {
        let action = async (accountId: number): Promise<Result> => {
            const user = await BaseRepository.getById(ClinicUser, ['clinicId'], accountId, false)
            if (user != undefined) {
                const doctor = await BaseRepository.getById(Doctor, ['clinicId'], doctorId, false)
                if (doctor != undefined && doctor.clinicId == user.clinicId) {
                    return OwnerBaseService.getList(Package, 'doctorId', doctorId, false)
                } else {
                    return Result.notFound()
                }
            } else {
                return Result.unknown()
            }
        }
        return SsoService.actionToken(ClinicUser, token, action)
    }

    static async getPackageWithSchedule(token: string, id: number, from: Date): Promise<Result> {
        let action = async (accountId: number): Promise<Result> => {
            const user = await BaseRepository.getById(ClinicUser, ['clinicId'], accountId, false)
            if (user != undefined) {
                const obj = await CommonRepository.getActivePackageWithScheduleByClinic(id, user.clinicId, from)
                if (obj == undefined) {
                    return Result.notFound()
                } else {
                    return Result.success(obj)
                }
            } else {
                return Result.unknown()
            }
        }
        return SsoService.actionToken(ClinicUser, token, action)
    }

    //-------------------WorkingTime---------------------//
    static async getListWorkingTime(token: string, doctorId: number, from: Date, to: Date): Promise<Result> {
        let action = async (accountId: number): Promise<Result> => {
            const user = await BaseRepository.getById(ClinicUser, ['clinicId'], accountId, false)
            if (user != undefined) {
                const list = await WorkingTimeService.getListWorkingTimeByDoctorOrClinic(doctorId, user.clinicId, from, to)
                return Result.success(list)
            } else {
                return Result.unknown()
            }
        }
        return SsoService.actionToken(ClinicUser, token, action)
    }

    //-------------------WorkingDay---------------------//
    static async saveWorkingDay(token: string, data: WorkingDay): Promise<Result> {
        let action = async (accountId: number): Promise<Result> => {
            if (await CheckActiveRepository.isExistedActivePackageByClinicAdmin(accountId, data.packageId)) {
                const id = await CommonRepository.getActiveWorkingDayId(data.packageId, data.date)
                if (id != undefined) {
                    data.id = id
                }
                return BaseService.save(data)
            } else {
                return Result.notFound()
            }
        }
        return SsoService.actionToken(ClinicUser, token, action)
    }

}