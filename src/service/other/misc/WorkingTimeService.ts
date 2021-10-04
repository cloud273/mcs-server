import { WorkingDay } from "../../../entity/clinic/WorkingDay"
import { TimeRange } from "../../../common/entity/TimeRange"
import { Schedule } from "../../../entity/clinic/Schedule"
import { WorkingTime } from "../../../common/object/WorkingTime"
import { BaseRepository } from "../../../common/business/basic/BaseRepository"
import { Package } from "../../../entity/clinic/Package"
import { CommonRepository } from "../../../repository/CommonRepository"
import { AppointmentRepository } from "../../../repository/AppointmentRepository"
import { Utility } from "../../../support/utility/Utility"

export class WorkingTimeService {

    public static async getListActiveBookingTimeByPatient(packageId: number, from: Date, to: Date): Promise<Date[] | undefined>  {
        const packg = await BaseRepository.getById(Package, ['doctorId'], packageId, false)
        if (packg != undefined) {
            const workingTimes = await this.getListWorkingTimeFromPackage(packageId, from, to)
            if (workingTimes.length == 1) {
                const wt = workingTimes[0]
                if (from.getTime() == wt.begin.getTime() && to.getTime() == wt.end.getTime()) {
                    const appointments = await AppointmentRepository.getListActiveAppointmentOfDoctor(packg.doctorId, from, to)
                    for (const appointment of appointments) {
                        if (wt.begin <= appointment.begin && wt.end >= appointment.end) {
                            wt.append(appointment)
                        }
                    }
                    const today = new Date()
                    const minDate = from > today ?  from : today
                    return wt.blocks(minDate)
                } 
            } 
        } 
        return undefined
    }

    public static async getListActiveWorkingTimeByPatient(packageId: number, from: Date, to: Date): Promise<WorkingTime[] | undefined>  {
        const packg = await BaseRepository.getById(Package, ['doctorId'], packageId, false)
        if (packg != undefined) {
            const today = new Date()
            const minDate = from > today ? from : today
            if (to > minDate) {
                const workingTimes = await this.getListWorkingTimeFromPackage(packageId, minDate, to)
                if (workingTimes.length > 0) {
                    const appointments = await AppointmentRepository.getListActiveAppointmentOfDoctor(packg.doctorId, minDate, to)
                    for (const appointment of appointments) {
                        for (const workingTime of workingTimes) {
                            if (workingTime.begin <= appointment.begin && workingTime.end >= appointment.end) {
                                workingTime.append(appointment)
                            }
                        }
                    }
                    const result: WorkingTime[] = []
                    for (const workingTime of workingTimes) {
                        if (workingTime.isAvailable(minDate)) {
                            result.push(workingTime)
                        }
                    }
                    return result
                } else {
                    return []
                }
            } else {
                return []
            }
        } else {
            return undefined
        }
    }

    public static async getListWorkingTimeByDoctorOrClinic(doctorId: number, clinicId: number | undefined, from: Date, to: Date): Promise<WorkingTime[]> {
        const yesterdayFrom = from.addSecond(-3600 * 24)
        const tomorrowTo = to.addSecond(3600 * 24)
        const wds = await CommonRepository.getListActiveWorkingDayFromDoctor(doctorId, clinicId, yesterdayFrom, tomorrowTo)
        const schedules = await CommonRepository.getListActiveScheduleFromDoctor(doctorId, clinicId, yesterdayFrom, tomorrowTo)
        return this.merge(wds, schedules, from, to)
    }

    private static async getListWorkingTimeFromPackage(packageId: number, from: Date, to: Date): Promise<WorkingTime[]> {
        const yesterdayFrom = from.addSecond(-3600 * 24)
        const tomorrowTo = to.addSecond(3600 * 24)
        const wds = await CommonRepository.getListActiveWorkingDayFromPackage(packageId, yesterdayFrom, tomorrowTo)
        const schedules = await CommonRepository.getListActiveScheduleFromPackage(packageId, yesterdayFrom, tomorrowTo)
        return this.merge(wds, schedules, from, to)
    }

    private static merge(workingDays: WorkingDay[], schedules: Schedule[], from: Date, to: Date): WorkingTime[] {
        const wts = this.getListWorkingTimeFromWorkingDay(workingDays, from, to)
        let wts0 = this.getListWorkingTimeFromSchedule(schedules, from, to)
        if (wts.length > 0) {
            wts0 = wts0.filter((value, index, array) => {
                for (const wt of wts) {
                    if (wt.packageId == value.packageId && wt.begin.dateString() == value.begin.dateString()) {
                        return false
                    }
                }
                return true
            })
        } 
        let result = wts.concat(wts0)
        result = result.filter((value, index, array) => {
            return value.end > value.begin
        })
        return result.sort((v1, v2) => {
            let v = v2.packageId - v1.packageId
            if (v == 0) {
                v = v1.begin > v2.begin ? 1 : -1
            }
            return v
        })
    }

    private static getListWorkingTimeFromWorkingDay(wds: WorkingDay[], from: Date, to: Date): WorkingTime[] {
        const result: WorkingTime[] = []
        for (const wd of wds) {
            const dateString = wd.date
            const timeRanges: TimeRange[] = wd.times
            const timezone = wd.package.doctor.timezone
            if (timeRanges.length > 0) {
                for (const timeRange of timeRanges) {
                    const begin = new Date(`${dateString} ${timeRange.from}${timezone}`)
                    const end = new Date(`${dateString} ${timeRange.to}${timezone}`)
                    if (end > from && begin < to) {
                        const wt = new WorkingTime(begin, end, wd.package.visitTime, wd.package.id, undefined, wd.id)
                        result.push(wt)
                    }
                }
            } else {
                // create Working time with duration is 0
                const begin = new Date(`${dateString} ${'12:00:00'}${timezone}`)
                const end = new Date(`${dateString} ${'12:00:00'}${timezone}`)
                const wt = new WorkingTime(begin, end, wd.package.visitTime, wd.package.id, undefined, wd.id)
                result.push(wt)
            }
            
        }
        return result
    }

    private static getListWorkingTimeFromSchedule(schedules: Schedule[], from: Date, to: Date): WorkingTime[] {
        const result: WorkingTime[] = []
        for (const schedule of schedules) {
            const dateStrings = Utility.getDays(schedule.duration.from, schedule.duration.to)
            const timezone = schedule.package.doctor.timezone   
            for (const dateString of dateStrings) {
                let timeRanges: TimeRange[]
                const date = new Date(dateString)
                const weekday = date.getDay()
                switch (weekday) {
                    case 0:
                        timeRanges = schedule.sunday
                        break;
                    case 1:
                        timeRanges = schedule.monday
                        break;
                    case 2:
                        timeRanges = schedule.tuesday
                        break;
                    case 3:
                        timeRanges = schedule.wednesday
                        break;
                    case 4:
                        timeRanges = schedule.thursday
                        break;
                    case 5:
                        timeRanges = schedule.friday
                        break;
                    case 6:
                        timeRanges = schedule.saturday
                        break;
                    default: 
                        timeRanges = schedule.sunday
                        break
                }
                if (timeRanges != null && timeRanges.length > 0) {
                    for (const timeRange of timeRanges) {
                        const begin = new Date(`${dateString} ${timeRange.from}${timezone}`)
                        const end = new Date(`${dateString} ${timeRange.to}${timezone}`)
                        if (end > from && begin < to) {
                            const wt = new WorkingTime(begin, end, schedule.package.visitTime, schedule.package.id, schedule.id, undefined)
                            result.push(wt)
                        }
                    }
                } 
            }      
        }
        return result
    }

}

