import { EmptyEntity } from "../../entity/Base"
import { IsNotEmpty } from "class-validator"
import { IsPassword } from "../../../support/validator/PasswordValidator"

export class UpdatePasswordBody extends EmptyEntity {

    @IsNotEmpty()
    @IsPassword()
    password: string

    @IsNotEmpty()
    @IsPassword()
    newPassword: string

}