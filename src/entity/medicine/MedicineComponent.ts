import { Entity, Column, Unique, ManyToMany } from "typeorm";
import { Base, Select, sBasic, sDetail, vInsert, vUpdate } from "../../common/entity/Base";
import { Length } from "class-validator";
import { Medicine } from "./Medicine";

@Entity()
@Unique(['name', 'dose'])
export class MedicineComponent extends Base {
    
    @Column({type: "varchar", length: 128})
    @Length(2,128, {groups: [vInsert, vUpdate]})
    @Select([sBasic, sDetail])
    name: string

    @Column({type: "varchar", length: 8})
    @Length(1,8, {groups: [vInsert, vUpdate]})
    @Select([sBasic, sDetail])
    dose: string

    @ManyToMany(type => Medicine)
    medicines: Medicine[]

}    