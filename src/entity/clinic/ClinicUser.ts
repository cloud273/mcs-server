import { Entity, Column, ManyToOne, OneToMany } from "typeorm";
import { Clinic } from "./Clinic";
import { ClinicUserDevice } from "./ClinicUserDevice";
import { Account } from "../../common/entity/Account";
import { IsPositive } from "class-validator";
import { IsEmail } from "../../support/validator/EmailValidator";
import { vInsert, Select, sDetail, sBasic } from "../../common/entity/Base";
import { IsPassword } from "../../support/validator/PasswordValidator";

@Entity()
export class ClinicUser extends Account {

    @IsPassword({groups: [vInsert]})
    password: string

    @IsEmail({groups: [vInsert]})
    @Select([sBasic, sDetail])
    username: string

    @ManyToOne(type => Clinic, obj => obj.users, {nullable : false})
    clinic: Clinic

    @Column()
    @IsPositive()
    clinicId: number

    @OneToMany(type => ClinicUserDevice, obj => obj.account)
    devices: ClinicUserDevice[]

}