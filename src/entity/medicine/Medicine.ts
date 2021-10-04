import { Entity, Column, Unique, ManyToMany, JoinTable } from "typeorm";
import { Base, Select, sBasic, sDetail, vInsert, vUpdate } from "../../common/entity/Base";
import { Length, IsEnum } from "class-validator";
import { MedicineUsedType } from "../../common/object/Enum";
import { MedicineComponent } from "./MedicineComponent";

@Entity()
@Unique(['name', 'type', 'brand'])
export class Medicine extends Base {
    
    @Column({type: "varchar", length: 128})
    @Length(2,128, {groups: [vInsert, vUpdate]})
    @Select([sBasic, sDetail])
    name: string

    @Column({type: "enum", enum: MedicineUsedType})
    @IsEnum(MedicineUsedType, {groups: [vInsert, vUpdate]})
    @Select([sBasic, sDetail])
    type: MedicineUsedType

    @Column({type: "varchar", length: 128})
    @Length(2,128, {groups: [vInsert, vUpdate]})
    @Select([sBasic, sDetail])
    brand: string

    @ManyToMany(type => MedicineComponent)
    @JoinTable()
    components: MedicineComponent[]

}    