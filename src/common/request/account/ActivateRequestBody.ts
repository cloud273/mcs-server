import { EmptyEntity } from "../../entity/Base"
import { IsNotEmpty } from "class-validator"
import { IsPhoneOrEmail } from "../../../support/validator/PhoneOrEmailValidator"

export class ActivateRequestBody extends EmptyEntity {

    @IsNotEmpty()
    @IsPhoneOrEmail()
    username: string

}