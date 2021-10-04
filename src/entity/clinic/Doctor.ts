import { Entity, Column, ManyToOne, OneToMany } from "typeorm";
import { Clinic } from "./Clinic";
import { DoctorCert } from "./DoctorCert";
import { Package } from "./Package";
import { Patient } from "../patient/Patient";
import { MaxLength, ValidateNested, IsPositive, IsOptional, IsNotEmpty, ArrayMinSize, ArrayUnique, Length } from "class-validator";
import { PdReview } from "../patient/PdReview";
import { vInsert, vUpdate, Select, sDetail, sBasic, SelectNested, vPartialUpdate, sBooking } from "../../common/entity/Base";
import { DoctorDevice } from "./DoctorDevice";
import { Account } from "../../common/entity/Account";
import { Profile } from "../../common/entity/Profile";
import { IsEmail } from "../../support/validator/EmailValidator";
import { IsPassword } from "../../support/validator/PasswordValidator";
import { Type } from "class-transformer";
import { IsSpecialty } from "../../support/validator/SpecialtyValidator";
import { IsDateString } from "../../../node/library/validator/DateStringValidator";
import { IsTimezoneString } from "../../../node/library/validator/TimezoneStringValidator";

@Entity()
export class Doctor extends Account {

    @IsPassword({groups: [vInsert]})
    password: string

    @IsEmail({groups: [vInsert]})
    @Select([sDetail])
    username: string

    @Column({type: "varchar", length: 128})
    @Length(2, 128, {groups: [vInsert, vUpdate]})
    @Select([sBasic, sDetail])
    image: string

    @Column(type => Profile, {prefix: "profile"})
    @IsNotEmpty({groups: [vInsert, vUpdate]})
    @ValidateNested({groups: [vInsert, vUpdate]})
    @SelectNested(Profile, [sBasic, sDetail])
    @Type(() => Profile)
    profile: Profile

    @Column({type: "json"})
    @ArrayMinSize(1, {groups: [vInsert, vUpdate]})
    @ArrayUnique({groups: [vInsert, vUpdate]})
    @IsSpecialty({groups: [vInsert, vUpdate], each: true})
    @Select([sBasic, sDetail])
    specialties: string[]

    @Column({type: "varchar", length: 32})
    @MaxLength(32, {groups: [vInsert, vUpdate]})
    @Select([sBasic, sDetail])
    title: string // bac si tien si ...

    @Column({type: "varchar", length: 256, nullable: true})
    @IsOptional({groups: [vInsert, vUpdate]})
    @MaxLength(256, {groups: [vInsert, vUpdate]})
    @Select([sBasic, sDetail])
    office: string // chuc vu cao nhat

    @Column({type: "text"})
    @MaxLength(10000, {groups: [vInsert, vUpdate]})
    @Select([sDetail])
    biography: string

    // @Column({type: "json", nullable: true})
    // @IsOptional({groups: [vInsert, vUpdate]})
    // @ValidateNested({groups: [vInsert, vUpdate]})
    // @Select([sBasic, sDetail])
    // @Type(() => LocalizeString)
    // office: LocalizeString // chuc vu cao nhat

    // @Column({type: "json"})
    // @IsNotEmpty({groups: [vInsert, vUpdate]})
    // @ValidateNested({groups: [vInsert, vUpdate]})
    // @Select([sDetail])
    // @Type(() => LocalizeString)
    // biography: LocalizeString

    @Column({type: "date"})
    @IsDateString({groups: [vInsert, vUpdate]})
    @Select([sBasic, sDetail])
    startWork: string

    @Column({type: "varchar", length: 6})
    @IsTimezoneString({groups: [vInsert, vPartialUpdate]})
    @Select([sDetail, sBooking]) 
    timezone: string

    @OneToMany(type => DoctorDevice, obj => obj.account)
    devices: DoctorDevice[]

    @OneToMany(type => DoctorCert, obj => obj.doctor, {cascade: true})
    certificates: DoctorCert[]

    @ManyToOne(type => Clinic, obj => obj.doctors, {nullable : false})
    clinic: Clinic

    @Column()
    @IsPositive({groups: [vInsert]})
    clinicId: number

    @OneToMany(type => Package, obj => obj.doctor)
    packages: Package[]

    @OneToMany(type => PdReview, obj => obj.doctor)
    reviews: PdReview[]

    @ManyToOne(type => Patient, obj => obj.favDoctors, {nullable : true})
    favPatient: Clinic

    @Column({nullable: true})
    @IsPositive()
    favPatientId: number
    
}