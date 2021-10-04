import { Column } from "typeorm";
import { IsOptional, IsNotEmpty } from "class-validator";
import { EmptyEntity, vInsert, vUpdate, sDetail, Select, sBasic } from "./Base";

export class LocalizeString extends EmptyEntity {

    @Column({type: "varchar", length: 128})
    @IsNotEmpty({groups: [vInsert, vUpdate]})
    @Select([sBasic, sDetail])
    vi: string

    @Column({type: "varchar", length: 128})
    @IsOptional({groups: [vInsert, vUpdate]})
    @Select([sBasic, sDetail])
    en: string

}
