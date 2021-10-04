import { ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments, ValidationOptions, registerDecorator } from "class-validator";
import { AppValidator } from "./AppValidator";

@ValidatorConstraint({ name: "EmailValidator", async: false })
export class EmailValidator implements ValidatorConstraintInterface {

    validate(data: any, args: ValidationArguments) {
        if (data != null) {
            return AppValidator.isEmail(data)
        }
        return false
    }

    defaultMessage(args: ValidationArguments) { 
        return "$value is not valid";
    }

}

export function IsEmail(validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
         registerDecorator({
             target: object.constructor,
             propertyName: propertyName,
             options: validationOptions,
             constraints: [],
             validator: EmailValidator
         });
    };
}