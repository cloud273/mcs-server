import { Column } from "typeorm";
import { Base, vInsert, vUpdate, Select, sBasic, sDetail } from "./Base";
import { Length, IsEnum } from "class-validator";
import { IsRate } from "../../support/validator/RateValidator";
import { ReviewStatus } from "../object/Enum";

export class Review extends Base {

    @Column({type: "varchar", length: 128})
    @Length(2, 128, {groups: [vInsert, vUpdate]})
    @Select([sBasic, sDetail])
    title: string

    @Column({type: "text"})
    @Length(10, 10000, {groups: [vInsert, vUpdate]})
    @Select([sDetail])
    description: string

    @Column({type: "int"})
    @IsRate({groups: [vInsert, vUpdate]})
    @Select([sBasic, sDetail])
    rating: number

    @Column({type: "enum", enum: ReviewStatus})
    @IsEnum(ReviewStatus)
    @Select([sBasic, sDetail])
    status: ReviewStatus

}