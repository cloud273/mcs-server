import { Entity, Column } from "typeorm";
import { Base, vInsert, vUpdate, Select, sBasic, sDetail } from "../../common/entity/Base";
import { Length } from "class-validator";

@Entity()
export class ICD extends Base {

    @Column({type: "varchar", length: 32, unique: true})
    @Length(2,32, {groups: [vInsert, vUpdate]})
    @Select([sBasic, sDetail])
    code: string

    @Column({type: "varchar", length: 256})
    @Length(2,256, {groups: [vInsert, vUpdate]})
    @Select([sBasic, sDetail])
    disease: string

}    