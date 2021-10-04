import { Entity, ManyToOne, ObjectType } from "typeorm";
import { Device } from "../../common/entity/Device";
import { PharmacyUser } from "./PharmacyUser";
import { Account } from "../../common/entity/Account";
import { AppBundle } from "../../common/object/Enum";
import { Equals } from "class-validator";
import { vInsert } from "../../common/entity/Base";

@Entity()
export class PharmacyUserDevice extends Device {

    @Equals(AppBundle.clinic, {groups: [vInsert]})
    topic: AppBundle

    @ManyToOne(type => PharmacyUser, obj => obj.devices, {nullable : false})
    account: PharmacyUser

    ownerTable<T extends Account>(): ObjectType<T> {
        return PharmacyUser
    }

}