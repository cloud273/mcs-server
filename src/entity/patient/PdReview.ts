import { Column, ManyToOne, Entity } from "typeorm";
import { Review } from "../../common/entity/Review";
import { Patient } from "./Patient";
import { Doctor } from "../clinic/Doctor";
import { IsPositive } from "class-validator";

@Entity()
export class PdReview extends Review {

    @ManyToOne(type => Patient, obj => obj.reviews, {nullable : false})
    patient: Patient

    @Column()
    @IsPositive()
    patientId: number

    @ManyToOne(type => Doctor, obj => obj.reviews, {nullable : false})
    doctor: Doctor

    @Column()
    @IsPositive()
    doctorId: number

}