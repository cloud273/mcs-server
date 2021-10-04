import { Entity, ManyToOne, Column } from "typeorm";
import { Doctor } from "./Doctor";
import { Certificate } from "../../common/entity/Certificate";
import { IsEnum, IsPositive } from "class-validator";
import { vInsert, vUpdate, sBasic, sDetail, Select } from "../../common/entity/Base";
import { DoctorCertType } from "../../common/object/Enum";

@Entity()
export class DoctorCert extends Certificate {

    @Column({type: "enum", enum: DoctorCertType})
    @IsEnum(DoctorCertType, {groups: [vInsert, vUpdate]})
    @Select([sBasic, sDetail])
    type: DoctorCertType

    @ManyToOne(type => Doctor, obj => obj.certificates, {nullable: false})
    doctor: Doctor

    @Column()
    @IsPositive({groups: [vInsert]})
    doctorId: number


}