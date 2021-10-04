import { Entity, Column, ManyToOne, OneToMany, OneToOne } from "typeorm";
import { Patient } from "../patient/Patient";
import { Base, Select, sBasic, sDetail, vInsert, vUpdate, SelectNested, sBooking } from "../../common/entity/Base";
import { AppointmentStatus } from "./AppointmentStatus";
import { Constant } from "../../../Constant";
import { IsPositive, IsDate, ValidateNested, IsNotEmpty, MaxLength, IsEnum, IsOptional, ArrayNotEmpty, Length } from "class-validator";
import { Allergy } from "../patient/Allergy";
import { Surgery } from "../patient/Surgery";
import { Medication } from "../patient/Medication";
import { Symptom } from "../../common/entity/Symptom";
import { Package } from "../clinic/Package";
import { Type, Transform } from "class-transformer";
import { StatusType, PackageType } from "../../common/object/Enum";
import { DateTimeTransform } from "../../../node/library/utility/Function";
import { IsSpecialty } from "../../support/validator/SpecialtyValidator";
import { Price } from "../../common/entity/Price";
import { IsVisitTime } from "../../support/validator/VisitTimeValidator";
import { Doctor } from "../clinic/Doctor";
import { Integer } from "../../../node/library/utility/Integer";
import { BaseRepository } from "../../common/business/basic/BaseRepository";
import { WorkingDay } from "../clinic/WorkingDay";
import { Schedule } from "../clinic/Schedule";
import { Status } from "../../common/entity/Status";
import { Clinic } from "../clinic/Clinic";
import { Prescription } from "./Prescription";

@Entity()
export class Appointment extends Base {

    @Column({type: "varchar", length: 8, unique: true})
    @Length(8,8)
    @Select([sBasic, sDetail])
    code: string

    @Column({type: "int"})
    @IsPositive()
    @Select([sBasic, sDetail, sBooking])
    order: number

    @Column({type: "datetime"})
    @IsDate({groups: [vInsert, vUpdate]})
    @Select([sBasic, sDetail, sBooking])
    @Transform(DateTimeTransform)
    begin: Date

    @Column({type: "varchar", length: 16})
    @IsSpecialty({groups: [vInsert]})
    @MaxLength(16)
    @Select([sBasic, sDetail])
    specialty: string

    @Column({type: "enum", enum: PackageType})
    @IsEnum(PackageType, {groups: [vInsert]})
    @Select([sBasic, sDetail])
    type: PackageType

    @Column(type => Price, {prefix: "price"})
    @IsNotEmpty({groups: [vInsert]})
    @ValidateNested({groups: [vInsert]})
    @SelectNested(Price, [sBasic, sDetail]) 
    @Type(() => Price)
    price: Price

    @Column({type: "int", width: 11})
    @IsVisitTime({groups: [vInsert]})
    @Select([sBasic, sDetail, sBooking])
    visitTime: number

    @Column({type: "json"})
    @ValidateNested()
    @Select([sBasic]) 
    @Type(() => Doctor)
    doctorBasic: Doctor

    @Column({type: "json"})
    @ValidateNested()
    @Select([sDetail]) 
    @Type(() => Doctor)
    doctorDetail: Doctor

    @Column({type: "json"})
    @ValidateNested()
    @Select([sBasic]) 
    @Type(() => Clinic)
    clinicBasic: Clinic

    @Column({type: "json"})
    @ValidateNested()
    @Select([sDetail]) 
    @Type(() => Clinic)
    clinicDetail: Clinic

    @Column({type: "json"})
    @ValidateNested()
    @Select([sBasic]) 
    @Type(() => Patient)
    patientBasic: Patient

    @Column({type: "json"})
    @ValidateNested()
    @Select([sDetail]) 
    @Type(() => Patient)
    patientDetail: Patient

    @Column({type: "json"})
    @ArrayNotEmpty({groups: [vInsert]})
    @ValidateNested({groups: [vInsert]})
    @Select([sDetail]) 
    @Type(() => Symptom)
    symptoms: Symptom[]

    @Column({type: "json", nullable: true})
    @IsOptional({groups: [vInsert]})
    @ValidateNested({groups: [vInsert]})
    @Select([sDetail]) 
    @Type(() => Allergy)
    allergies: Allergy[]

    @Column({type: "json", nullable: true})
    @IsOptional({groups: [vInsert]})
    @ValidateNested({groups: [vInsert]})
    @Select([sDetail]) 
    @Type(() => Surgery)
    surgeries: Surgery[]

    @Column({type: "json", nullable: true})
    @IsOptional({groups: [vInsert]})
    @ValidateNested({groups: [vInsert]})
    @Select([sDetail]) 
    @Type(() => Medication)
    medications: Medication[]
    
    @Column(type => Status, {prefix: "status"})
    @ValidateNested()
    @SelectNested(Status, [sBasic, sDetail])
    @Type(() => Status)
    status: Status

    @OneToMany(type => AppointmentStatus, obj => obj.appointment, {cascade: true})
    statuses: AppointmentStatus[]

    @ManyToOne(type => Package, obj => obj.appointments, {nullable : false})
    package: Package

    @Column()
    @IsPositive({groups: [vInsert]})
    packageId: number

    @ManyToOne(type => Schedule, obj => obj.appointments, {nullable : true})
    schedule: Schedule

    @Column({nullable : true})
    scheduleId: number

    @ManyToOne(type => WorkingDay, obj => obj.appointments, {nullable : true})
    workingDay: WorkingDay

    @Column({nullable : true})
    workingDayId: number

    @ManyToOne(type => Patient, obj => obj.appointments, {nullable : false})
    patient: Patient

    @Column()
    @IsPositive()
    patientId: number

    @OneToOne(type => Prescription, obj => obj.appointment, {nullable : true})
    prescription: Appointment

    @Column({nullable : true})
    @IsPositive()
    prescriptionId: number

    get end(): Date {
        return this.begin.addSecond(this.visitTime)
    }

    restructure() { 
        if (this.doctorDetail != undefined) {
            this['doctorInfo'] = this.doctorDetail 
        } else {
            this['doctorInfo'] = this.doctorBasic
        }
        if (this.clinicDetail != undefined) {
            this['clinicInfo'] = this.clinicDetail 
        } else {
            this['clinicInfo'] = this.clinicBasic
        }
        if (this.patientDetail != undefined) {
            this['patientInfo'] = this.patientDetail 
        } else {
            this['patientInfo'] = this.patientBasic
        }
        delete this.doctorDetail
        delete this.doctorBasic
        delete this.clinicDetail
        delete this.clinicBasic
        delete this.patientDetail
        delete this.patientBasic
    }

    async generateCode() {
        let code: string
        while(true) {
            code = Integer.RandomWithLength(8).toString()
            if (!await BaseRepository.isExisted(Appointment, 'code', code)) {
                break
            }
        }
        this.code = code
    }

    get isCreatable(): boolean {
        const today = new Date()
        const end = this.begin.addSecond(Constant.appointment.createableEnd)
        return today < end
    }

    get isCancelable(): boolean {
        const today = new Date()
        const end = this.begin.addSecond(Constant.appointment.cancelableEnd)
        return today < end && (this.status.value == StatusType.created || this.status.value == StatusType.accepted)
    }

    get isAcceptable(): boolean {
        const today = new Date()
        const end = this.begin.addSecond(Constant.appointment.acceptableEnd)
        return today < end && this.status.value == StatusType.created
    }
    
    get isRejectable(): boolean {
        const today = new Date()
        const end = this.begin.addSecond(Constant.appointment.rejectableEnd)
        return today < end && this.status.value == StatusType.created
    }

    get isBeginable(): boolean {
        const today = new Date()
        const begin = this.begin.addSecond(Constant.appointment.beginableFrom)
        const end = this.begin.addSecond(Constant.appointment.beginableEnd)
        return today > begin && today < end && this.status.value == StatusType.accepted
    }

    get isFinishable(): boolean {
        const today = new Date()
        const end = this.begin.addSecond(Constant.appointment.finishableEnd)
        return today < end && this.status.value == StatusType.started
    }

}    