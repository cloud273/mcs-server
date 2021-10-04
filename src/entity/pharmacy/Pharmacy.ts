import { Entity, Column , OneToMany } from "typeorm";
import { vInsert, vUpdate, Select, sDetail, sBasic, SelectNested, sAddress, Organization } from "../../common/entity/Base";
import { Address } from "../../common/entity/Address";
import { Length, ValidateNested, MaxLength, IsNotEmpty, IsOptional } from "class-validator";
import { IsEmail } from "../../support/validator/EmailValidator";
import { IsPhone } from "../../support/validator/PhoneValidator";
import { Type } from "class-transformer";
import { PharmacyCert } from "./PharmacyCert";
import { PharmacyUser } from "./PharmacyUser";

@Entity()
export class Pharmacy extends Organization {

    @Column({type: "varchar", length: 128})
    @Length(6,128, {groups: [vInsert, vUpdate]})
    @Select([sBasic, sDetail])
    name: string

    @Column({type:"varchar", length: 128, unique: true})
    @IsEmail({groups: [vInsert, vUpdate]})
    @MaxLength(128)
    @Select([sDetail])
    email: string

    @Column({type: "varchar", length: 16, unique: true})
    @IsPhone({groups: [vInsert, vUpdate]})
    @Select([sDetail])
    phone: string

    @Column({type: "varchar", length: 16, unique: true})
    @IsOptional({groups: [vInsert, vUpdate]})
    @IsPhone({groups: [vInsert, vUpdate]})
    @Select([sDetail])
    workPhone: string

    @Column(type => Address, {prefix: "address"})
    @IsNotEmpty({groups: [vInsert, vUpdate]})
    @ValidateNested({groups: [vInsert, vUpdate]})
    @SelectNested(Address, [sDetail, sAddress])
    @Type(() => Address)
    address: Address

    @Column({type: "varchar", length: 128})
    @Length(2, 128, {groups: [vInsert, vUpdate]})
    @Select([sDetail])
    image: string

    @OneToMany(type => PharmacyCert, obj => obj.pharmacy, {cascade: true})
    certificates: PharmacyCert[]

    @OneToMany(type => PharmacyUser, obj => obj.pharmacy, {cascade: true})
    users: PharmacyUser[]

}