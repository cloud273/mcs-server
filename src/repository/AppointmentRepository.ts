import { getManager, EntityManager } from "typeorm";
import { SqlWhere } from "../support/utility/SqlUtility";
import { Cond } from "../../node/library/sql/Cond";
import { PackageType, StatusType, UserType } from "../common/object/Enum";
import { Appointment } from "../entity/appointment/Appointment";
import { Sql } from "../../node/library/sql/Sql";
import { AppointmentStatus } from "../entity/appointment/AppointmentStatus";
import { Status } from "../common/entity/Status";
import { Patient } from "../entity/patient/Patient";
import { Doctor } from "../entity/clinic/Doctor";
import { ClinicUser } from "../entity/clinic/ClinicUser";
import { PatientDevice } from "../entity/patient/PatientDevice";
import { DoctorDevice } from "../entity/clinic/DoctorDevice";
import { ClinicUserDevice } from "../entity/clinic/ClinicUserDevice";
import { Clinic } from "../entity/clinic/Clinic";
import { Package } from "../entity/clinic/Package";

export class AppointmentRepository {

    //-------------------Booking-------------------//
    public static async getListActiveAppointmentOfDoctor(doctorId: number, from: Date, to: Date, manager: EntityManager = getManager()): Promise<Appointment[]> {
        return manager
        .createQueryBuilder(Appointment, 'a')
        .select(Appointment.booking('a'))
        .innerJoin('a.package', 'p', SqlWhere.get(null, false, 'p'))
        .innerJoin('p.doctor', 'd', SqlWhere.get([Cond.equal('id', doctorId)], false, 'd'))
        .innerJoin('d.clinic', 'c', SqlWhere.get(null, false, 'c'))
        .where(SqlWhere.get([
            Cond.moreOrEqual('begin', from), 
            Cond.less('begin', to),
            Cond.in('status.value', [StatusType.created, StatusType.accepted, StatusType.started, StatusType.finished])
        ], false, 'a'))
        .orderBy("a.begin", "ASC")
        .getMany()
    }

    //-------------------Doctor---------------------//
    public static async getListActiveAppointmentByDoctor(doctorId: number, type: PackageType | undefined, statusTypes: StatusType[] | undefined, from: Date, to: Date, manager: EntityManager = getManager()): Promise<Appointment[]> {
        const packageCondition: Cond[] = []
        if (type != undefined) {
            packageCondition.push(Cond.equal('type', type))
        } 
        const aptCondition = [Cond.moreOrEqual('begin', from), Cond.less('begin', to)]
        if (statusTypes != undefined && statusTypes.length > 0) {
            aptCondition.push(Cond.in('status.value', statusTypes))
        } 
        const list = await manager
        .createQueryBuilder(Appointment, 'a')
        .select(Appointment.basic(false, 'a'))
        .innerJoin('a.package', 'p', SqlWhere.get(packageCondition, false, 'p'))
        .innerJoin('p.doctor', 'd', SqlWhere.get([Cond.equal('id', doctorId)], false, 'd'))
        .where(SqlWhere.get(aptCondition, false, 'a'))
        .orderBy("a.begin", "ASC")
        .getMany()
        for (const item of list) {
            item.restructure()
        }
        return list
    }

    public static async getActiveAppointmentByDoctor(doctorId: number, id: number, manager: EntityManager = getManager()): Promise<Appointment> {
        const obj = await manager
        .createQueryBuilder(Appointment, 'a')
        .select(Appointment.detail(false, 'a'))
        .innerJoin('a.package', 'p', SqlWhere.get(null, false, 'p'))
        .innerJoin('p.doctor', 'd', SqlWhere.get([Cond.equal('id', doctorId)], false, 'd'))
        .where(SqlWhere.get([Cond.equal('id', id)], false, 'a'))
        .getOne()
        if (obj != undefined) {
            obj.restructure()
        }
        return obj
    }

    //-------------------Patient---------------------//
    public static async getListActiveAppointmentByPatient(patientId: number, type: PackageType | undefined, statusTypes: StatusType[] | undefined, from: Date, to: Date, manager: EntityManager = getManager()): Promise<Appointment[]> {
        const packageCondition: Cond[] = []
        if (type != undefined) {
            packageCondition.push(Cond.equal('type', type))
        } 
        const aptCondition = [Cond.moreOrEqual('begin', from), Cond.less('begin', to), Cond.equal('patientId', patientId)]
        if (statusTypes != undefined && statusTypes.length > 0) {
            aptCondition.push(Cond.in('status.value', statusTypes))
        } 
        const list = await manager
        .createQueryBuilder(Appointment, 'a')
        .select(Appointment.basic(false, 'a'))
        .innerJoin('a.package', 'p', SqlWhere.get(packageCondition, undefined, 'p'))
        .where(SqlWhere.get(aptCondition, false, 'a'))
        .orderBy("a.begin", "ASC")
        .getMany()
        for (const item of list) {
            item.restructure()
        }
        return list
    }

    public static async getActiveAppointmentByPatient(patientId: number, id: number, manager: EntityManager = getManager()): Promise<Appointment> {
        const obj = await manager
        .createQueryBuilder(Appointment, 'a')
        .select(Appointment.detail(false, 'a'))
        .where(SqlWhere.get([Cond.equal('id', id), Cond.equal('patientId', patientId)], false, 'a'))
        .getOne()
        if (obj != undefined) {
            obj.restructure()
        }
        return obj
    }

    //-------------------Admin---------------------//
    public static async getListActiveAppointmentByAdmin(type: PackageType | undefined, statusTypes: StatusType[] | undefined, from: Date, to: Date, manager: EntityManager = getManager()): Promise<Appointment[]> {
        const packageCondition: Cond[] = []
        if (type != undefined) {
            packageCondition.push(Cond.equal('type', type))
        } 
        const aptCondition = [Cond.moreOrEqual('begin', from), Cond.less('begin', to)]
        if (statusTypes != undefined && statusTypes.length > 0) {
            aptCondition.push(Cond.in('status.value', statusTypes))
        } 
        const list = await manager
        .createQueryBuilder(Appointment, 'a')
        .select(Appointment.basic(false, 'a'))
        .innerJoin('a.package', 'p', SqlWhere.get(packageCondition, undefined, 'p'))
        .where(SqlWhere.get(aptCondition, false, 'a'))
        .orderBy("a.begin", "ASC")
        .getMany()
        for (const item of list) {
            item.restructure()
        }
        return list
    }

    public static async getActiveAppointmentByAdmin(id: number, manager: EntityManager = getManager()): Promise<Appointment> {
        const obj = await manager
        .createQueryBuilder(Appointment, 'a')
        .select(Appointment.detail(false, 'a'))
        .addSelect(Patient.detail(false, 'pt'))
        .addSelect(Package.detail(false, 'p'))
        .addSelect(Doctor.detail(false, 'd'))
        .addSelect(Clinic.detail(false, 'c'))
        .innerJoin('a.patient', 'pt', SqlWhere.get(null, undefined, 'pt'))
        .innerJoin('a.package', 'p', SqlWhere.get(null, undefined, 'p'))
        .innerJoin('p.doctor', 'd', SqlWhere.get(null, undefined, 'd'))
        .innerJoin('d.clinic', 'c', SqlWhere.get(null, undefined, 'c'))
        .where(SqlWhere.get([Cond.equal('id', id)], false, 'a'))
        .getOne()
        if (obj != undefined) {
            obj.restructure()
        }
        return obj
    }

    //-------------------Clinic---------------------//
    public static async getListActiveAppointmentByClinicAdmin(clinicAdminId: number, type: PackageType | undefined, statusTypes: StatusType[] | undefined, from: Date, to: Date, manager: EntityManager = getManager()): Promise<Appointment[]> {
        const packageCondition: Cond[] = []
        if (type != undefined) {
            packageCondition.push(Cond.equal('type', type))
        } 
        const aptCondition = [Cond.moreOrEqual('begin', from), Cond.less('begin', to)]
        if (statusTypes != undefined && statusTypes.length > 0) {
            aptCondition.push(Cond.in('status.value', statusTypes))
        } 
        const list = await manager
        .createQueryBuilder(Appointment, 'a')
        .select(Appointment.basic(false, 'a'))
        .innerJoin('a.package', 'p', SqlWhere.get(packageCondition, undefined, 'p'))
        .innerJoin('p.doctor', 'd', SqlWhere.get(null, undefined, 'd'))
        .innerJoin('d.clinic', 'c', SqlWhere.get(null, false, 'c'))
        .innerJoin('c.users', 'u', SqlWhere.get([Cond.equal('id', clinicAdminId)], false, 'u'))
        .where(SqlWhere.get(aptCondition, false, 'a'))
        .orderBy("a.begin", "ASC")
        .getMany()
        for (const item of list) {
            item.restructure()
        }
        return list
    }

    public static async getActiveAppointmentByClinicAdmin(clinicAdminId: number, id: number, manager: EntityManager = getManager()): Promise<Appointment> {
        const obj = await manager
        .createQueryBuilder(Appointment, 'a')
        .select(Appointment.detail(false, 'a'))
        .innerJoin('a.package', 'p', SqlWhere.get(null, undefined, 'p'))
        .innerJoin('p.doctor', 'd', SqlWhere.get(null, undefined, 'd'))
        .innerJoin('d.clinic', 'c', SqlWhere.get(null, false, 'c'))
        .innerJoin('c.users', 'u', SqlWhere.get([Cond.equal('id', clinicAdminId)], false, 'u'))
        .where(SqlWhere.get([Cond.equal('id', id)], false, 'a'))
        .getOne()
        if (obj != undefined) {
            obj.restructure()
        }
        return obj
    }

    //-------------------Update Status---------------------//
    public static async updateStatusOfActivatedAppointment(id: number, userType: UserType, status: StatusType, note: string, manager: EntityManager = getManager()): Promise<boolean> {
        const cStatus = Status.create(userType, status, note)
        const updateResult = await manager
        .createQueryBuilder()
        .update(Appointment, {status: cStatus})
        .where(SqlWhere.get([Cond.equal('id', id)], false))
        .execute()
        const aptStatus = AppointmentStatus.create(cStatus, id)
        const insertResult = await manager
        .createQueryBuilder()
        .insert()
        .into(AppointmentStatus)
        .values(aptStatus)
        .execute()
        return Sql.isUpdated(updateResult) && Sql.isInserted(insertResult)
    }

    //-------------------Owner Information---------------------//
    public static async getActivePatientCommunication(appointmentId: number): Promise<Patient | undefined> {
        return getManager()
        .createQueryBuilder(Patient, 'p')
        .select(Patient.communicating('p'))
        .addSelect(PatientDevice.detail(false, 'd'))
        .leftJoin('p.devices', 'd', SqlWhere.get(null, false, 'd'))
        .innerJoin('p.appointments', 'a', SqlWhere.get([Cond.equal('id', appointmentId)], false, 'a'))
        .getOne()
    }

    public static async getActiveDoctorCommunication(appointmentId: number): Promise<Doctor | undefined> {
        return getManager()
        .createQueryBuilder(Doctor, 'd')
        .select(Doctor.communicating('d'))
        .addSelect(DoctorDevice.detail(false, 'de'))
        .leftJoin('d.devices', 'de', SqlWhere.get(null, false, 'de'))
        .innerJoin('d.packages', 'p', SqlWhere.get(null, undefined, 'p'))
        .innerJoin('p.appointments', 'a', SqlWhere.get([Cond.equal('id', appointmentId)], false, 'a'))
        .getOne()
    }

    public static async getActiveClinicCommunication(appointmentId: number): Promise<ClinicUser | undefined> {
        return getManager()
        .createQueryBuilder(ClinicUser, 'u')
        .select(ClinicUser.communicating('u'))
        .addSelect(ClinicUserDevice.detail(false, 'd'))
        .leftJoin('u.devices', 'd', SqlWhere.get(null, false, 'd'))
        .innerJoin('u.clinic', 'c', SqlWhere.get(null, undefined, 'c'))
        .innerJoin('c.doctors', 'do', SqlWhere.get(null, undefined, 'do'))
        .innerJoin('do.packages', 'p', SqlWhere.get(null, undefined, 'p'))
        .innerJoin('p.appointments', 'a', SqlWhere.get([Cond.equal('id', appointmentId)], false, 'a'))
        .getOne()
    }


}