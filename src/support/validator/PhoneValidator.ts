import { ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments, ValidationOptions, registerDecorator } from "class-validator";
import { AppValidator } from "./AppValidator";

@ValidatorConstraint({ name: "PhoneValidator", async: false })
export class PhoneValidator implements ValidatorConstraintInterface {

    validate(data: any, args: ValidationArguments) {
        if (data != null) {
            return AppValidator.isPhone(data)
        }
        return false
    }

    defaultMessage(args: ValidationArguments) { 
        return "$value is not valid";
    }

}

export function IsPhone(validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
         registerDecorator({
             target: object.constructor,
             propertyName: propertyName,
             options: validationOptions,
             constraints: [],
             validator: PhoneValidator
         });
    };
}