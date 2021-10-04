import { EmptyEntity } from "../../entity/Base"
import { IsDate, IsEnum, IsOptional, IsArray } from "class-validator"
import { Transform } from "class-transformer"
import { DateTimeTransform } from "../../../../node/library/utility/Function"
import { PackageType, StatusType } from "../../object/Enum"
import { IsBeforeDateProperty } from "../../../../node/library/validator/BeforeDatePropertyValidator"
import { Base64ArrayStatusTypeTransform } from "../../../support/transformer/Transformer"

export class AppointmentListQuery extends EmptyEntity {

    @IsOptional()
    @IsEnum(PackageType)
    type: PackageType

    @IsOptional()
    @IsArray()
    @Transform(Base64ArrayStatusTypeTransform)
    statusTypes: StatusType[]

    @IsDate()
    @IsBeforeDateProperty('to')
    @Transform(DateTimeTransform)
    from: Date

    @IsDate()
    @Transform(DateTimeTransform)
    to: Date

}