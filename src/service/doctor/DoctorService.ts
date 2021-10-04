import { Result } from "../../common/object/Result"
import { SsoService } from "../../third-party/sso/SsoService"
import { Doctor } from "../../entity/clinic/Doctor"
import { CommonRepository } from "../../repository/CommonRepository"
import { OwnerBaseService } from "../../common/business/OwnerBaseService"
import { Package } from "../../entity/clinic/Package"
import { BaseRepository } from "../../common/business/basic/BaseRepository"
import { WorkingDay } from "../../entity/clinic/WorkingDay"
import { CheckActiveRepository } from "../../repository/CheckActiveRepository"
import { BaseService } from "../../common/business/BaseService"
import { WorkingTimeService } from "../other/misc/WorkingTimeService"

export class DoctorService {

    //-------------------Doctor---------------------//
    static async getDoctorClinicInfoWithCert(token: string): Promise<Result> {
        let action = async (accountId: number): Promise<Result> => {
            const doctor = await CommonRepository.getDoctorWithCert(accountId, false)
            if (doctor == undefined) {
                return Result.unknown()
            } else {
                const doctorClinic = await BaseRepository.getById(Doctor, ['clinicId'], accountId, false)
                if (doctorClinic == undefined) {
                    return Result.unknown()
                } else {
                    const clinic = await CommonRepository.getClinicWithCert(doctorClinic.clinicId, false)
                    if (clinic == undefined) {
                        return Result.unknown()
                    } else {
                        return Result.success({
                            doctor: doctor,
                            clinic: clinic
                        })
                    }                   
                }
            }
        }
        return SsoService.actionToken(Doctor, token, action)
    }

    static async getDoctorWithCert(token: string): Promise<Result> {
        let action = async (accountId: number): Promise<Result> => {
            const obj = await CommonRepository.getDoctorWithCert(accountId, false)
            if (obj == undefined) {
                return Result.unknown()
            } else {
                return Result.success(obj)
            }
        }
        return SsoService.actionToken(Doctor, token, action)
    }

    //-------------------Clinic---------------------//
    static async getClinicWithCert(token: string): Promise<Result> {
        let action = async (accountId: number): Promise<Result> => {
            const doctor = await BaseRepository.getById(Doctor, ['clinicId'], accountId, false)
            if (doctor != undefined) {
                const obj = await CommonRepository.getClinicWithCert(doctor.clinicId, false)
                if (obj != undefined) {
                    return Result.success(obj)
                } else {
                    return Result.unknown()
                }
            } else {
                return Result.unknown()
            }
            
        }
        return SsoService.actionToken(Doctor, token, action)
    }

    //-------------------Package-Schedule-WorkingDay---------------------//
    static async getListPackage(token: string): Promise<Result> {
        let action = async (accountId: number): Promise<Result> => {
            return OwnerBaseService.getList(Package, 'doctorId', accountId, false)
        }
        return SsoService.actionToken(Doctor, token, action)
    }

    static async getPackageWithSchedule(token: string, id: number, from: Date): Promise<Result> {
        let action = async (accountId: number): Promise<Result> => {
            const obj = await CommonRepository.getActivePackageWithScheduleByDoctor(id, accountId, from)
            if (obj == undefined) {
                return Result.notFound()
            } else {
                return Result.success(obj)
            }
        }
        return SsoService.actionToken(Doctor, token, action)
    }

    //-------------------WorkingTime---------------------//
    static async getListWorkingTime(token: string, from: Date, to: Date): Promise<Result> {
        let action = async (accountId: number): Promise<Result> => {
            const list = await WorkingTimeService.getListWorkingTimeByDoctorOrClinic(accountId, undefined, from, to)
            return Result.success(list)
        }
        return SsoService.actionToken(Doctor, token, action)
    }

    //-------------------WorkingDay---------------------//
    static async saveWorkingDay(token: string, data: WorkingDay): Promise<Result> {
        let action = async (accountId: number): Promise<Result> => {
            const doctor = await BaseRepository.getById(Doctor, ['clinicId'], accountId, false)
            if (doctor != undefined) {
                if (await CommonRepository.isOnlyOneActiveDoctorInClinic(doctor.clinicId)) {
                    if (await CheckActiveRepository.isExistedActivePackageByDoctor(accountId, data.packageId)) {
                        const id = await CommonRepository.getActiveWorkingDayId(data.packageId, data.date)
                        if (id != undefined) {
                            data.id = id
                        }
                        return BaseService.save(data)
                    } else {
                        return Result.notFound()
                    }                   
                } else {
                    return Result.unauthorised()
                }
            } else {
                return Result.unknown()
            }
        }
        return SsoService.actionToken(Doctor, token, action)
    }

}
