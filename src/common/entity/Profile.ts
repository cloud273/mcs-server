import { Column } from "typeorm";
import { Length, MaxLength, IsEnum } from "class-validator";
import { EmptyEntity, vInsert, vUpdate, Select, sDetail, sBasic } from "./Base";
import { GenderType } from "../object/Enum";
import { IsDateString } from "../../../node/library/validator/DateStringValidator";

export class Profile extends EmptyEntity {

    @Column({type: "varchar", length: 128})
    @Length(2, 128, {groups: [vInsert, vUpdate]})
    @Select([sBasic, sDetail])
    firstname: string

    @Column({type: "varchar", length: 128})
    @MaxLength(128, {groups: [vInsert, vUpdate]})
    @Select([sBasic, sDetail])
    lastname: string

    @Column({type: "enum", enum: GenderType})
    @IsEnum(GenderType, {groups: [vInsert, vUpdate]})
    @Select([sBasic, sDetail])
    gender: GenderType

    @Column({type: "date"})
    @IsDateString({groups: [vInsert, vUpdate]})
    @Select([sBasic, sDetail])
    dob: string

}
