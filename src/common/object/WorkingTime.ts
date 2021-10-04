import { Appointment } from "../../entity/appointment/Appointment";
import { NumberRange } from "./NumberRange";
import { Utility } from "../../support/utility/Utility";

export class WorkingTime {

    public appointments: Appointment[] = []

    constructor(public begin: Date, public end: Date, public visitTime: number, public packageId: number, public scheduleId: number, public workingDayId: number) {
        
    }

    append(appointment: Appointment) {
        this.appointments.push(appointment)
    }

    isAvailable(minDate: Date): boolean {
        const begin = this.begin.second()
        const end = this.end.second()
        const apts = this.appointments
        const visitTime = this.visitTime
        const min = minDate.second()
        if (end <= min) {
            return false
        }
        let ranges: NumberRange[] = []
        if (apts != null && apts.length > 0) {
            const array: NumberRange[] = []
            let t0: number
            let t1: number
            for (const apt of apts) {
                t0 = apt.begin.second()
                t1 = apt.end.second()
                array.push(new NumberRange(t0, t1))
            }
            const merged = Utility.mergeListNumberRange(array)
            ranges = Utility.filterCollapsedListNumberRange(merged, begin, end)
        }
        let from: number = begin
        let to: number = begin + visitTime
        if (ranges.length > 0) {
            let index = 0
            while(to <= end) {
                while(ranges.length > index) {
                    if (ranges[index].isCollapsed(from, to)) {
                        from = ranges[index].to
                        to = from + visitTime
                        ranges.splice(index, 1)
                    } else {
                        index += 1
                    }
                }
                if (from >= min && to <= end) {
                    return true
                }
                from = to
                to = from + visitTime
                index = 0
            }               
        } else {
            while(to <= end) {
                if (from >= min && to <= end) {
                    return true
                }
                from = to
                to = from + visitTime
            }
        }
        
        return false
    }

    blocks(minDate: Date): Date[] {
        const begin = this.begin.second()
        const end = this.end.second()
        const apts = this.appointments
        const visitTime = this.visitTime
        const min = minDate.second()
        if (end <= min) {
            return []
        }
        let ranges: NumberRange[] = []
        if (apts != null && apts.length > 0) {
            const array: NumberRange[] = []
            let t0: number
            let t1: number
            for (const apt of apts) {
                t0 = apt.begin.second()
                t1 = apt.end.second()
                array.push(new NumberRange(t0, t1))
            }
            const merged = Utility.mergeListNumberRange(array)
            ranges = Utility.filterCollapsedListNumberRange(merged, begin, end)
        }
        let from: number = begin
        let to: number = begin + visitTime
        const dates : Date[] = []
        if (ranges.length > 0) {
            let index = 0
            while(to <= end) {
                while(ranges.length > index) {
                    if (ranges[index].isCollapsed(from, to)) {
                        from = ranges[index].to
                        to = from + visitTime
                        ranges.splice(index, 1)
                    } else {
                        index += 1
                    }
                }
                if (from >= min && to <= end) {
                    dates.push(new Date(from*1000))
                }
                from = to
                to = from + visitTime
                index = 0
            }               
        } else {
            while(to <= end) {
                if (from >= min && to <= end) {
                    dates.push(new Date(from*1000))
                }
                from = to
                to = from + visitTime
            }
        }
        return dates
    }

    getOrder(date: Date): number | undefined {
        const dates = this.blocks(this.begin)
        const apts = this.appointments
        if (dates.length == 0) {
            return undefined
        }
        let order = 1
        const time = date.getTime()
        for (const date of dates) {
            if (date.getTime() == time) {
                break
            }  
            order += 1
        }
        if (order <= dates.length) {
            if (apts != null && apts.length > 0) {
                for (const apt of apts) {
                    if (time > apt.begin.getTime()) {
                        order += 1
                    } else {
                        break
                    }
                }
                let array = apts.sort((obj1, obj2) => {
                    return obj1.order - obj2.order
                })
                while (array.length > 0) {
                    const obj = array.shift()
                    if (order == obj.order) {
                        order += 1
                    }
                }
            }
            return order
        } else {
            return undefined
        }
        
    }

}