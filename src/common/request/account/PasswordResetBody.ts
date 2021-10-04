import { EmptyEntity } from "../../entity/Base"
import { IsNotEmpty } from "class-validator"
import { IsPhoneOrEmail } from "../../../support/validator/PhoneOrEmailValidator"
import { IsVerifyCode } from "../../../support/validator/VerifyCodeValidator"
import { IsPassword } from "../../../support/validator/PasswordValidator"

export class PasswordResetBody extends EmptyEntity {

    @IsNotEmpty()
    @IsPhoneOrEmail()
    username: string

    @IsNotEmpty()
    @IsPassword()
    password: string

    @IsNotEmpty()
    @IsVerifyCode()
    code: string

}