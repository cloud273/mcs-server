import { Result } from "../../common/object/Result";
import { Admin } from "../../entity/admin/Admin";
import { Clinic } from "../../entity/clinic/Clinic";
import { ClinicUser } from "../../entity/clinic/ClinicUser";
import { SsoService } from "../../third-party/sso/SsoService";
import { Doctor } from "../../entity/clinic/Doctor";
import { ClinicCert } from "../../entity/clinic/ClinicCert";
import { DoctorCert } from "../../entity/clinic/DoctorCert";
import { Package } from "../../entity/clinic/Package";
import { ObjectType } from "typeorm";
import { GetType } from "../../../node/library/utility/Function";
import { BaseService } from "../../common/business/BaseService";
import { OwnerBaseService } from "../../common/business/OwnerBaseService";
import { BaseAccountService } from "../account/BaseAccountService";
import { BaseRepository } from "../../common/business/basic/BaseRepository";
import { Schedule } from "../../entity/clinic/Schedule";
import { WorkingDay } from "../../entity/clinic/WorkingDay";
import { CheckActiveRepository } from "../../repository/CheckActiveRepository";
import { CommonRepository } from "../../repository/CommonRepository";
import { AccountCacheService } from "../other/cache/AccountCacheService";

export class AdminClinicService {

    //-------------------Common---------------------//
    static async save(token: string, data: ClinicCert | DoctorCert): Promise<Result> {
        let action = async (accountId: number): Promise<Result> => {
            return BaseService.save(data)
        }
        return SsoService.actionToken(Admin, token, action)
    }

    static async update(token: string, data: Clinic | ClinicCert | DoctorCert | Package): Promise<Result> {
        let action = async (accountId: number): Promise<Result> => {
            const id = data.id
            delete data.id
            return BaseService.update(GetType(data), data, id, false)
        }
        return SsoService.actionToken(Admin, token, action)
    }

    static async get(table: ObjectType<ClinicCert | DoctorCert | Package | Schedule | WorkingDay>, token: string, id: number, deactivated: boolean| undefined): Promise<Result> {
        let action = async (accountId: number): Promise<Result> => {
            return BaseService.getDetail(table, id, deactivated)
        }
        return SsoService.actionToken(Admin, token, action)
    }

    static async deactivate(table: ObjectType<Clinic | Doctor | ClinicCert | DoctorCert | Package | Schedule | WorkingDay>, token: string, id: number): Promise<Result> {
        let action = async (accountId: number): Promise<Result> => {
            const result = await BaseService.deactivate(table, id)
            if (result.isSuccess) {
                if (table == Doctor) {
                    AccountCacheService.instance.remove(table, id)
                } else if (table == Clinic) {
                    AccountCacheService.instance.clearClinicCache()
                }
            }
            return result
        }
        return SsoService.actionToken(Admin, token, action)
    }

    //-------------------Clinic---------------------//
    static async createClinic(token: string, clinic: Clinic, user: ClinicUser): Promise<Result> {
        let action = async (accountId: number): Promise<Result> => {
            const result = await BaseAccountService.adminCreate(ClinicUser, user.username, user.password)
            if (result.isCreated) {
                user.sso = user.username
                clinic.users = [user]
                return BaseService.save(clinic)
            } else {
                return result
            }
        }
        return SsoService.actionToken(Admin, token, action)
    }

    static async getListClinic(token: string, deactivated: boolean| undefined): Promise<Result> {
        let action = async (accountId: number): Promise<Result> => {
            return BaseService.getList(Clinic, deactivated)
        }
        return SsoService.actionToken(Admin, token, action)
    }
    
    static async getClinicWithCert(token: string, id: number, deactivated: boolean| undefined): Promise<Result> {
        let action = async (accountId: number): Promise<Result> => {
            const obj = await CommonRepository.getClinicWithCert(id, deactivated)
            if (obj == undefined) {
                return Result.notFound()
            } else {
                return Result.success(obj)
            }
        }
        return SsoService.actionToken(Admin, token, action)
    }

    //-------------------Doctor---------------------//
    static async createDoctor(token: string, data: Doctor): Promise<Result> {
        let action = async (accountId: number): Promise<Result> => {
            const result = await BaseAccountService.adminCreate(Doctor, data.username, data.password)
            if (result.isCreated) {
                data.sso = data.username
                return BaseService.save(data)
            } else {
                return result
            }
        }
        return SsoService.actionToken(Admin, token, action)
    }

    static async updateDoctor(token: string, data: Doctor): Promise<Result> {
        let action = async (accountId: number): Promise<Result> => {
            const id = data.id
            delete data.id
            return BaseService.update(Doctor, data, id, false)
        }
        return SsoService.actionToken(Admin, token, action)
    }

    static async getListDoctor(token: string, clinicId: number, deactivated: boolean| undefined): Promise<Result> {
        let action = async (accountId: number): Promise<Result> => {
            if (await BaseRepository.isExisted(Clinic, 'id', clinicId)) {
                return OwnerBaseService.getList(Doctor, 'clinicId', clinicId, deactivated)
            } else {
                return Result.notFound()
            }
        }
        return SsoService.actionToken(Admin, token, action)
    }

    static async getDoctor(token: string, id: number, deactivated: boolean| undefined): Promise<Result> {
        let action = async (accountId: number): Promise<Result> => {
            const obj = await CommonRepository.getDoctorWithCert(id, deactivated)
            if (obj == undefined) {
                return Result.notFound()
            } else {
                return Result.success(obj)
            }
        }
        return SsoService.actionToken(Admin, token, action)
    }

    //-------------------Package---------------------//
    static async savePackage(token: string, data: Package): Promise<Result> {
        let action = async (accountId: number): Promise<Result> => {
            if (data.specialty != null) {
                const doctor = await BaseRepository.getById(Doctor, ['specialties'], data.doctorId)
                if (doctor != null) {
                    if (doctor.specialties.indexOf(data.specialty) < 0) {
                        return Result.notAcceptable()
                    } else {
                        if (await CheckActiveRepository.isExistedPackage(data.doctorId, data.type, data.specialty, undefined)) {
                            return Result.existed()
                        } else {
                            return BaseService.save(data)
                        }
                    }
                } else {
                    return Result.notFound()
                }
            } else {
                return BaseService.save(data)
            }
        }
        return SsoService.actionToken(Admin, token, action)
    }

    static async getListPackage(token: string, doctorId: number, deactivated: boolean| undefined): Promise<Result> {
        let action = async (accountId: number): Promise<Result> => {
            if (await BaseRepository.isExisted(Doctor, 'id', doctorId)) {
                return OwnerBaseService.getList(Package, 'doctorId', doctorId, deactivated)
            } else {
                return Result.notFound()
            }
        }
        return SsoService.actionToken(Admin, token, action)
    }

    //-------------------Schedule---------------------//
    static async saveSchedule(token: string, data: Schedule): Promise<Result> {
        let action = async (accountId: number): Promise<Result> => {
            if (await CheckActiveRepository.isCollapsedSchedule(data.packageId, data.duration.from, data.duration.to, undefined)) {
                return Result.existed()
            } else {
                return BaseService.save(data)
            }
        }
        return SsoService.actionToken(Admin, token, action)
    }

    static async updateSchedule(token: string, data: Schedule): Promise<Result> {
        let action = async (accountId: number): Promise<Result> => {
            const id = data.id
            delete data.id
            const schedule = await BaseRepository.getById(Schedule, ['packageId'], id, false) 
            if (schedule != null) {
                if (await CheckActiveRepository.isCollapsedSchedule(schedule.packageId, data.duration.from, data.duration.to, id)) {
                    return Result.existed()
                } else {
                    return BaseService.update(Schedule, data, id, false)
                }
            } else {
                return Result.notFound()
            }
        }
        return SsoService.actionToken(Admin, token, action)
    }

    static async getListSchedule(token: string, packageId: number,deactivated: boolean| undefined): Promise<Result> {
        let action = async (accountId: number): Promise<Result> => {
            if (await BaseRepository.isExisted(Package, 'id', packageId)) {
                return OwnerBaseService.getList(Schedule, 'packageId', packageId, deactivated)
            } else {
                return Result.notFound()
            }
        }
        return SsoService.actionToken(Admin, token, action)
    }

}