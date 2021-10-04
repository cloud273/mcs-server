import { EmptyEntity, vInsert, vUpdate, sDetail, sBasic, Select } from "./Base"
import { Column } from "typeorm"
import { IsTimeString } from "../../../node/library/validator/TimeStringValidator"
import { IsBeforeTimeStringProperty } from "../../../node/library/validator/BeforeTimeStringPropertyValidator"

export class TimeRange extends EmptyEntity {

    @Column({type: "time"})
    @IsBeforeTimeStringProperty('to', {groups: [vInsert, vUpdate]})
    @IsTimeString({groups: [vInsert, vUpdate]})
    @Select([sBasic, sDetail]) 
    from: string

    @Column({type: "time"})
    @IsTimeString({groups: [vInsert, vUpdate]})
    @Select([sBasic, sDetail]) 
    to: string
      
}