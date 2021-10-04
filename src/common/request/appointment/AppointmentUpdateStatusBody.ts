import { EmptyEntity } from "../../entity/Base"
import { IsPositive, Length } from "class-validator"

export class AppointmentUpdateStatusBody extends EmptyEntity {

    @IsPositive()
    id: number

    @Length(2, 128)
    note: string

}