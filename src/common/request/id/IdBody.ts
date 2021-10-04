import { EmptyEntity } from "../../entity/Base"
import { IsPositive } from "class-validator"

export class IdBody extends EmptyEntity {

    @IsPositive()
    id: number

}