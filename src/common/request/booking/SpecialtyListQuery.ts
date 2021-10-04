import { EmptyEntity } from "../../entity/Base"
import { ArrayNotEmpty, ValidateNested } from "class-validator"
import { Symptom } from "../../entity/Symptom"
import { Type } from "class-transformer"

export class SpecialtyListQuery extends EmptyEntity {

    @ArrayNotEmpty()
    @ValidateNested()
    @Type(() => Symptom)
    symptoms: Symptom[]
    
}