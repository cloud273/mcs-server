import { EmptyEntity, vInsert } from "../../entity/Base"
import { IsNotEmpty, ValidateNested } from "class-validator"
import { IsPhoneOrEmail } from "../../../support/validator/PhoneOrEmailValidator"
import { IsPassword } from "../../../support/validator/PasswordValidator"
import { AdminDevice } from "../../../entity/admin/AdminDevice"
import { Type } from "class-transformer"
import { ClinicUserDevice } from "../../../entity/clinic/ClinicUserDevice"
import { DoctorDevice } from "../../../entity/clinic/DoctorDevice"
import { PatientDevice } from "../../../entity/patient/PatientDevice"

export class LoginBody extends EmptyEntity {

    @IsNotEmpty()
    @IsPhoneOrEmail({groups: [vInsert]})
    username: string

    @IsNotEmpty()
    @IsPassword({groups: [vInsert]})
    password: string

}

export class AdminLoginBody extends EmptyEntity {

    @IsNotEmpty({groups: [vInsert]})
    @ValidateNested({groups: [vInsert]})
    @Type(() => LoginBody)
    login: LoginBody

    @IsNotEmpty({groups: [vInsert]})
    @ValidateNested({groups: [vInsert]})
    @Type(() => AdminDevice)
    device: AdminDevice

}

export class ClinicUserLoginBody extends EmptyEntity {

    @IsNotEmpty({groups: [vInsert]})
    @ValidateNested({groups: [vInsert]})
    @Type(() => LoginBody)
    login: LoginBody

    @IsNotEmpty({groups: [vInsert]})
    @ValidateNested({groups: [vInsert]})
    @Type(() => ClinicUserDevice)
    device: ClinicUserDevice

}

export class DoctorLoginBody extends EmptyEntity {

    @IsNotEmpty({groups: [vInsert]})
    @ValidateNested({groups: [vInsert]})
    @Type(() => LoginBody)
    login: LoginBody

    @IsNotEmpty({groups: [vInsert]})
    @ValidateNested({groups: [vInsert]})
    @Type(() => DoctorDevice)
    device: DoctorDevice

}

export class PatientLoginBody extends EmptyEntity {

    @IsNotEmpty({groups: [vInsert]})
    @ValidateNested({groups: [vInsert]})
    @Type(() => LoginBody)
    login: LoginBody

    @IsNotEmpty({groups: [vInsert]})
    @ValidateNested({groups: [vInsert]})
    @Type(() => PatientDevice)
    device: PatientDevice

}