import { Column, Unique, ObjectType } from "typeorm";
import { Base, vInsert, Select, sDetail, sBasic } from "./Base";
import { Length, IsEnum, IsPositive, IsOptional, IsBoolean } from "class-validator";
import { DeviceOS, AppBundle } from "../object/Enum";
import { Account } from "./Account";

@Unique(["topic", "accountId"])
export class Device extends Base {

    @Column({type: "varchar", length: 256})
    @Length(2, 256, {groups: [vInsert]})
    @Select([sDetail])
    info: string

    @Column({type: "varchar", length: 256, nullable: true})
    @IsOptional({groups: [vInsert]})
    @Length(8, 256, {groups: [vInsert]})
    @Select([sBasic, sDetail])
    token: string

    @Column({type: "enum", enum: DeviceOS})
    @IsEnum(DeviceOS, {groups: [vInsert]})
    @Select([sBasic, sDetail])
    os: DeviceOS

    @Column({type: "enum", enum: AppBundle})
    @IsEnum(AppBundle, {groups: [vInsert]})
    @Select([sBasic, sDetail])
    topic: AppBundle

    @Column({type: "bool", default: true})
    @IsBoolean({groups: [vInsert]})
    @Select([sBasic, sDetail])
    production: boolean

    account: Base

    @Column()
    @IsPositive()
    accountId: number

    ownerTable<T extends Account>(): ObjectType<T> {
        return Account
    }
    
}