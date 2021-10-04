import { Entity, ManyToOne, ObjectType } from "typeorm";
import { Device } from "../../common/entity/Device";
import { Admin } from "./Admin";
import { Account } from "../../common/entity/Account";
import { AppBundle } from "../../common/object/Enum";
import { Equals } from "class-validator";
import { vInsert } from "../../common/entity/Base";

@Entity()
export class AdminDevice extends Device {

    @Equals(AppBundle.admin, {groups: [vInsert]})
    topic: AppBundle

    @ManyToOne(type => Admin, obj => obj.devices, {nullable : false})
    account: Admin

    ownerTable<T extends Account>(): ObjectType<T> {
        return Admin
    }

}