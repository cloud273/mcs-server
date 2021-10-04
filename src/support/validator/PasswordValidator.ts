import { ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments, ValidationOptions, registerDecorator } from "class-validator";
import { AppValidator } from "./AppValidator";

@ValidatorConstraint({ name: "PasswordValidator", async: false })
export class PasswordValidator implements ValidatorConstraintInterface {

    validate(data: any, args: ValidationArguments) {
        return AppValidator.isPassword(data)
    }

    defaultMessage(args: ValidationArguments) { 
        return "$value is not valid";
    }

}


export function IsPassword(validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
         registerDecorator({
             target: object.constructor,
             propertyName: propertyName,
             options: validationOptions,
             constraints: [],
             validator: PasswordValidator
         });
    };
}