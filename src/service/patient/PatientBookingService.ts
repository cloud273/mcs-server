import { Result } from "../../common/object/Result";
import { SsoService } from "../../third-party/sso/SsoService";
import { Patient } from "../../entity/patient/Patient";
import { PackageType } from "../../common/object/Enum";
import { CommonRepository } from "../../repository/CommonRepository";
import { BaseRepository } from "../../common/business/basic/BaseRepository";
import { WorkingTimeService } from "../other/misc/WorkingTimeService";
import { Symptom } from "../../common/entity/Symptom";
import { ConfigService } from "../other/misc/ConfigService";

export class PatientBookingService {

    static async getListSpecialty(token: string, symptoms: Symptom[]): Promise<Result> {
        let action = async (accountId: number): Promise<Result> => {
            // TODO: find right specialty base on symptom
            const doctors = ConfigService.instance.getSpecialty()
            return Result.success(doctors)
        }
        return SsoService.actionToken(Patient, token, action)
    }

    static async getListDoctor(token: string, type: PackageType, specialty: string): Promise<Result> {
        let action = async (accountId: number): Promise<Result> => {
            const patient = await BaseRepository.getById(Patient, Patient.address(), accountId, false)
            if (patient == null) {
                return Result.forbidden()
            } else {
                // const country = patient.address.country
                // const state = patient.address.state
                // const long = (longitude != undefined) ? longitude : patient.address.longitude
                // const lait = (latitude != undefined) ? latitude : patient.address.latitude
                // TODO sorted by this and even by rated point and more
                const doctors = await CommonRepository.getListActiveDoctorWithClinicByTypeAndSpecialty(type, specialty)
                return Result.success(doctors)
            }
        }
        return SsoService.actionToken(Patient, token, action)
    }

    static async getDoctor(token: string, id: number, type: PackageType, specialty: string): Promise<Result> {
        let action = async (accountId: number): Promise<Result> => {
            const obj = await CommonRepository.getActiveDoctorWithCertAndPackageAndClinic(id, type, specialty)
            if (obj == undefined) {
                return Result.notFound()
            } else {
                return Result.success(obj)
            }
        }
        return SsoService.actionToken(Patient, token, action)
    }

    static async getListActiveWorkingTime(token: string, packageId: number, from: Date, to: Date): Promise<Result> {
        let action = async (accountId: number): Promise<Result> => {
            const wts = await WorkingTimeService.getListActiveWorkingTimeByPatient(packageId, from, to)
            if (wts != undefined) {
                for (const wt of wts) {
                    delete wt.appointments
                    delete wt.packageId
                }
                return Result.success(wts)
            } else {
                return Result.notFound()
            }
        }
        return SsoService.actionToken(Patient, token, action)
    }

    static async getListActiveBookingTime(token: string, packageId: number, from: Date, to: Date): Promise<Result> {
        let action = async (accountId: number): Promise<Result> => {
            const list = await WorkingTimeService.getListActiveBookingTimeByPatient(packageId, from, to)
            if (list != undefined) {
                return Result.success(list)
            } else {
                return Result.notFound()
            }
        }
        return SsoService.actionToken(Patient, token, action)
    }

}