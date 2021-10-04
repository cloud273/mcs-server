import { Column } from "typeorm";
import { vInsert, vUpdate, EmptyEntity } from "./Base";
import { Length } from "class-validator";

export class Symptom extends EmptyEntity {

    @Column({type: "varchar", length: 128})
    @Length(2, 128, {groups: [vInsert, vUpdate]})
    name: string

    @Column({type: "varchar", length: 512})
    @Length(2, 512, {groups: [vInsert, vUpdate]})
    note: string

}