import { Entity, OneToMany, Column } from "typeorm";
import { Appointment } from "../appointment/Appointment";
import { Allergy } from "./Allergy";
import { Surgery } from "./Surgery";
import { Medication } from "./Medication";
import { Doctor } from "../clinic/Doctor";
import { PatientDevice } from "./PatientDevice";
import { PdReview } from "./PdReview";
import { ValidateNested, IsOptional, IsNotEmpty, Length } from "class-validator";
import { Address } from "../../common/entity/Address";
import { vInsert, vUpdate, vPartialUpdate, Select, sDetail, sBasic, SelectNested, sAddress } from "../../common/entity/Base";
import { Profile } from "../../common/entity/Profile";
import { Account } from "../../common/entity/Account";
import { Type } from "class-transformer";
import { IsPhoneOrEmail } from "../../support/validator/PhoneOrEmailValidator";

@Entity()
export class Patient extends Account {

    @IsPhoneOrEmail({groups: [vInsert]})
    @Select([sDetail])
    username: string
    
    @Column({type: "varchar", length: 128, nullable: true})
    @IsOptional( {groups: [vInsert]})
    @Length(2, 128, {groups: [vInsert, vPartialUpdate]})
    @Select([sBasic, sDetail])
    image: string

    @Column(type => Profile, {prefix: "profile"})
    @IsNotEmpty({groups: [vInsert, vUpdate]})
    @ValidateNested({groups: [vInsert, vUpdate]})
    @SelectNested(Profile, [sDetail])
    @Type(() => Profile)
    profile: Profile

    @Column(type => Address, {prefix: "address"})
    @IsNotEmpty({groups: [vInsert, vUpdate]})
    @ValidateNested({groups: [vInsert, vUpdate]})
    @SelectNested(Address, [sDetail, sAddress])
    @Type(() => Address)
    address: Address

    @OneToMany(type => PatientDevice, obj => obj.account)
    devices: PatientDevice[]

    @OneToMany(type => Allergy, obj => obj.patient)
    allergies: Allergy[]

    @OneToMany(type => Surgery, obj => obj.patient)
    surgeries: Surgery[]

    @OneToMany(type => Medication, obj => obj.patient, {cascade: true})
    medications: Medication[]

    @OneToMany(type => Appointment, obj => obj.patient)
    appointments: Appointment[]

    @OneToMany(type => PdReview, obj => obj.patient)
    reviews: PdReview[]

    @OneToMany(type => Doctor, obj => obj.favPatient)
    favDoctors: Doctor[]

}