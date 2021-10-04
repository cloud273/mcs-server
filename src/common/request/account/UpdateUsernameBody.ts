import { EmptyEntity } from "../../entity/Base"
import { IsNotEmpty } from "class-validator"
import { IsPhoneOrEmail } from "../../../support/validator/PhoneOrEmailValidator"
import { IsVerifyCode } from "../../../support/validator/VerifyCodeValidator"

export class UpdateUsernameBody extends EmptyEntity {

    @IsNotEmpty()
    @IsPhoneOrEmail()
    username: string

    @IsNotEmpty()
    @IsVerifyCode()
    code: string

}