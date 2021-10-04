import { ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments, ValidationOptions, registerDecorator } from "class-validator";
import { AppValidator } from "./AppValidator";

@ValidatorConstraint({ name: "RateValidator", async: false })
export class RateValidator implements ValidatorConstraintInterface {

    validate(data: any, args: ValidationArguments) {
        if (data != null) {
            return AppValidator.isRate(data)
        }
        return false
    }

    defaultMessage(args: ValidationArguments) { 
        return "$value is not valid";
    }

}


export function IsRate(validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
         registerDecorator({
             target: object.constructor,
             propertyName: propertyName,
             options: validationOptions,
             constraints: [],
             validator: RateValidator
         });
    };
}