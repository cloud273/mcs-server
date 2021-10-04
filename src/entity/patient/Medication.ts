import { Entity, Column, ManyToOne, Unique } from "typeorm";
import { Patient } from "./Patient";
import { Base, vInsert, vUpdate, Select, sDetail } from "../../common/entity/Base";
import { IsEnum, IsPositive } from "class-validator";
import { Trilean, MedicationType } from "../../common/object/Enum";

@Entity()
@Unique(['name', 'patientId'])
export class Medication extends Base {

    @Column({type: "enum", enum: MedicationType})
    @IsEnum(MedicationType, {groups: [vInsert]})
    @Select([sDetail])
    name: MedicationType

    @Column({type: "enum", enum: Trilean, default: Trilean.unknown})
    @IsEnum(Trilean,{groups: [vInsert, vUpdate]})
    @Select([sDetail])
    value: Trilean

    @ManyToOne(type => Patient, obj => obj.medications, {nullable : false})
    patient: Patient

    @Column()
    @IsPositive()
    patientId: number


}