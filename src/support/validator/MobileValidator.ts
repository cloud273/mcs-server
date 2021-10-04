import { ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments, ValidationOptions, registerDecorator } from "class-validator";
import { AppValidator } from "./AppValidator";

@ValidatorConstraint({ name: "MobileValidator", async: false })
export class MobileValidator implements ValidatorConstraintInterface {

    validate(data: any, args: ValidationArguments) {
        if (data != null) {
            return AppValidator.isMobilePhone(data)
        }
        return false
    }

    defaultMessage(args: ValidationArguments) { 
        return "$value is not valid";
    }

}

export function IsMobile(validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
         registerDecorator({
             target: object.constructor,
             propertyName: propertyName,
             options: validationOptions,
             constraints: [],
             validator: MobileValidator
         });
    };
}