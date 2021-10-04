import { ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments, ValidationOptions, registerDecorator } from "class-validator";
import { AppValidator } from "./AppValidator";

@ValidatorConstraint({ name: "TimeRangesValidator", async: false })
export class TimeRangesValidator implements ValidatorConstraintInterface {

    validate(data: any, args: ValidationArguments) {
        return AppValidator.isTimeRanges(data)
    }

    defaultMessage(args: ValidationArguments) { 
        return "$value is not valid";
    }

}


export function IsTimeRanges(validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
         registerDecorator({
             target: object.constructor,
             propertyName: propertyName,
             options: validationOptions,
             constraints: [],
             validator: TimeRangesValidator
         });
    };
}