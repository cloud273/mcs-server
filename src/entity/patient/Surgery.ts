import { Entity, Column, ManyToOne, Unique } from "typeorm";
import { Patient } from "./Patient";
import { Base, vInsert, vUpdate, Select, sDetail } from "../../common/entity/Base";
import { Length, IsPositive, IsOptional } from "class-validator";
import { IsDateString } from "../../../node/library/validator/DateStringValidator";

@Entity()
@Unique(['name', 'patientId'])
export class Surgery extends Base {

    @Column({type: "varchar", length: 128})
    @Length(2, 128, {groups: [vInsert, vUpdate]})
    @Select([sDetail])
    name: string

    @Column({type: "date", nullable: true})
    @IsOptional({groups: [vInsert, vUpdate]})
    @IsDateString({groups: [vInsert, vUpdate]})
    @Select([sDetail])
    date: string

    @ManyToOne(type => Patient, obj => obj.surgeries, {nullable : false})
    patient: Patient

    @Column()
    @IsPositive()
    patientId: number
    
}