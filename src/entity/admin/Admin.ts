import { Entity, OneToMany } from "typeorm";
import { AdminDevice } from "./AdminDevice";
import { Account } from "../../common/entity/Account";
import { IsEmail } from "../../support/validator/EmailValidator";
import { vInsert, Select, sDetail, sBasic } from "../../common/entity/Base";
import { IsPassword } from "../../support/validator/PasswordValidator";

@Entity()
export class Admin extends Account {

    @IsPassword({groups: [vInsert]})
    password: string

    @IsEmail({groups: [vInsert]})
    @Select([sBasic, sDetail])
    username: string

    @OneToMany(type => AdminDevice, obj => obj.account)
    devices: AdminDevice[]

}