import { Clinic } from "../../../entity/clinic/Clinic";
import { IsNotEmpty, ValidateNested } from "class-validator";
import { Type } from "class-transformer";
import { EmptyEntity, vInsert } from "../../entity/Base";
import { ClinicUser } from "../../../entity/clinic/ClinicUser";

export class ClinicCreateBody extends EmptyEntity {

    @IsNotEmpty({groups: [vInsert]})
    @ValidateNested({groups: [vInsert]})
    @Type(() => Clinic)
    clinic: Clinic

    @IsNotEmpty({groups: [vInsert]})
    @ValidateNested({groups: [vInsert]})
    @Type(() => ClinicUser)
    user: ClinicUser

}