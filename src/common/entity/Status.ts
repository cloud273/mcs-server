import { Select, sBasic, sDetail, EmptyEntity, vInsert, vUpdate } from "./Base"
import { Column } from "typeorm"
import { UserType, StatusType } from "../object/Enum"
import { IsEnum, IsOptional, MaxLength } from "class-validator"

export class Status extends EmptyEntity {
    
    @Column({type: "enum", enum: UserType})
    @IsEnum(UserType)
    @Select([sBasic, sDetail])
    by: UserType
    
    @Column({type: "enum", enum: StatusType})
    @IsEnum(StatusType)
    @Select([sBasic, sDetail])
    value: StatusType

    @Column({type: "varchar", length: 512, nullable: true})
    @IsOptional({groups: [vInsert, vUpdate]})
    @MaxLength(512, {groups: [vInsert, vUpdate]})
    @Select([sDetail])
    description: string

    static create(by: UserType, value: StatusType, description: string | undefined): Status {
        const result = new Status()
        result.by = by
        result.value = value
        result.description = description
        return result
    }

}    