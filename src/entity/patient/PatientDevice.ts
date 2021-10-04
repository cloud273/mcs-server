import { Entity, ManyToOne, ObjectType } from "typeorm";
import { Patient } from "./Patient";
import { Device } from "../../common/entity/Device";
import { Account } from "../../common/entity/Account";
import { AppBundle } from "../../common/object/Enum";
import { Equals } from "class-validator";
import { vInsert } from "../../common/entity/Base";

@Entity()
export class PatientDevice extends Device {

    @Equals(AppBundle.patient, {groups: [vInsert]})
    topic: AppBundle

    @ManyToOne(type => Patient, obj => obj.devices, {nullable : false})
    account: Patient

    ownerTable<T extends Account>(): ObjectType<T> {
        return Patient
    }

}