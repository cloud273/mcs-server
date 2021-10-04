import { EmptyEntity } from "../../entity/Base"
import { IsPositive, IsDate } from "class-validator"
import { Transform } from "class-transformer"
import { DateTimeTransform, NumberTransform } from "../../../../node/library/utility/Function"
import { GeneralValidator } from "../../../../node/library/validator/GeneralValidator"

export class DoctorWorkingTimeQuery extends EmptyEntity {

    @IsDate()
    @GeneralValidator(o => o.from < o.to && o.to > new Date())
    @Transform(DateTimeTransform)
    from: Date

    @IsDate()
    @Transform(DateTimeTransform)
    to: Date

    @IsPositive()
    @Transform(NumberTransform)
    doctorId: number
}