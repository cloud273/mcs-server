import { EmptyEntity } from "../../entity/Base"
import { IsSpecialty } from "../../../support/validator/SpecialtyValidator"
import { PackageType } from "../../object/Enum"
import { IsEnum, IsOptional, IsLongitude, IsLatitude, Length, Max, IsNumber, Min } from "class-validator"
import { Transform } from "class-transformer"
import { LongitudeStringTransform, LatitudeStringTransform } from "../../../support/transformer/Transformer"
import { NumberTransform, StringTransform } from "../../../../node/library/utility/Function"

export class DoctorListQuery extends EmptyEntity {

    @IsSpecialty()
    specialty: string

    @IsEnum(PackageType)
    type: PackageType

    @IsOptional()
    @IsLongitude()
    @Transform(LongitudeStringTransform)
    longitude: number

    @IsOptional()
    @IsLatitude()
    @Transform(LatitudeStringTransform)
    latitude: number
    
    @IsOptional()
    @Length(1, 1000)
    @Transform(StringTransform)
    offsetName: string

    @IsOptional()
    @IsNumber() @Min(0) @Max(50)
    @Transform(NumberTransform)
    limit: number
}