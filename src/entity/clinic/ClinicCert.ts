import { Entity, ManyToOne, Column } from "typeorm";
import { Clinic } from "./Clinic";
import { Certificate } from "../../common/entity/Certificate";
import { IsEnum, IsPositive } from "class-validator";
import { vInsert, vUpdate, Select, sDetail, sBasic } from "../../common/entity/Base";
import { ClinicCertType } from "../../common/object/Enum";

@Entity()
export class ClinicCert extends Certificate {

    @Column({type: "enum", enum: ClinicCertType})
    @IsEnum(ClinicCertType, {groups: [vInsert, vUpdate]})
    @Select([sBasic, sDetail])
    type: ClinicCertType

    @ManyToOne(type => Clinic, obj => obj.certificates, {nullable: false})
    clinic: Clinic

    @Column()
    @IsPositive({groups: [vInsert]})
    clinicId: number

    
}