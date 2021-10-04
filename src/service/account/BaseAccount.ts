import { Base } from "../../common/entity/Base";
import { Column } from "typeorm";

export class BaseAccount extends Base {

    @Column({type:"varchar", length: 128, unique: true})
    sso: string

    @Column({type:"varchar", length: 128, unique: true})
    username: string

    @Column({default: false})
    deactivated: Boolean

}