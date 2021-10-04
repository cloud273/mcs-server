import { Entity, ManyToOne, ObjectType } from "typeorm";
import { Device } from "../../common/entity/Device";
import { Doctor } from "./Doctor";
import { Account } from "../../common/entity/Account";
import { AppBundle } from "../../common/object/Enum";
import { Equals } from "class-validator";
import { vInsert } from "../../common/entity/Base";

@Entity()
export class DoctorDevice extends Device {

    @Equals(AppBundle.doctor, {groups: [vInsert]})
    topic: AppBundle

    @ManyToOne(type => Doctor, obj => obj.devices, {nullable : false})
    account: Doctor

    ownerTable<T extends Account>(): ObjectType<T> {
        return Doctor
    }

}