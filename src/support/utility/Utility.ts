import { NumberRange } from "../../common/object/NumberRange"
import { TimeRange } from "../../common/entity/TimeRange"
import { AppValidator } from "../validator/AppValidator"

export class Utility {

    public static parseBase64ArrayEnum(data?: any, entity?: any): any[] | undefined {
        let result = undefined
        if (data != undefined && entity != undefined && AppValidator.isBase64(data)) {
            const jsonString = Buffer.from(data, 'base64').toString("utf-8")
            try {
                const parsed = JSON.parse(jsonString)
                if (AppValidator.isArray(parsed)) {
                    result = []
                    for (const item of parsed) {
                        if (AppValidator.isEnum(item, entity)) {
                            result.push(entity[item])
                        } else {
                            result = undefined
                            break
                        }
                    }
                } 
            } catch (error) {
                
            }
        } 
        return result
    }

    public static getDays(fromDateString: string, toDateString: string): string[] {
        const start = new Date(fromDateString)
        const end = new Date(toDateString)
        const result : string[] = []
        for(var dt = start; dt <= end; dt.setDate(dt.getDate()+1)){
            result.push(dt.dateString())
        }
        return result;
    }

    public static createNumberRange(obj: TimeRange): NumberRange | undefined {
        if (obj.from != undefined && obj.to != undefined) {
            const t0 = Date.parse("1970-01-01 " + obj.from + "+0000")
            const t1 = Date.parse("1970-01-01 " + obj.to + "+0000")
            if (t0 != NaN && t1 != NaN && t0 < t1) {
                return new NumberRange(t0, t1)
            }
        }
        return undefined
    }

    public static mergeListNumberRange(input : NumberRange[]) : NumberRange[] {
        let a: number = 0
        let b: number = 0
        let index = 0
        let t0: number
        let t1: number
        let changed = true
        let result = input
        while(changed) {
            let tmpArray : NumberRange[] = []
            changed = false
            while (result.length > index) {
                t0 = result[index].from
                t1 = result[index].to
                if (a == b) {
                    a = t0
                    b = t1
                    result.splice(index, 1)
                } else {
                    if (a <= t1 && b >= t0) {
                        a = Math.min(a, t0)
                        b = Math.max(b, t1)
                        result.splice(index, 1)
                        changed = true
                    } else {
                        index += 1
                    }
                }
                if (index == result.length) {
                    tmpArray.push(new NumberRange(a, b))
                    a = 0
                    b = 0
                    index = 0
                }
            }
            result = tmpArray
            index = 0
        }
        return result.sort((a, b) => {
            return a.from - b.from
        })
    }

    public static filterCollapsedListNumberRange(array : NumberRange[], from: number, to: number): NumberRange[] {
        const result: NumberRange[] = []
        const range = new NumberRange(from, to)
        for (const candidate of array) {
            if (range.isCollapseOther(candidate)) {
                result.push(candidate)
            }
        }
        return result
    }

}

