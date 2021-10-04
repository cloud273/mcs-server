import { EntityManager, getManager, ObjectType, DeleteResult } from "typeorm";
import { Clinic } from "../entity/clinic/Clinic";
import { Doctor } from "../entity/clinic/Doctor";
import { ClinicCert } from "../entity/clinic/ClinicCert";
import { SqlWhere } from "../support/utility/SqlUtility";
import { Cond } from "../../node/library/sql/Cond";
import { DoctorCert } from "../entity/clinic/DoctorCert";
import { Patient } from "../entity/patient/Patient";
import { Allergy } from "../entity/patient/Allergy";
import { Surgery } from "../entity/patient/Surgery";
import { Medication } from "../entity/patient/Medication";
import { PackageType, AppBundle } from "../common/object/Enum";
import { Package } from "../entity/clinic/Package";
import { WorkingDay } from "../entity/clinic/WorkingDay";
import { Schedule } from "../entity/clinic/Schedule";
import { Device } from "../common/entity/Device";
import { EmptyEntityRepository } from "../common/business/basic/EmptyEntityRepository";

export class CommonRepository {

    //-------------------Patient---------------------//
    public static async getActivePatient(id: number, manager: EntityManager = getManager()): Promise<Patient> {
        return manager.createQueryBuilder(Patient, 'p')
        .select(Patient.detail(false, 'p'))
        .where(SqlWhere.get([Cond.equal('id', id)], false, 'p'))
        .getOne()
    }

    public static async getActiveHealthProfile(id: number, manager: EntityManager = getManager()): Promise<Patient> {
        const data = await manager.createQueryBuilder(Patient, 'p')
        .select(Patient.id('p'))
        .addSelect(Allergy.detail(false, 'a'))
        .addSelect(Surgery.detail(false, 's'))
        .addSelect(Medication.detail(false, 'm'))
        .leftJoin('p.allergies', 'a', SqlWhere.get(null, undefined, 'a'))
        .leftJoin('p.surgeries', 's', SqlWhere.get(null, undefined, 's'))
        .leftJoin('p.medications', 'm', SqlWhere.get(null, undefined, 'm'))
        .where(SqlWhere.get([Cond.equal('id', id)], false, 'p'))
        .getOne()
        if (data != null) {
            delete data.id
        }
        return data
    }

    public static async getActivePatientIncludeHealth(id: number, manager: EntityManager = getManager()): Promise<Patient> {
        return manager.createQueryBuilder(Patient, 'p')
        .select(Patient.detail(false, 'p'))
        .addSelect(Allergy.detail(false, 'a'))
        .addSelect(Surgery.detail(false, 's'))
        .addSelect(Medication.detail(false, 'm'))
        .leftJoin('p.allergies', 'a', SqlWhere.get(null, undefined, 'a'))
        .leftJoin('p.surgeries', 's', SqlWhere.get(null, undefined, 's'))
        .leftJoin('p.medications', 'm', SqlWhere.get(null, undefined, 'm'))
        .where(SqlWhere.get([Cond.equal('id', id)], false, 'p'))
        .getOne()
    }

    //-------------------Clinic---------------------//
    public static async getClinicWithCert(id: number, deactivated: boolean| undefined = undefined, manager: EntityManager = getManager()): Promise<Clinic> {
        const includeDeactivated = deactivated == undefined
        return manager
        .createQueryBuilder(Clinic, 'c')
        .select(Clinic.detail(includeDeactivated, 'c'))
        .addSelect(ClinicCert.detail(includeDeactivated, 'cc'))
        .leftJoin('c.certificates', 'cc', SqlWhere.get(null, deactivated, 'cc'))
        .where(SqlWhere.get([Cond.equal('id', id)], deactivated, 'c'))
        .getOne()
    }

    //-------------------Doctor---------------------//
    public static async getDoctorWithCert(id: number, deactivated: boolean| undefined = undefined, manager: EntityManager = getManager()): Promise<Doctor> {
        const includeDeactivated = deactivated == undefined
        return manager
        .createQueryBuilder(Doctor, 'd')
        .select(Doctor.detail(includeDeactivated, 'd'))
        .addSelect(DoctorCert.detail(includeDeactivated, 'c'))
        .leftJoin('d.certificates', 'c', SqlWhere.get(null, deactivated, 'c'))
        .where(SqlWhere.get([Cond.equal('id', id)], deactivated, 'd'))
        .getOne()
    }

    public static async getCountActiveDoctorByClinic(clinicId: number, manager: EntityManager = getManager()): Promise<number> {
        return manager
        .createQueryBuilder(Doctor, 'd')
        .where(SqlWhere.get([Cond.equal('clinicId', clinicId)], false, 'd'))
        .getCount()
    }

    public static async isOnlyOneActiveDoctorInClinic(clinicId: number, manager: EntityManager = getManager()): Promise<boolean> {
        return await manager
        .createQueryBuilder(Doctor, 'd')
        .where(SqlWhere.get([Cond.equal('clinicId', clinicId)], false, 'd'))
        .getCount() == 1
    }

    public static async getListActiveDoctorByClinic(clinicId: number, manager: EntityManager = getManager()): Promise<Doctor[]> {
        return manager
        .createQueryBuilder(Doctor, 'd')
        .select(Doctor.basic(false, 'd'))
        .innerJoin('d.clinic', 'c', SqlWhere.get(null, false, 'c'))
        .where(SqlWhere.get([Cond.equal('clinicId', clinicId)], false, 'd'))
        // .orderBy("d.profile.firstname", "ASC") // TODO Will update in version 3
        .getMany()
    }

    public static async getListActiveDoctorWithClinicByTypeAndSpecialty(type: PackageType, specialty: string, manager: EntityManager = getManager()): Promise<Doctor[]> {
        const conditions: Cond[] = []
        // if (offsetName != null) {
        //     conditions.push(Cond.moreOrEqual("profile.firstname", offsetName))
        // }
        return manager
        .createQueryBuilder(Doctor, 'd')
        .select(Doctor.basic(false, 'd'))
        .addSelect(Clinic.basic(false, 'c'))
        .innerJoin('d.packages', 'p', SqlWhere.get([Cond.equal('specialty', specialty), Cond.equal('type', type)], false, 'p'))
        .innerJoin('d.clinic', 'c', SqlWhere.get(null, false, 'c'))
        .where(SqlWhere.get(conditions, false, 'd'))
        // .addOrderBy("d.profile.firstname", "ASC") // TODO Will update in version 3
        // .take(limit)
        .getMany()
    }

    public static async getActiveDoctorWithCertByClinic(id: number, clinicId: number, manager: EntityManager = getManager()): Promise<Doctor> {
        return manager
        .createQueryBuilder(Doctor, 'd')
        .select(Doctor.detail(false, 'd'))
        .addSelect(DoctorCert.detail(false, 'dc'))
        .innerJoin('d.clinic', 'c', SqlWhere.get(null, false, 'c'))
        .leftJoin('d.certificates', 'dc', SqlWhere.get(null, false, 'dc'))
        .where(SqlWhere.get([Cond.equal('id', id), Cond.equal('clinicId', clinicId)], false, 'd'))
        .getOne()
    }

    public static async getActiveDoctorWithCertAndPackageAndClinic(id: number, type: PackageType, specialty: string, manager: EntityManager = getManager()): Promise<Doctor> {
        return manager
        .createQueryBuilder(Doctor, 'd')
        .select(Doctor.detail(false, 'd'))
        .addSelect(DoctorCert.detail(false, 'dc'))
        .addSelect(Package.detail(false, 'p'))
        .addSelect(Clinic.detail(false, 'c'))
        .addSelect(ClinicCert.detail(false, 'cc'))
        .innerJoin('d.packages', 'p', SqlWhere.get([Cond.equal('specialty', specialty), Cond.equal('type', type)], false, 'p'))
        .leftJoin('d.certificates', 'dc', SqlWhere.get(null, false, 'dc'))
        .innerJoin('d.clinic', 'c', SqlWhere.get(null, false, 'c'))
        .leftJoin('c.certificates', 'cc', SqlWhere.get(null, false, 'cc'))
        .where(SqlWhere.get([Cond.equal('id', id)], false, 'd'))
        .getOne()
    }

    //-------------------Package---------------------//
    public static async getActivePackageWithDoctorAndClinic(id: number, manager: EntityManager = getManager()): Promise<Package> {
        return manager
        .createQueryBuilder(Package, 'p')
        .select(Package.detail(false, 'p'))
        .addSelect(Doctor.detail(false, 'd'))
        .addSelect(Clinic.detail(false, 'c'))
        .innerJoin('p.doctor', 'd', SqlWhere.get(null, false, 'd'))
        .innerJoin('d.clinic', 'c', SqlWhere.get(null, false, 'c'))
        .where(SqlWhere.get([Cond.equal('id', id)], false, 'p'))
        .getOne()
    }

    // NOTE: only get schedule in present or future
    public static async getActivePackageWithScheduleByDoctor(id: number, doctorId: number, from: Date, manager: EntityManager = getManager()): Promise<Package> {
        const fromString = from.dateString()
        return manager
        .createQueryBuilder(Package, 'p')
        .select(Package.detail(false, 'p'))
        .addSelect(Schedule.detail(false, 's'))
        .innerJoin('p.doctor', 'd', SqlWhere.get([Cond.moreOrEqual('id', doctorId)], false, 'd'))
        .leftJoin('p.schedules', 's', SqlWhere.get([Cond.moreOrEqual('duration.to', fromString)], false, 's'))
        .where(SqlWhere.get([Cond.equal('id', id)], false, 'p'))
        .getOne()
    }

    // NOTE: only get schedule and workingday in present or future
    public static async getActivePackageWithScheduleByClinic(id: number, clinicId: number, from: Date, manager: EntityManager = getManager()): Promise<Package> {
        const fromString = from.dateString()
        return manager
        .createQueryBuilder(Package, 'p')
        .select(Package.detail(false, 'p'))
        .addSelect(Schedule.detail(false, 's'))
        .innerJoin('p.doctor', 'd', SqlWhere.get([Cond.moreOrEqual('clinicId', clinicId)], false, 'd'))
        .leftJoin('p.schedules', 's', SqlWhere.get([Cond.moreOrEqual('duration.to', fromString)], false, 's'))
        .where(SqlWhere.get([Cond.equal('id', id)], false, 'p'))
        .getOne()
    }

    //-------------------WorkingDay---------------------//
    public static async getActiveWorkingDayId(packageId: number, dateString: string, manager: EntityManager = getManager()): Promise<number | undefined> {
        const obj = await manager.createQueryBuilder(WorkingDay, 'w')
        .select(WorkingDay.id('w'))
        .where(SqlWhere.get([
            Cond.equal('packageId', packageId),
            Cond.equal('date', dateString)
        ], false, 'w'))
        .getOne()
        if (obj != undefined) {
            return obj.id
        } else {
            return undefined
        }
    }

    // We ignore the timezone in this query, to make sure we get all working day, please query from = 1 day before from and to = 1 day after to and filter to get working time by using WorkingTimeUtils
    public static async getListActiveWorkingDayFromPackage(packageId: number, from: Date, to: Date, manager: EntityManager = getManager()): Promise<WorkingDay[]> {
        return manager
        .createQueryBuilder(WorkingDay, 'w')
        .select(WorkingDay.booking('w'))
        .addSelect(Package.booking('p'))
        .addSelect(Doctor.booking('d'))
        .innerJoin('w.package', 'p', SqlWhere.get([Cond.equal('id', packageId)], false, 'p'))
        .innerJoin('p.doctor', 'd', SqlWhere.get(null, false, 'd'))
        .innerJoin('d.clinic', 'c', SqlWhere.get(null, false, 'c'))
        .where(SqlWhere.get([Cond.moreOrEqual('date', from), Cond.lessOrEqual('date', to)], false, 'w'))
        .getMany()
    }

    // We ignore the timezone in this query, to make sure we get all working day, please query from = 1 day before from and to = 1 day after to and filter to get working time by using WorkingTimeUtils
    public static async getListActiveWorkingDayFromDoctor(doctorId: number, clinicId: number | undefined, from: Date, to: Date, manager: EntityManager = getManager()): Promise<WorkingDay[]> {
        const doctorCondition = [Cond.equal('id', doctorId)]
        if (clinicId != undefined) {
            doctorCondition.push(Cond.equal('clinicId', clinicId))
        }
        return manager
        .createQueryBuilder(WorkingDay, 'w')
        .select(WorkingDay.booking('w'))
        .addSelect(Package.booking('p'))
        .addSelect(Doctor.booking('d'))
        .innerJoin('w.package', 'p', SqlWhere.get(null, false, 'p'))
        .innerJoin('p.doctor', 'd', SqlWhere.get(doctorCondition, false, 'd'))
        .innerJoin('d.clinic', 'c', SqlWhere.get(null, false, 'c'))
        .where(SqlWhere.get([Cond.moreOrEqual('date', from), Cond.lessOrEqual('date', to)], false, 'w'))
        .getMany()
    }

    //-------------------Schedule---------------------//
    // We ignore the timezone in this query, to make sure we get all working day, please query from = 1 day before from and to = 1 day after to and filter to get working time by using WorkingTimeUtils
    public static async getListActiveScheduleFromPackage(packageId: number, from: Date, to: Date, manager: EntityManager = getManager()): Promise<Schedule[]> {
        return manager
        .createQueryBuilder(Schedule, "s")
        .select(Schedule.booking('s'))
        .addSelect(Package.booking('p'))
        .addSelect(Doctor.booking('d'))
        .innerJoin('s.package', 'p', SqlWhere.get([Cond.equal('id', packageId)], false, 'p'))
        .innerJoin('p.doctor', 'd', SqlWhere.get(null, false, 'd'))
        .innerJoin('d.clinic', 'c', SqlWhere.get(null, false, 'c'))
        .where(SqlWhere.get([Cond.moreOrEqual('duration.to', from), Cond.lessOrEqual('duration.from', to)], false, 's'))
        .getMany()
    }

    // We ignore the timezone in this query, to make sure we get all working day, please query from = 1 day before from and to = 1 day after to and filter to get working time by using WorkingTimeUtils
    public static async getListActiveScheduleFromDoctor(doctorId: number, clinicId: number | undefined, from: Date, to: Date, manager: EntityManager = getManager()): Promise<Schedule[]> {
        const doctorCondition = [Cond.equal('id', doctorId)]
        if (clinicId != undefined) {
            doctorCondition.push(Cond.equal('clinicId', clinicId))
        }
        return manager
        .createQueryBuilder(Schedule, "s")
        .select(Schedule.booking('s'))
        .addSelect(Package.booking('p'))
        .addSelect(Doctor.booking('d'))
        .innerJoin('s.package', 'p', SqlWhere.get(null, false, 'p'))
        .innerJoin('p.doctor', 'd', SqlWhere.get(doctorCondition, false, 'd'))
        .innerJoin('d.clinic', 'c', SqlWhere.get(null, false, 'c'))
        .where(SqlWhere.get([Cond.moreOrEqual('duration.to', from), Cond.lessOrEqual('duration.from', to)], false, 's'))
        .getMany()
    }

    //-------------------Device---------------------//
    public static async getDeviceId<T extends Device>(table: ObjectType<T>, topic: AppBundle, accountId: number, manager: EntityManager = getManager()): Promise<number | null> {
        const condition = [
            Cond.equal('topic', topic), 
            Cond.equal('accountId', accountId)
        ]
        const device = await EmptyEntityRepository.get(table, ['id'], condition, manager)
        if (device != null) {
            return device.id
        } else {
            return null
        }
    }

    public static async deleteAllDevices<T extends Device>(table: ObjectType<T>, deviceToken: string, topic: AppBundle, exceptAccountId: number, manager: EntityManager = getManager()): Promise<DeleteResult> {
        const condition = [
            Cond.equal('topic', topic), 
            Cond.equal('token', deviceToken),
            Cond.diff('accountId', exceptAccountId)
        ]
        return EmptyEntityRepository.delete(table, condition, manager)
    }

}