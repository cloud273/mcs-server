import { ObjectType, EntityManager, getManager } from "typeorm";
import { QueryDeepPartialEntity } from "typeorm/query-builder/QueryPartialEntity";
import { EmptyEntity } from "../../entity/Base";
import { Result } from "../../object/Result";
import { EmptyEntityRepository } from "./EmptyEntityRepository";
import { Cond } from "../../../../node/library/sql/Cond";

export class EmptyEntityService {

    public static async insert<T extends EmptyEntity>(table: ObjectType<T>, values: QueryDeepPartialEntity<T>, manager: EntityManager = getManager()): Promise<Result> {
        let result: Result
        await EmptyEntityRepository.insert(table, values, manager)
        .then(obj => {
            result = Result.initInsert(obj)
        })
        .catch(error => {
            result = Result.initError(error)
        })
        return result
    }

    public static async get<T extends EmptyEntity>(table: ObjectType<T>, select: (keyof T | string)[], conditions: Cond[] | null, manager: EntityManager = getManager()): Promise<Result> { 
        const obj = await EmptyEntityRepository.get(table, select, conditions, manager)
        if (obj != null) {
            return Result.success(obj)
        } else {
            return Result.notFound()
        }
    }

    public static async getList<T extends EmptyEntity>(table: ObjectType<T>, select: (keyof T | string)[], conditions: Cond[] | null, manager: EntityManager = getManager()): Promise<Result> { 
        const list = await EmptyEntityRepository.getList(table, select, conditions, manager)
        return Result.success(list)
    }

    public static async update<T extends EmptyEntity>(table: ObjectType<T>, conditions: Cond[] | null, updateSet: QueryDeepPartialEntity<T>, manager: EntityManager = getManager()): Promise<Result> {
        let result: Result
        await EmptyEntityRepository.update(table, conditions, updateSet, manager)
        .then(obj => {
            result = Result.initUpdate(obj)
        })
        .catch(error => {
            result = Result.initError(error)
        })
        return result
    }

    public static async delete<T extends EmptyEntity>(table: ObjectType<T>, conditions: Cond[] | null, manager: EntityManager = getManager()): Promise<Result> {  
        let result: Result
        await EmptyEntityRepository.delete(table, conditions, manager)
        .then(obj => {
            result = Result.initDelete(obj)
        })
        .catch(error => {
            result = Result.initError(error)
        })
        return result
    }

}