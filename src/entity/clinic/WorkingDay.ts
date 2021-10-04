import { Entity, Column, ManyToOne, OneToMany } from "typeorm";
import { Base, vInsert, vUpdate, sBasic, sDetail, Select, sBooking } from "../../common/entity/Base";
import { IsPositive, ValidateNested } from "class-validator";
import { Type } from "class-transformer";
import { TimeRange } from "../../common/entity/TimeRange";
import { Package } from "./Package";
import { IsTimeRanges } from "../../support/validator/TimeRangesValidator";
import { IsDateString } from "../../../node/library/validator/DateStringValidator";
import { Appointment } from "../appointment/Appointment";

@Entity()
export class WorkingDay extends Base {

    @Column({type: "date"})
    @IsDateString({groups: [vInsert]})
    @Select([sBasic, sDetail, sBooking]) 
    date: string

    @Column({type: "json"})
    @ValidateNested({groups: [vInsert]})
    @IsTimeRanges({groups: [vInsert]})
    @Select([sBasic, sDetail, sBooking]) 
    @Type(() => TimeRange)
    times: TimeRange[]

    @ManyToOne(type => Package, obj => obj.schedules, {nullable : false})
    package: Package

    @Column()
    @IsPositive({groups: [vInsert]})
    packageId: number

    @OneToMany(type => Appointment, obj => obj.workingDay)
    appointments: Appointment[]

}