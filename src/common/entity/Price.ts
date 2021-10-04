import { Column } from "typeorm";
import { IsEnum, IsPositive } from "class-validator";
import { EmptyEntity, vInsert, vUpdate, sDetail, Select, sBasic } from "./Base";
import { CurrencyUnit } from "../object/Enum";

export class Price extends EmptyEntity {

    @Column({type: "double"})
    @IsPositive({groups: [vInsert, vUpdate]})
    @Select([sBasic, sDetail])
    amount: number

    @Column({type: "enum", enum: CurrencyUnit, default: CurrencyUnit.vnd})
    @IsEnum(CurrencyUnit, {groups: [vInsert, vUpdate]})
    @Select([sBasic, sDetail])
    currency: CurrencyUnit

}
