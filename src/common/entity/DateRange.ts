import { Column } from "typeorm"
import { Select, sDetail, sBasic, vInsert, vUpdate, EmptyEntity, sBooking } from "./Base"
import { IsBeforeDateStringProperty } from "../../../node/library/validator/BeforeDateStringPropertyValidator"
import { IsDateString } from "../../../node/library/validator/DateStringValidator"

export class DateRange extends EmptyEntity {

    @Column({type: "date"})
    @IsBeforeDateStringProperty('to', {groups: [vInsert, vUpdate]})
    @IsDateString({groups: [vInsert, vUpdate]})
    @Select([sBasic, sDetail, sBooking]) 
    from: string

    @Column({type: "date"})
    @IsDateString({groups: [vInsert, vUpdate]})
    @Select([sBasic, sDetail, sBooking]) 
    to: string

}