import { ValueTransformer } from "typeorm"
import { DateTransform } from "../../../node/library/utility/Function"

export class DbDateTransformer implements ValueTransformer {

    to(value: any): any {
        return value
    }

    from(value: any): any {
        return DateTransform(value)
    }

}

export const dbDateTransformer = new DbDateTransformer()