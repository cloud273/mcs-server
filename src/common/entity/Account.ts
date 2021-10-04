import { Column } from "typeorm";
import { IsEnum } from "class-validator";
import { BaseAccount } from "../../service/account/BaseAccount";
import { Language } from "../object/Enum";
import { vInsert, Select, sDetail, vPartialUpdate, sCommunicate } from "./Base";

export class Account extends BaseAccount {

    @Column({type: "enum", enum: Language})
    @IsEnum(Language, {groups: [vInsert, vPartialUpdate]})
    @Select([sCommunicate, sDetail])
    language: Language

}
