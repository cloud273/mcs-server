import { EmptyEntity } from "../../entity/Base"
import { IsNotEmpty } from "class-validator"
import { IsPhoneOrEmail } from "../../../support/validator/PhoneOrEmailValidator"
import { IsPassword } from "../../../support/validator/PasswordValidator"

export class PatientRegisterBody extends EmptyEntity {

    @IsNotEmpty()
    @IsPhoneOrEmail()
    username: string

    @IsNotEmpty()
    @IsPassword()
    password: string

}