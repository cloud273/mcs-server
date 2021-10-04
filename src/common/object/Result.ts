import { UpdateResult, DeleteResult, InsertResult, ObjectLiteral } from "typeorm";
import { Sql } from "../../../node/library/sql/Sql";
import { ApiResponse } from "../../../node/library/http/Api";
import { Base } from "../entity/Base";

export enum StatusCode {

    success = 200,
    created = 201,
    updated = 200,
    deleted = 200,
    deactivated = 200,
    accepted = 202,
    badRequest = 400,
    unAuthorized = 401,
    forbidden = 403,
    notFound = 404,
    notAcceptable = 406,
    existed = 409,
    unauthorised = 460,
    unknown = 500

}

export class Result {

    code : number
    data? : any

    constructor(code: number, data?: any) {
        this.code = code
        this.data = data
    }

    get isSuccess(): boolean {
        return this.code == StatusCode.success
    }

    get isCreated(): boolean {
        return this.code == StatusCode.created
    }

    get isUpdated(): boolean {
        return this.code == StatusCode.updated
    }

    static init(code: number, data: any = null): Result {
        return new Result(code, data)
    }

    static initApiResponse(response: ApiResponse): Result {
        return Result.init(response.code, response.data)
    }

    static initInsert(obj: InsertResult): Result {
        let status = Sql.insert(obj)
        if (status == Sql.created) {
            return Result.created(obj.identifiers)
        } else {
            return Result.init(status)
        }
    }

    static initUpdate(obj: UpdateResult): Result {
        let status = Sql.update(obj)
        if (status == Sql.success) {
            return Result.updated()
        } else {
            return Result.init(status)
        }
    }

    static initDelete(obj: DeleteResult): Result {
        let status = Sql.delete(obj)
        if (status == Sql.success) {
            return Result.deleted()
        } else {
            return Result.init(status)
        }
    }

    static initError(sqlError: any): Result {
        return Result.init(Sql.error(sqlError))
    }

    static created(obj?: Base | ObjectLiteral[]): Result {
        if (obj == null) {
            return Result.init(StatusCode.created, {
                message: "created"
            })
        } else {
            if (obj instanceof Base) {
                return Result.init(StatusCode.created, {
                    id: obj.id
                })
            } else {
                if (obj.length == 1) {
                    return Result.init(StatusCode.created, obj[0])
                } else {
                    return Result.init(StatusCode.created, obj)
                }   
            }
        }
    }

    static updated(): Result {
        return Result.init(StatusCode.updated, {
            message: "updated"
        })
    }

    static deleted(): Result {
        return Result.init(StatusCode.deleted, {
            message: "deleted"
        })
    }

    static deactivated(): Result {
        return Result.init(StatusCode.deactivated, {
            message: "deactivated"
        })
    }

    static success(data: any = null): Result {
        if (data == null) {
            return Result.init(StatusCode.success, {
                message: "successful"
            })
        } else {
            return Result.init(StatusCode.success, data)
        } 
    }

    static forbidden(): Result {
        return Result.init(StatusCode.forbidden)
    }

    static notAcceptable(): Result {
        return Result.init(StatusCode.notAcceptable)
    }

    static notFound(): Result {
        return Result.init(StatusCode.notFound)
    }

    static existed(): Result {
        return Result.init(StatusCode.existed)
    }

    static unauthorised(): Result {
        return Result.init(StatusCode.unauthorised)
    }

    static unknown(): Result {
        return Result.init(StatusCode.unknown)
    }

}
