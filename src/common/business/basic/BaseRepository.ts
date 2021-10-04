import { getManager, ObjectType, EntityManager } from "typeorm";
import { Base } from "../../entity/Base";
import { EmptyEntityRepository } from "./EmptyEntityRepository";
import { Cond } from "../../../../node/library/sql/Cond";

export class BaseRepository {

    private static getCondition<T extends Base>(field: keyof T | string, value: any, deactivated: boolean| undefined = undefined): Cond[] {
        const result = [Cond.equal(field as string, value)]
        if (deactivated != undefined) {
            result.push(Cond.equal('deactivated', deactivated))
        }
        return result
    }

    public static async get<T extends Base>(table: ObjectType<T>, select: (keyof T | string)[], field: keyof T, value: any, deactivated: boolean| undefined = undefined, manager: EntityManager = getManager()): Promise<T | undefined> {  
        const condition = this.getCondition(field, value, deactivated)
        return EmptyEntityRepository.get(table, select, condition, manager)
    }

    public static async getList<T extends Base>(table: ObjectType<T>, select: (keyof T | string)[], field: keyof T | string, value: any, deactivated: boolean| undefined = undefined, manager: EntityManager = getManager()): Promise<T[]> {  
        const condition = this.getCondition(field, value, deactivated)
        return EmptyEntityRepository.getList(table, select, condition, manager)
    }

    public static async isExisted<T extends Base>(table: ObjectType<T>, field: keyof T | string, value: any, deactivated: boolean| undefined = undefined, manager: EntityManager = getManager()): Promise<boolean> {  
        const condition = this.getCondition(field, value, deactivated)
        return EmptyEntityRepository.isExisted(table, condition, manager)
    }

    public static async getById<T extends Base>(table: ObjectType<T>, select: (keyof T | string)[], id: number, deactivated: boolean| undefined = undefined, manager: EntityManager = getManager()): Promise<T | undefined> {  
        return this.get(table, select, 'id', id, deactivated, manager)
    }
    
    public static async isExistedID<T extends Base>(table: ObjectType<T>, id: number, deactivated: boolean| undefined = undefined, manager: EntityManager = getManager()): Promise<boolean> {  
        return this.isExisted(table, 'id', id, deactivated, manager)
    }

}