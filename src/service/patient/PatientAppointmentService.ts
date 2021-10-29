import { Appointment } from "../../entity/appointment/Appointment"
import { Result } from "../../common/object/Result"
import { PackageType, StatusType, UserType } from "../../common/object/Enum"
import { SsoService } from "../../third-party/sso/SsoService"
import { Patient } from "../../entity/patient/Patient"
import { CommonRepository } from "../../repository/CommonRepository"
import { WorkingTimeService } from "../other/misc/WorkingTimeService"
import { AppointmentStatus } from "../../entity/appointment/AppointmentStatus"
import { BaseService } from "../../common/business/BaseService"
import { Status } from "../../common/entity/Status"
import { NotifyService } from "../other/notify/NotifyService"
import { AppointmentRepository } from "../../repository/AppointmentRepository"
import AsyncLock = require('async-lock');
import { Clinic } from "../../entity/clinic/Clinic"
import { Doctor } from "../../entity/clinic/Doctor"
import { AppointmentService } from "../appointment/AppointmentService"

const lock = new AsyncLock({maxPending: 10000})

export class PatientAppointmentService {
    
    static async create(token: string, data: Appointment): Promise<Result> {
        let action = async (accountId: number): Promise<Result> => {
            const patient = await CommonRepository.getActivePatient(accountId)
            if (patient != undefined) {
                const packg = await CommonRepository.getActivePackageWithDoctorAndClinic(data.packageId)
                if (packg != undefined) {
                    if (data.isCreatable) {
                        let result: Result
                        const lockName = `___PatientAppointmentService_create_${packg.doctor.id}___`
                        await lock.acquire(lockName, async () => {
                            if (data.type == packg.type && data.specialty == packg.specialty && data.price.amount == packg.price.amount && data.price.currency == packg.price.currency && data.visitTime == packg.visitTime) {
                                
                                const patientDetail = patient
                                const patientBasic = new Patient()
                                patientBasic.profile = patientDetail.profile
                                patientBasic.image = patientDetail.image

                                const clinicDetail = packg.doctor.clinic
                                const clinicBasic = new Clinic()
                                clinicBasic.name = clinicDetail.name
                                clinicBasic.image = clinicDetail.image

                                const doctorDetail = packg.doctor
                                delete doctorDetail.clinic
                                const doctorBasic = new Doctor()
                                doctorBasic.profile = doctorDetail.profile
                                doctorBasic.image = doctorDetail.image
                                doctorBasic.title = doctorDetail.title

                                data.patientBasic = patientBasic
                                data.patientDetail = patientDetail
                                
                                data.doctorBasic = doctorBasic
                                data.doctorDetail = doctorDetail
                                
                                data.clinicBasic = clinicBasic
                                data.clinicDetail = clinicDetail

                                delete packg.doctor.clinic
                                data.patientId = accountId
                                const from = data.begin
                                const to = data.end
                                const wts = await WorkingTimeService.getListActiveWorkingTimeByPatient(data.packageId, from, to)
                                if (wts != undefined && wts.length == 1) {
                                    const workingTime = wts[0]
                                    const order = workingTime.getOrder(from)
                                    if (order != undefined) {
                                        data.scheduleId = workingTime.scheduleId
                                        data.workingDayId = workingTime.workingDayId
                                        data.order = order
                                        const status = Status.create(UserType.patient, StatusType.created, undefined)
                                        data.status = status
                                        data.statuses = [AppointmentStatus.create(status, undefined)]
                                        await data.generateCode()
                                        result = await BaseService.save(data)
                                        if (result.isCreated) {
                                            NotifyService.appointmentCreatedByPatient(result.data.id)
                                        }
                                    } else {
                                        result = Result.notAcceptable()
                                    }
                                } else {
                                    result = Result.notAcceptable()
                                }
                            } else {
                                result = Result.notAcceptable()
                            }
                        })
                        .catch( (err)=> {
                            result = Result.unknown()
                        })
                        return result
                    } else {
                        return Result.notAcceptable()
                    }
                } else {
                    return Result.notFound()
                }
            } else {
                return Result.forbidden()
            }
        }
        return SsoService.actionToken(Patient, token, action)
    }

    static async gets(token: string, type: PackageType, statusTypes: StatusType[] | undefined, from: Date, to: Date): Promise<Result> {
        let action = async (accountId: number): Promise<Result> => {
            const list = await AppointmentRepository.getListActiveAppointmentByPatient(accountId, type, statusTypes, from, to)
            return Result.success(list)
        }
        return SsoService.actionToken(Patient, token, action)
    }

    static async get(token: string, id: number): Promise<Result> {
        let action = async (accountId: number): Promise<Result> => {
            const obj = await AppointmentRepository.getActiveAppointmentByPatient(accountId, id)
            if (obj != undefined) {
                return Result.success(obj)
            } else {
                return Result.notFound()
            }
        }
        return SsoService.actionToken(Patient, token, action)
    }
 
    static async cancel(token: string, id: number, note: string): Promise<Result> {
        let action = async (accountId: number): Promise<Result> => {
            const obj = await AppointmentRepository.getActiveAppointmentByPatient(accountId, id)
            if (obj != undefined) {
                if (obj.isCancelable) {
                    const success = await AppointmentService.updateStatusActivatedAppointment(id, UserType.patient, StatusType.cancelled, note)
                    if (success) {
                        NotifyService.appointmentCancelledByPatient(id, note, obj.status.value == StatusType.accepted)
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
        return SsoService.actionToken(Patient, token, action)
    }

}
