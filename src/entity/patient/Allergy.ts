import { Entity, Column, ManyToOne, Unique } from "typeorm";
import { Patient } from "./Patient";
import { Base, vInsert, vUpdate, Select, sDetail } from "../../common/entity/Base";
import { Length, IsPositive } from "class-validator";

@Entity()
@Unique(['name', 'patientId'])
export class Allergy extends Base {
    
    @Column({type: "varchar", length: 128})
    @Length(2, 128, {groups: [vInsert, vUpdate]})
    @Select([sDetail])
    name: string

    @ManyToOne(type => Patient, obj => obj.allergies, {nullable : false})
    patient: Patient

    @Column()
    @IsPositive()
    patientId: number
    
}