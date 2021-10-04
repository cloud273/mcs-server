import { BaseAccountCache } from "./BaseAccountCache"
import { Patient } from "../../../entity/patient/Patient"
import { Doctor } from "../../../entity/clinic/Doctor"
import { BaseAccount } from "../../account/BaseAccount"
import { ObjectType } from "typeorm"
import { Log } from "../../../../node/library/log/Log"
import { Admin } from "../../../entity/admin/Admin"
import { ClinicUser } from "../../../entity/clinic/ClinicUser"

export class AccountCacheService {

    public static instance = new AccountCacheService()

    private patientCache: BaseAccountCache<Patient>
    private doctorCache: BaseAccountCache<Doctor>
    private clinicUserCache: BaseAccountCache<ClinicUser>
    private adminCache: BaseAccountCache<Admin>

    private constructor() {
        this.patientCache = new BaseAccountCache(Patient, undefined)
        this.doctorCache = new BaseAccountCache(Doctor, 'clinic')
        this.clinicUserCache = new BaseAccountCache(ClinicUser, 'clinic')
        this.adminCache = new BaseAccountCache(Admin, undefined)
    }

    public initialize() {
        this.patientCache.initialize()
        this.doctorCache.initialize()
        this.clinicUserCache.initialize()
        this.adminCache.initialize()
    }

    public async get<T extends BaseAccount>(table: ObjectType<T>, sso: string): Promise<number | null> {
        if (table == Patient) {
            return this.patientCache.get(sso)
        } else if (table == Doctor) {
            return this.doctorCache.get(sso)
        } else if (table == ClinicUser) {
            return this.clinicUserCache.get(sso)
        } else if (table == Admin) {
            return this.adminCache.get(sso)
        } else {
            Log.error("AccountCacheService get unsupport", table.name)
            return null
        }
    }

    public remove<T extends BaseAccount>(table: ObjectType<T>, id: number) {
        if (table == null) {
            Log.error("AccountCacheService setId null table value", id)
        } else {
            if (table == Patient) {
                return this.patientCache.remove(id)
            } else if (table == Doctor) {
                return this.doctorCache.remove(id)
            } else if (table == ClinicUser) {
                return this.clinicUserCache.remove(id)
            } else if (table == Admin) {
                return this.adminCache.remove(id)
            } else {
                Log.error("AccountCacheService set unsupport", table.name)
            }
        }
    }

    public clearClinicCache() {
        this.doctorCache.initialize()
        this.clinicUserCache.initialize()
    }

}