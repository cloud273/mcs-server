import { Cond } from "../../../node/library/sql/Cond";
import { Where } from "../../../node/library/sql/Where";

export class SqlWhere {

    public static get(parameters: Cond[] | null, deactivated: boolean | undefined = undefined, alias: string = null): string | null {
        if (parameters != null || deactivated != undefined) {
            const conditions: Cond[] = []
            if (deactivated != undefined) {
                conditions.push(Cond.equal('deactivated', deactivated))
            }
            if (parameters != null) {
                parameters.forEach(cond => {
                    conditions.push(cond)
                })
            }
            if (conditions.length > 0) {
                return Where.and(conditions, alias)
            }
        } 
        return null
    }

}

export class SqlUpdate {

    public static deactivateSet(): {} {
        return { 
            "deactivated" : true
        }
    }

}