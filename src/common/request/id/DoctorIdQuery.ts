import { EmptyEntity } from "../../entity/Base"
import { IsPositive } from "class-validator"
import { Transform } from "class-transformer"
import { NumberTransform } from "../../../../node/library/utility/Function"

export class DoctorIdQuery extends EmptyEntity {

    @IsPositive()
    @Transform(NumberTransform)
    doctorId: number
    
}