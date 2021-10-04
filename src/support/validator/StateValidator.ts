import { ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments, ValidationOptions, registerDecorator } from "class-validator";
import { AppValidator } from "./AppValidator";

@ValidatorConstraint({ name: "StateValidator", async: false })
export class StateValidator implements ValidatorConstraintInterface {

    validate(data: any, args: ValidationArguments) {
        return AppValidator.isState(data)
    }

    defaultMessage(args: ValidationArguments) { 
        return "$value is not valid";
    }

}


export function IsState(validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
         registerDecorator({
             target: object.constructor,
             propertyName: propertyName,
             options: validationOptions,
             constraints: [],
             validator: StateValidator
         });
    };
}