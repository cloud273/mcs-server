import { Entity, Column, ManyToOne, OneToMany } from "typeorm";
import { Pharmacy } from "./Pharmacy";
import { PharmacyUserDevice } from "./PharmacyUserDevice";
import { Account } from "../../common/entity/Account";
import { IsPositive } from "class-validator";
import { IsEmail } from "../../support/validator/EmailValidator";
import { vInsert, Select, sDetail, sBasic } from "../../common/entity/Base";
import { IsPassword } from "../../support/validator/PasswordValidator";

@Entity()
export class PharmacyUser extends Account {

    @IsPassword({groups: [vInsert]})
    password: string

    @IsEmail({groups: [vInsert]})
    @Select([sBasic, sDetail])
    username: string

    @ManyToOne(type => Pharmacy, obj => obj.users, {nullable : false})
    pharmacy: Pharmacy

    @Column()
    @IsPositive()
    pharmacyId: number

    @OneToMany(type => PharmacyUserDevice, obj => obj.account)
    devices: PharmacyUserDevice[]

}