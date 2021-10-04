import { Column } from "typeorm";
import { Base, vInsert, vUpdate, Select, sDetail, sBasic} from "./Base";
import { Length, IsOptional } from "class-validator";
import { IsDateString } from "../../../node/library/validator/DateStringValidator";

export class Certificate extends Base {

    @Column({type: "varchar", length: 32})
    @Length(2, 32, {groups: [vInsert, vUpdate]})
    @Select([sDetail])
    code: string
    
    // @Column({type: "json"})
    // @IsNotEmpty({groups: [vInsert, vUpdate]})
    // @ValidateNested({groups: [vInsert, vUpdate]})
    // @Select([sBasic, sDetail])
    // @Type(() => LocalizeString)
    // name: LocalizeString

    // @Column({type: "json"})
    // @IsNotEmpty({groups: [vInsert, vUpdate]})
    // @ValidateNested({groups: [vInsert, vUpdate]})
    // @Select([sBasic, sDetail])
    // @Type(() => LocalizeString)
    // issuer: LocalizeString

    @Column({type: "varchar", length: 128})
    @Length(2, 128, {groups: [vInsert, vUpdate]})
    @Select([sBasic, sDetail])
    name: string

    @Column({type: "varchar", length: 128})
    @Length(2, 128, {groups: [vInsert, vUpdate]})
    @Select([sDetail])
    issuer: string

    @Column({type: "date"})
    @IsDateString({groups: [vInsert, vUpdate]})
    @Select([sDetail])
    issueDate: string

    @Column({type: "date", nullable: true})
    @IsOptional({groups: [vInsert, vUpdate]})
    @IsDateString({groups: [vInsert, vUpdate]})
    @Select([sDetail])
    expDate: string

    @Column({type: "varchar", length: 128})
    @Length(2, 128, {groups: [vInsert, vUpdate]})
    @Select([sDetail])
    image: string

}