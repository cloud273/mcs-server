import { getManager, ObjectType, UpdateResult, EntityManager, DeleteResult, InsertResult } from "typeorm";
import { QueryDeepPartialEntity } from "typeorm/query-builder/QueryPartialEntity";
import { EmptyEntity } from "../../entity/Base";
import { Cond } from "../../../../node/library/sql/Cond";
import { Merge } from "../../../../node/library/utility/Function";
import { Where } from "../../../../node/library/sql/Where";

export class EmptyEntityRepository {

    private static getCondition<T extends EmptyEntity>(conditions: Cond[] | null, alias: string = null): string | null {
        if (conditions != null && conditions.length > 0) {
            return Where.and(conditions, alias)
        } else {
            return null
        }
    }

    public static async save(data: EmptyEntity | EmptyEntity[], manager: EntityManager = getManager()): Promise<EmptyEntity | EmptyEntity[]> {
        return manager.save(data)
    }

    public static async insert<T extends EmptyEntity>(table: ObjectType<T>, values: QueryDeepPartialEntity<T>, manager: EntityManager = getManager()): Promise<InsertResult> {
        return manager
        .createQueryBuilder()
        .insert()
        .into(table)
        .values(values)
        .execute()
    }

    public static async get<T extends EmptyEntity>(table: ObjectType<T>, select: (keyof T | string)[], conditions: Cond[] | null, manager: EntityManager = getManager()): Promise<T | undefined> { 
        return manager
        .createQueryBuilder(table, 't')
        .select(Merge(select as string[], 't'))
        .where(this.getCondition(conditions, 't'))
        .getOne()
    }

    public static async getList<T extends EmptyEntity>(table: ObjectType<T>, select: (keyof T | string)[], conditions: Cond[] | null, manager: EntityManager = getManager()): Promise<T[]> { 
        return manager
        .createQueryBuilder(table, 't')
        .select(Merge(select as string[], 't'))
        .where(this.getCondition(conditions, 't'))
        .getMany()
    }

    public static async update<T extends EmptyEntity>(table: ObjectType<T>, conditions: Cond[] | null, updateSet: QueryDeepPartialEntity<T>, manager: EntityManager = getManager()): Promise<UpdateResult> {
        return manager
        .createQueryBuilder()
        .update(table, updateSet)
        .where(this.getCondition(conditions))
        .execute()
    }

    public static async delete<T extends EmptyEntity>(table: ObjectType<T>, conditions: Cond[] | null, manager: EntityManager = getManager()): Promise<DeleteResult> {  
        return manager
        .createQueryBuilder()
        .delete()
        .from(table)
        .where(this.getCondition(conditions))
        .execute()
    }

    public static async isExisted<T extends EmptyEntity>(table: ObjectType<T>, conditions: Cond[] | null, manager: EntityManager = getManager()): Promise<boolean> {  
        return await manager
        .createQueryBuilder(table, 't')
        .where(this.getCondition(conditions))
        .getCount() > 0
    }

}