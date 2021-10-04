import { ObjectType, getManager, EntityManager } from "typeorm";
import { QueryDeepPartialEntity } from "typeorm/query-builder/QueryPartialEntity";
import { Base } from "../entity/Base";
import { Result } from "../object/Result";
import { EmptyEntityService } from "./basic/EmptyEntityService";
import { Cond } from "../../../node/library/sql/Cond";

export class OwnerBaseService {
    
    public static async getDetail<T extends Base>(table: ObjectType<T>, id: number, field: keyof T | string, value: any, deactivated: boolean| undefined = undefined, manager: EntityManager = getManager()): Promise<Result> {  
        let select: string[]
        const condition = [Cond.equal('id', id), Cond.equal(field as string, value)]
        if (deactivated == undefined) {
            select = Object.getPrototypeOf(Object.create(table)).detail(true)
        } else {
            condition.push(Cond.equal('deactivated', deactivated))
            select = Object.getPrototypeOf(Object.create(table)).detail(false)
        }
        return EmptyEntityService.get(table, select, condition, manager)
    }

    public static async getList<T extends Base>(table: ObjectType<T>, field: keyof T | string, value: any, deactivated: boolean| undefined = undefined, manager: EntityManager = getManager()): Promise<Result> {  
        let select: string[]
        const condition = [Cond.equal(field as string, value)]
        if (deactivated == undefined) {
            select = Object.getPrototypeOf(Object.create(table)).basic(true)
        } else {
            condition.push(Cond.equal('deactivated', deactivated))
            select = Object.getPrototypeOf(Object.create(table)).basic(false)
        }
        return EmptyEntityService.getList(table, select, condition, manager)
    }
    
    public static async update<T extends Base>(table: ObjectType<T>, updateSet: QueryDeepPartialEntity<T>, whereId: number, field: keyof T | string, value: any, deactivated: boolean| undefined = undefined, manager: EntityManager = getManager()): Promise<Result> {
        const condition = [Cond.equal('id', whereId), Cond.equal(field as string, value)]
        if (deactivated != undefined) {
            condition.push(Cond.equal('deactivated', deactivated))
        }
        return EmptyEntityService.update(table, condition, updateSet, manager)
    }

    public static async updateField<T extends Base>(table: ObjectType<T>, field: keyof T, value: any, whereId: number, whereField: keyof T | string, whereValue: any, deactivated: boolean| undefined = undefined, manager: EntityManager = getManager()): Promise<Result> {
        const updateSet : QueryDeepPartialEntity<T> = {}
        updateSet[field] = value
        return this.update(table, updateSet, whereId, whereField, whereValue, deactivated, manager)
    }

    public static async deactivate<T extends Base>(table: ObjectType<T>, id: number, field: keyof T | string, value: any, manager: EntityManager = getManager()): Promise<Result> {
        let result = await this.updateField(table, 'deactivated', true, id, field, value, undefined, manager)
        if (result.isUpdated) {
            result = Result.deactivated()
        }
        return result
    }

    public static async delete<T extends Base>(table: ObjectType<T>, id: number, field: keyof T | string, value: any, deactivated: boolean = undefined, manager: EntityManager = getManager()): Promise<Result> {  
        const condition = [Cond.equal('id', id), Cond.equal(field as string, value)]
        if (deactivated != undefined) {
            condition.push(Cond.equal('deactivated', deactivated))
        }
        return EmptyEntityService.delete(table, condition, manager)
    }

}