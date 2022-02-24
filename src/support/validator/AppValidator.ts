import { isString, isBase64, isArray, isEnum, isEmail, isMobilePhone, isPhoneNumber, isNumber, isDivisibleBy, isLongitude, isLatitude } from "class-validator"
import { Language, PackageType } from "../../common/object/Enum"
import { NumberRange } from "../../common/object/NumberRange"
import { ConfigService } from "../../service/other/misc/ConfigService"
import { Constant } from "../../../Constant"
import { Utility } from "../utility/Utility"

export class AppValidator {

    public static isBase64(data: any): boolean {
        return isString(data) && isBase64(data)
    }

    public static isArray(data: any): boolean {
        return isArray(data)
    }

    public static isEnum(data: any, entity: any): boolean {
        return isEnum(data, entity)
    }

    public static isLanguage(data: any): boolean {
        return isEnum(data, Language)
    }

    public static isPackageType(data: any): boolean {
        return isEnum(data, PackageType)
    }

    public static isEmail(data: any): boolean {
        return isString(data) && isEmail(data) && data.length <= 128
    }

    public static isMobilePhone(data: any): boolean {
        return isString(data) && isMobilePhone(data, "vi-VN") && data.length <= 16
    }

    public static isPhone(data: any): boolean {
        return isString(data) && isPhoneNumber(data, "vi-VN") && data.length <= 16
    }

    public static isPhoneOrEmail(data: any): boolean {
        return this.isMobilePhone(data) || this.isEmail(data)
    }

    public static isPassword(data: any): boolean {
        if (isString(data)) {
            const str: string = data
            return str.length >= 6 && str.length <= 32
        }
        return false
    }

    public static isVerifyCode(data: any): boolean {
        if (isString(data)) {
            const str: string = data
            return str.length > 0
        }
        return false
    }

    public static isImage(data: any): boolean {
        return isString(data) && data.length <= 128
    }

    public static isRate(data: any): boolean {
        return isNumber(data) && data <= 5 && data >= 0
    }

    public static isVisitTime(data: any): boolean {
        return isNumber(data) && isDivisibleBy(data, Constant.package.block) && data > 0 && data <= Constant.package.maxVisitTime 
    }

    public static isSpecialty(data: any): boolean {
        return data != null && typeof data === 'string' && ConfigService.instance.existedSpecialty(data)
    }

    public static isCountry(data: any): boolean {
        return data != null && typeof data === 'string' && ConfigService.instance.existedCountry(data)
    }

    public static isState(data: any): boolean {
        return data != null && typeof data === 'string' && ConfigService.instance.existedState(data)
    }

    public static isCity(data: any): boolean {
        return data != null && typeof data === 'string' && ConfigService.instance.existedCity(data)
    }

    public static isLongitudeString(data: any): boolean {
        return data != null && typeof data === 'string' && isLongitude(data)
    }

    public static isLatitudeString(data: any): boolean {
        return data != null && typeof data === 'string' && isLatitude(data)
    }

    public static isTimeRanges(data: any): boolean {
        let result = false
        if (isArray(data)) {
            result = true
            const ranges: NumberRange[] = []
            for (const obj of data) {
                const range = Utility.createNumberRange(obj)
                if (range != null) {
                    if (ranges.length > 0) {
                        for (const existed of ranges) {
                            if (range.isCollapseOrContinueOther(existed)) {
                                result = false
                                break
                            }
                        }
                    }
                    ranges.push(range)
                } else {
                    result = false
                }
                if (!result) {
                    break
                }
            }
        }
        return result
    }

}


