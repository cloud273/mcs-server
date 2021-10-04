import { Entity, ManyToOne, ObjectType } from "typeorm";
import { Device } from "../../common/entity/Device";
import { ClinicUser } from "./ClinicUser";
import { Account } from "../../common/entity/Account";
import { AppBundle } from "../../common/object/Enum";
import { Equals } from "class-validator";
import { vInsert } from "../../common/entity/Base";

@Entity()
export class ClinicUserDevice extends Device {

    @Equals(AppBundle.clinic, {groups: [vInsert]})
    topic: AppBundle

    @ManyToOne(type => ClinicUser, obj => obj.devices, {nullable : false})
    account: ClinicUser

    ownerTable<T extends Account>(): ObjectType<T> {
        return ClinicUser
    }

}