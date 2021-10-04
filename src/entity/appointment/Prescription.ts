import { Entity, Column, OneToOne, OneToMany } from "typeorm";
import { Base,  vInsert, sBasic, sDetail, Select } from "../../common/entity/Base";
import { IsPositive, Length } from "class-validator";
import { Appointment } from "./Appointment";
import { PrescriptionMedicine } from "./PrescriptionMedicine";

@Entity()
export class Prescription extends Base {

    @Column({type: "varchar", length: 32, nullable: true})
    @Length(2,32, {groups: [vInsert]})
    @Select([sBasic, sDetail])
    icdCode: string

    @Column({type: "varchar", length: 256})
    @Length(2,256, {groups: [vInsert]})
    @Select([sBasic, sDetail])
    disease: string

    @OneToMany(type => PrescriptionMedicine, obj => obj.prescription, {cascade: true})
    medicines: PrescriptionMedicine[]

    @OneToOne(type => Appointment, obj => obj.prescription, {nullable : false})
    appointment: Appointment

    @Column()
    @IsPositive({groups: [vInsert]})
    appointmentId: number

}    