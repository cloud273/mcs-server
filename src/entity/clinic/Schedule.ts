import { Entity, Column, ManyToOne, OneToMany } from "typeorm";
import { Base, vInsert, vUpdate, sBasic, sDetail, Select, SelectNested, sBooking } from "../../common/entity/Base";
import { IsPositive, IsNotEmpty, ValidateNested } from "class-validator";
import { Type } from "class-transformer";
import { TimeRange } from "../../common/entity/TimeRange";
import { Package } from "./Package";
import { IsTimeRanges } from "../../support/validator/TimeRangesValidator";
import { DateRange } from "../../common/entity/DateRange";
import { Appointment } from "../appointment/Appointment";

@Entity()
export class Schedule extends Base {

    @Column(type => DateRange, {prefix: "duration"})
    @IsNotEmpty({groups: [vInsert, vUpdate]})
    @ValidateNested({groups: [vInsert, vUpdate]})
    @SelectNested(DateRange, [sBasic, sDetail, sBooking])
    @Type(() => DateRange)
    duration: DateRange

    @Column({type: "json"})
    @ValidateNested({groups: [vInsert, vUpdate]})
    @IsTimeRanges({groups: [vInsert, vUpdate]})
    @Select([sBasic, sDetail, sBooking]) 
    @Type(() => TimeRange)
    monday: TimeRange[]

    @Column({type: "json"})
    @ValidateNested({groups: [vInsert, vUpdate]})
    @IsTimeRanges({groups: [vInsert, vUpdate]})
    @Select([sBasic, sDetail, sBooking]) 
    @Type(() => TimeRange)
    tuesday: TimeRange[]

    @Column({type: "json"})
    @ValidateNested({groups: [vInsert, vUpdate]})
    @IsTimeRanges({groups: [vInsert, vUpdate]})
    @Select([sBasic, sDetail, sBooking]) 
    @Type(() => TimeRange)
    wednesday: TimeRange[]

    @Column({type: "json"})
    @ValidateNested({groups: [vInsert, vUpdate]})
    @IsTimeRanges({groups: [vInsert, vUpdate]})
    @Select([sBasic, sDetail, sBooking]) 
    @Type(() => TimeRange)
    thursday: TimeRange[]

    @Column({type: "json"})
    @ValidateNested({groups: [vInsert, vUpdate]})
    @IsTimeRanges({groups: [vInsert, vUpdate]})
    @Select([sBasic, sDetail, sBooking]) 
    @Type(() => TimeRange)
    friday: TimeRange[]

    @Column({type: "json"})
    @ValidateNested({groups: [vInsert, vUpdate]})
    @IsTimeRanges({groups: [vInsert, vUpdate]})
    @Select([sBasic, sDetail, sBooking]) 
    @Type(() => TimeRange)
    saturday: TimeRange[]

    @Column({type: "json"})
    @ValidateNested({groups: [vInsert, vUpdate]})
    @IsTimeRanges({groups: [vInsert, vUpdate]})
    @Select([sBasic, sDetail, sBooking]) 
    @Type(() => TimeRange)
    sunday: TimeRange[]

    @ManyToOne(type => Package, obj => obj.schedules, {nullable : false})
    package: Package

    @Column()
    @IsPositive({groups: [vInsert]})
    packageId: number

    @OneToMany(type => Appointment, obj => obj.schedule)
    appointments: Appointment[]

}