import { ObjectType, EntityManager, getManager } from "typeorm";
import { QueryDeepPartialEntity } from "typeorm/query-builder/QueryPartialEntity";
import { Base } from "../entity/Base";
import { Result } from "../object/Result";
import { EmptyEntityService } from "./basic/EmptyEntityService";
import { EmptyEntityRepository } from "./basic/EmptyEntityRepository";
import { Cond } from "../../../node/library/sql/Cond";

export class BaseService {

    public static async save(data: Base | Base[], manager: EntityManager = getManager()): Promise<Result> {
        const created = Array.isArray(data) ? undefined : data.id == undefined 
        let result: Result
        await EmptyEntityRepository.save(data, manager)
        .then(obj => {
            if (created == undefined) {
                result = Result.success()
            } else if (created) {
                result = Result.created(obj as Base)
            } else {
                result = Result.updated()
            }
        })
        .catch(error => {
            result = Result.initError(error);
        })
        return result   
    }

    public static async getDetail<T extends Base>(table: ObjectType<T>, id: number, deactivated: boolean| undefined = undefined, manager: EntityManager = getManager()): Promise<Result> {  
        let select: string[]
        const condition = [Cond.equal('id', id)]
        if (deactivated == undefined) {
            select = Object.getPrototypeOf(Object.create(table)).detail(true)
        } else {
            condition.push(Cond.equal('deactivated', deactivated))
            select = Object.getPrototypeOf(Object.create(table)).detail(false)
        }
        return EmptyEntityService.get(table, select, condition, manager)
    }

    public static async getList<T extends Base>(table: ObjectType<T>, deactivated: boolean| undefined = undefined, manager: EntityManager = getManager()): Promise<Result> {
        let select: string[]
        let condition: Cond[]
        if (deactivated == undefined) {
            select = Object.getPrototypeOf(Object.create(table)).basic(true)
        } else {
            condition = []
            condition.push(Cond.equal('deactivated', deactivated))
            select = Object.getPrototypeOf(Object.create(table)).basic(false)
        }
        return EmptyEntityService.getList(table, select, condition, manager)
    }

    public static async insert<T extends Base>(table: ObjectType<T>, values: QueryDeepPartialEntity<T>, manager: EntityManager = getManager()): Promise<Result> {
        return EmptyEntityService.insert(table, values, manager)
    }

    public static async update<T extends Base>(table: ObjectType<T>, updateSet: QueryDeepPartialEntity<T>, whereId: number, deactivated: boolean| undefined = undefined, manager: EntityManager = getManager()): Promise<Result> {
        const condition = [Cond.equal('id', whereId)]
        if (deactivated != undefined) {
            condition.push(Cond.equal('deactivated', deactivated))
        }
        return EmptyEntityService.update(table, condition, updateSet, manager)
    }
    
    public static async updateField<T extends Base>(table: ObjectType<T>, field: keyof T, value: any, whereId: number, deactivated: boolean| undefined = undefined, manager: EntityManager = getManager()): Promise<Result> {
        const updateSet : QueryDeepPartialEntity<T> = {}
        updateSet[field] = value
        return this.update(table, updateSet, whereId, deactivated, manager)
    }

    public static async deactivate<T extends Base>(table: ObjectType<T>, id: number, manager: EntityManager = getManager()): Promise<Result> {
        let result = await this.updateField(table, 'deactivated', true, id, undefined, manager)
        if (result.isUpdated) {
            result = Result.deactivated()
        }
        return result
    }

    public static async delete<T extends Base>(table: ObjectType<T>, id: number, deactivated: boolean = undefined, manager: EntityManager = getManager()): Promise<Result> {  
        const condition = [Cond.equal('id', id)]
        if (deactivated != undefined) {
            condition.push(Cond.equal('deactivated', deactivated))
        }
        return EmptyEntityService.delete(table, condition, manager)
    }

}