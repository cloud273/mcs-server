import { Validator } from "class-validator"
import { Language, PackageType } from "../../common/object/Enum"
import { NumberRange } from "../../common/object/NumberRange"
import { ConfigService } from "../../service/other/misc/ConfigService"
import { Constant } from "../../../Constant"
import { Utility } from "../utility/Utility"

const _validator = new Validator()

export class AppValidator {

    public static isBase64(data: any): boolean {
        return _validator.isString(data) && _validator.isBase64(data)
    }

    public static isArray(data: any): boolean {
        return _validator.isArray(data)
    }

    public static isEnum(data: any, entity: any): boolean {
        return _validator.isEnum(data, entity)
    }

    public static isLanguage(data: any): boolean {
        return _validator.isEnum(data, Language)
    }

    public static isPackageType(data: any): boolean {
        return _validator.isEnum(data, PackageType)
    }

    public static isEmail(data: any): boolean {
        return _validator.isString(data) && _validator.isEmail(data) && data.length <= 128
    }

    public static isMobilePhone(data: any): boolean {
        return _validator.isString(data) && _validator.isMobilePhone(data, "vi-VN") && data.length <= 16
    }

    public static isPhone(data: any): boolean {
        return _validator.isString(data) && _validator.isPhoneNumber(data, "vi-VN") && data.length <= 16
    }

    public static isPhoneOrEmail(data: any): boolean {
        return this.isMobilePhone(data) || this.isEmail(data)
    }

    public static isPassword(data: any): boolean {
        if (_validator.isString(data)) {
            const str: string = data
            return str.length >= 6 && str.length <= 32
        }
        return false
    }

    public static isVerifyCode(data: any): boolean {
        if (_validator.isString(data)) {
            const str: string = data
            return str.length > 0
        }
        return false
    }

    public static isImage(data: any): boolean {
        return _validator.isString(data) && data.length <= 128
    }

    public static isRate(data: any): boolean {
        return _validator.isNumber(data) && data <= 5 && data >= 0
    }

    public static isVisitTime(data: any): boolean {
        return _validator.isNumber(data) && _validator.isDivisibleBy(data, Constant.package.block) && data > 0 && data <= Constant.package.maxVisitTime 
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

    public static isLatLong(data: any): boolean {
        return data != null && typeof data === 'number' && _validator.isLatLong(data)
    }

    public static isLongitudeString(data: any): boolean {
        return data != null && typeof data === 'string' && _validator.isLongitude(data)
    }

    public static isLatitudeString(data: any): boolean {
        return data != null && typeof data === 'string' && _validator.isLatitude(data)
    }

    public static isTimeRanges(data: any): boolean {
        let result = false
        if (_validator.isArray(data)) {
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


