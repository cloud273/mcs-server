import { Entity, Column, ManyToOne, OneToMany } from "typeorm";
import { Doctor } from "./Doctor";
import { Base, vInsert, vUpdate, Select, sBasic, sDetail, SelectNested, sBooking } from "../../common/entity/Base";
import { IsEnum, MaxLength, IsPositive, IsNotEmpty, ValidateNested } from "class-validator";
import { Appointment } from "../appointment/Appointment";
import { IsSpecialty } from "../../support/validator/SpecialtyValidator";
import { Price } from "../../common/entity/Price";
import { IsVisitTime } from "../../support/validator/VisitTimeValidator";
import { PackageType } from "../../common/object/Enum";
import { Type } from "class-transformer";
import { Schedule } from "./Schedule";
import { WorkingDay } from "./WorkingDay";

@Entity()
export class Package extends Base {

    @Column({type: "varchar", length: 16})
    @IsSpecialty({groups: [vInsert]})
    @MaxLength(16)
    @Select([sBasic, sDetail, sBooking])
    specialty: string

    @Column({type: "enum", enum: PackageType})
    @IsEnum(PackageType, {groups: [vInsert]})
    @Select([sBasic, sDetail, sBooking])
    type: PackageType

    @Column(type => Price, {prefix: "price"})
    @IsNotEmpty({groups: [vInsert, vUpdate]})
    @ValidateNested({groups: [vInsert, vUpdate]})
    @SelectNested(Price, [sBasic, sDetail]) 
    @Type(() => Price)
    price: Price

    @Column({type: "int", width: 11})
    @IsVisitTime({groups: [vInsert, vUpdate]})
    @Select([sBasic, sDetail, sBooking])
    visitTime: number // in second

    @ManyToOne(type => Doctor, obj => obj.packages, {nullable : false})
    doctor: Doctor

    @Column()
    @IsPositive({groups: [vInsert]})
    doctorId: number

    @OneToMany(type => Schedule, obj => obj.package)
    schedules: Schedule[]

    @OneToMany(type => WorkingDay, obj => obj.package)
    workingDays: WorkingDay[]

    @OneToMany(type => Appointment, obj => obj.package)
    appointments: Appointment[]
    
}