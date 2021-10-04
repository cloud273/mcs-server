import { EmptyEntity } from "../../entity/Base"
import { IsPositive } from "class-validator"
import { IsDateString } from "../../../../node/library/validator/DateStringValidator"

export class DeactivateWorkingDayBody extends EmptyEntity {

    @IsDateString()
    date: string

    @IsPositive()
    packageId: number

}