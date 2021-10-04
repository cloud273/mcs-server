import { AppValidator } from "../validator/AppValidator"
import { PackageType, Language, StatusType } from "../../common/object/Enum"
import { Log } from "../../../node/library/log/Log"
import { Utility } from "../utility/Utility"

export function LongitudeStringTransform(data?: any): number | undefined {
    if (AppValidator.isLongitudeString(data)) {
        return Number(data)
    } 
    Log.message('LongitudeStringTransform', `"${data}" is not valid`)
    return undefined
}

export function LatitudeStringTransform(data?: any): number | undefined {
    if (AppValidator.isLatitudeString(data)) {
        return Number(data)
    } 
    Log.message('LatitudeStringTransform', `"${data}" is not valid`)
    return undefined
}

export function Base64ArrayStatusTypeTransform(data?: any): any {
    if (data != undefined) {
        const result = Utility.parseBase64ArrayEnum(data, StatusType)
        if (result != undefined) {
            return result
        }
        Log.message('Base64ArrayEnumTransform', `"${data}" is not valid`)
        return data
    } else {
        return undefined
    }
    
}