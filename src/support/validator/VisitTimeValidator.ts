import { ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments, ValidationOptions, registerDecorator } from "class-validator";
import { AppValidator } from "./AppValidator";

@ValidatorConstraint({ name: "VisitTimeValidator", async: false })
export class VisitTimeValidator implements ValidatorConstraintInterface {

    validate(data: any, args: ValidationArguments) {
        return AppValidator.isVisitTime(data)
    }

    defaultMessage(args: ValidationArguments) { 
        return "$value is not valid";
    }

}


export function IsVisitTime(validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
         registerDecorator({
             target: object.constructor,
             propertyName: propertyName,
             options: validationOptions,
             constraints: [],
             validator: VisitTimeValidator
         });
    };
}