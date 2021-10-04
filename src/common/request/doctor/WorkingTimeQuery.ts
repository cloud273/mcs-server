import { EmptyEntity } from "../../entity/Base"
import { IsDate } from "class-validator"
import { Transform } from "class-transformer"
import { DateTimeTransform } from "../../../../node/library/utility/Function"
import { GeneralValidator } from "../../../../node/library/validator/GeneralValidator"

export class WorkingTimeQuery extends EmptyEntity {

    @IsDate()
    @GeneralValidator(o => o.from < o.to && o.to > new Date())
    @Transform(DateTimeTransform)
    from: Date

    @IsDate()
    @Transform(DateTimeTransform)
    to: Date

}