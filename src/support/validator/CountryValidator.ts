import { ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments, ValidationOptions, registerDecorator } from "class-validator";
import { AppValidator } from "./AppValidator";

@ValidatorConstraint({ name: "CountryValidator", async: false })
export class CountryValidator implements ValidatorConstraintInterface {

    validate(data: any, args: ValidationArguments) {
        return AppValidator.isCountry(data)
    }

    defaultMessage(args: ValidationArguments) { 
        return "$value is not valid";
    }

}


export function IsCountry(validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
         registerDecorator({
             target: object.constructor,
             propertyName: propertyName,
             options: validationOptions,
             constraints: [],
             validator: CountryValidator
         });
    };
}