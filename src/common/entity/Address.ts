import { Column } from "typeorm";
import { Length, IsLongitude, IsLatitude, IsOptional } from "class-validator";
import { IsState } from "../../support/validator/StateValidator";
import { IsCity } from "../../support/validator/CityValidator";
import { EmptyEntity, vInsert, vUpdate, Select, sDetail, sAddress, sBasic } from "./Base";
import { IsCountry } from "../../support/validator/CountryValidator";

export class Address extends EmptyEntity {

    @Column({type: "varchar", length: 2})
    @IsCountry({groups: [vInsert, vUpdate]})
    @Select([sBasic, sDetail, sAddress])
    country: string

    @Column({type: "varchar", length: 6})
    @IsState({groups: [vInsert, vUpdate]})
    @Select([sBasic, sDetail, sAddress])
    state: string

    @Column({type: "varchar", length: 12})
    @IsCity({groups: [vInsert, vUpdate]})
    @Select([sBasic, sDetail, sAddress])
    city: string

    @Column({type: "varchar", length: 512})
    @Length(2, 512, {groups: [vInsert, vUpdate]})
    @Select([sBasic,  sDetail, sAddress])
    line: string

    @Column({type: "float", nullable: true})
    @IsOptional({groups: [vInsert, vUpdate]})
    @IsLongitude({groups: [vInsert, vUpdate]})
    @Select([sBasic, sDetail, sAddress])
    longitude: number

    @Column({type: "float", nullable: true})
    @IsOptional({groups: [vInsert, vUpdate]})
    @IsLatitude({groups: [vInsert, vUpdate]})
    @Select([sBasic, sDetail, sAddress])
    latitude: number

}
