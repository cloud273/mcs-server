import { EntityManager, getManager } from "typeorm";
import { SqlWhere } from "../support/utility/SqlUtility";
import { Cond } from "../../node/library/sql/Cond";
import { PackageType } from "../common/object/Enum";
import { Schedule } from "../entity/clinic/Schedule";
import { WorkingDay } from "../entity/clinic/WorkingDay";
import { Package } from "../entity/clinic/Package";

export class CheckActiveRepository {

    //-------------------Package---------------------//
    public static async isExistedPackage(doctorId: number, type: PackageType, specialty: string, exceptedId: number | undefined, manager: EntityManager = getManager()): Promise<boolean> {
        const list = await manager.createQueryBuilder(Package, 'p')
        .select(Package.id('p'))
        .where(SqlWhere.get([
            Cond.equal('doctorId', doctorId),
            Cond.equal('type', type),
            Cond.equal('specialty', specialty)
        ], false, 'p'))
        .getMany()
        if (list.length > 0) {
            if (exceptedId != undefined) {
                for (const obj of list) {
                    if (obj.id != exceptedId) {
                        return true
                    }
                }
            } else {
                return true
            }
        }
        return false
    }

    public static async isExistedActivePackageByClinicAdmin(clinicAdminId: number, packageId: number, manager: EntityManager = getManager()): Promise<boolean> {
        return await manager
        .createQueryBuilder(Package, 'p')
        .innerJoin('p.doctor', 'd', SqlWhere.get(null, false, 'd'))
        .innerJoin('d.clinic', 'c', SqlWhere.get(null, false, 'c'))
        .innerJoin('c.users', 'u', SqlWhere.get([Cond.equal('id', clinicAdminId)], false, 'u'))
        .where(SqlWhere.get([Cond.equal('id', packageId)], false, 'p'))
        .getCount() > 0
    }

    public static async isExistedActivePackageByDoctor(doctorId: number, packageId: number, manager: EntityManager = getManager()): Promise<boolean> {
        return await manager
        .createQueryBuilder(Package, 'p')
        .where(SqlWhere.get([Cond.equal('id', packageId), Cond.equal('doctorId', doctorId)], false, 'p'))
        .getCount() > 0
    }

    //-------------------Schedule---------------------//
    public static async isCollapsedSchedule(packageId: number, fromString: string /*YYYY-MM-dd*/, toString: string /*YYYY-MM-dd*/, exceptedId: number | undefined, manager: EntityManager = getManager()): Promise<boolean> {
        const list = await manager.createQueryBuilder(Schedule, 's')
        .select(Schedule.id('s'))
        .where(SqlWhere.get([
            Cond.equal('packageId', packageId),
            Cond.moreOrEqual('duration.to', fromString), 
            Cond.lessOrEqual('duration.from', toString)
        ], false, 's'))
        .getMany()
        if (list.length > 0) {
            if (exceptedId != undefined) {
                for (const obj of list) {
                    if (obj.id != exceptedId) {
                        return true
                    }
                }
            } else {
                return true
            }
        }
        return false
    }

    //-------------------WorkingDay---------------------//
    public static async isExistedWorkingDay(packageId: number, dateString: string, exceptedId: number | undefined, manager: EntityManager = getManager()): Promise<boolean> {
        const list = await manager.createQueryBuilder(WorkingDay, 'w')
        .select(WorkingDay.id('w'))
        .where(SqlWhere.get([
            Cond.equal('packageId', packageId),
            Cond.equal('date', dateString)
        ], false, 'w'))
        .getMany()
        if (list.length > 0) {
            if (exceptedId != undefined) {
                for (const obj of list) {
                    if (obj.id != exceptedId) {
                        return true
                    }
                }
            } else {
                return true
            }
        }
        return false
    }

    public static async isExistedActiveWorkingDayByClinicAdmin(clinicAdminId: number, workindDayId: number, manager: EntityManager = getManager()): Promise<boolean> {
        return await manager
        .createQueryBuilder(WorkingDay, 'w')
        .innerJoin('w.package', 'p', SqlWhere.get(null, false, 'p'))
        .innerJoin('p.doctor', 'd', SqlWhere.get(null, false, 'd'))
        .innerJoin('d.clinic', 'c', SqlWhere.get(null, false, 'c'))
        .innerJoin('c.users', 'u', SqlWhere.get([Cond.equal('id', clinicAdminId)], false, 'u'))
        .where(SqlWhere.get([Cond.equal('id', workindDayId)], false, 'w'))
        .getCount() > 0
    }

    public static async isExistedActiveWorkingDayByDoctor(doctorId: number, workindDayId: number, manager: EntityManager = getManager()): Promise<boolean> {
        return await manager
        .createQueryBuilder(WorkingDay, 'w')
        .innerJoin('w.package', 'p', SqlWhere.get([Cond.equal('doctorId', doctorId)], false, 'p'))
        .where(SqlWhere.get([Cond.equal('id', workindDayId)], false, 'w'))
        .getCount() > 0
    }

}