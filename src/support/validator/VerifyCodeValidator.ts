import { ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments, ValidationOptions, registerDecorator } from "class-validator";
import { AppValidator } from "./AppValidator";

@ValidatorConstraint({ name: "VerifyCodeValidator", async: false })
export class VerifyCodeValidator implements ValidatorConstraintInterface {

    validate(data: any, args: ValidationArguments) {
        if (data != null) {
            return AppValidator.isVerifyCode(data)
        }
        return false
    }

    defaultMessage(args: ValidationArguments) { 
        return "$value is not valid";
    }

}

export function IsVerifyCode(validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
         registerDecorator({
             target: object.constructor,
             propertyName: propertyName,
             options: validationOptions,
             constraints: [],
             validator: VerifyCodeValidator
         });
    };
}