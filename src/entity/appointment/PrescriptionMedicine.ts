import { Entity, Column, ManyToOne } from "typeorm";
import { Base,  vInsert } from "../../common/entity/Base";
import { IsPositive } from "class-validator";
import { Prescription } from "./Prescription";

@Entity()
export class PrescriptionMedicine extends Base {

    @Column({type: "double"})
    @IsPositive({groups: [vInsert]})
    total: number

    @Column({type: "double"})
    @IsPositive({groups: [vInsert]})
    morning: number

    @Column({type: "double"})
    @IsPositive({groups: [vInsert]})
    afternoon: number

    @Column({type: "double"})
    @IsPositive({groups: [vInsert]})
    evening: number

    @Column({type: "double"})
    @IsPositive({groups: [vInsert]})
    night: number

    @ManyToOne(type => Prescription, obj => obj.medicines, {nullable : false})
    prescription: Prescription

    @Column()
    @IsPositive({groups: [vInsert]})
    prescriptionId: number

}    