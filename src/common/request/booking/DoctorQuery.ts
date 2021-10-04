import { EmptyEntity } from "../../entity/Base"
import { IsSpecialty } from "../../../support/validator/SpecialtyValidator"
import { PackageType } from "../../object/Enum"
import { IsEnum, IsPositive } from "class-validator"
import { Transform } from "class-transformer"
import { NumberTransform } from "../../../../node/library/utility/Function"

export class DoctorQuery extends EmptyEntity {

    @IsSpecialty()
    specialty: string

    @IsEnum(PackageType)
    type: PackageType

    @IsPositive()
    @Transform(NumberTransform)
    id: number
}