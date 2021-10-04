import { Entity, ManyToOne, Column } from "typeorm";
import { Certificate } from "../../common/entity/Certificate";
import { IsEnum, IsPositive } from "class-validator";
import { vInsert, vUpdate, Select, sDetail, sBasic } from "../../common/entity/Base";
import { PharmacyCertType } from "../../common/object/Enum";
import { Pharmacy } from "./Pharmacy";

@Entity()
export class PharmacyCert extends Certificate {

    @Column({type: "enum", enum: PharmacyCertType})
    @IsEnum(PharmacyCertType, {groups: [vInsert, vUpdate]})
    @Select([sBasic, sDetail])
    type: PharmacyCertType

    @ManyToOne(type => Pharmacy, obj => obj.certificates, {nullable: false})
    pharmacy: Pharmacy

    @Column()
    @IsPositive({groups: [vInsert]})
    pharmacyId: number

    
}