import { Entity, Column, ManyToOne } from "typeorm";
import { Base, Select, sBasic, sDetail } from "../../common/entity/Base";
import { Appointment } from "./Appointment";
import { IsEnum, IsPositive, IsOptional, MaxLength } from "class-validator";
import { StatusType, UserType } from "../../common/object/Enum";
import { Status } from "../../common/entity/Status";

@Entity()
export class AppointmentStatus extends Base {
    
    @Column({type: "enum", enum: UserType})
    @IsEnum(UserType)
    @Select([sBasic, sDetail])
    by: UserType
    
    @Column({type: "enum", enum: StatusType})
    @IsEnum(StatusType)
    @Select([sBasic, sDetail])
    value: StatusType

    @ManyToOne(type => Appointment, obj => obj.statuses, {nullable : false})
    appointment: Appointment

    @Column()
    @IsPositive()
    appointmentId: number

    static create(status: Status, appointmentId: number | undefined): AppointmentStatus {
        const result = new AppointmentStatus()
        result.by = status.by
        result.value = status.value
        result.description = status.description
        result.appointmentId = appointmentId
        return result
    }
}    
