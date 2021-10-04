import { Result } from "../../common/object/Result";
import { ObjectType } from "typeorm";
import { Patient } from "../../entity/patient/Patient";
import { SsoService } from "../../third-party/sso/SsoService";
import { Allergy } from "../../entity/patient/Allergy";
import { Surgery } from "../../entity/patient/Surgery";
import { Medication } from "../../entity/patient/Medication";
import { OwnerBaseService } from "../../common/business/OwnerBaseService";
import { GetType } from "../../../node/library/utility/Function";
import { CommonRepository } from "../../repository/CommonRepository";
import { BaseService } from "../../common/business/BaseService";

export class PatientHealthService {

    static async get(token: string): Promise<Result> {
        let action = async (accountId: number): Promise<Result> => {
            const obj = await CommonRepository.getActiveHealthProfile(accountId)
            if (obj == undefined) {
                return Result.notFound()
            } else {
                return Result.success(obj)
            }
            
        }
        return SsoService.actionToken(Patient, token, action)
    }

    static async save(token: string, data: Allergy | Surgery | Medication | Allergy[] | Surgery[] | Medication[]): Promise<Result> {
        let action = async (accountId: number): Promise<Result> => {
            if (Array.isArray(data)) {
                data.forEach(element => {
                    element.patientId = accountId
                });
            } else {
                data.patientId = accountId
            }
            return BaseService.save(data)
        }
        return SsoService.actionToken(Patient, token, action)
    }

    static async insert(token: string, data: Allergy | Surgery | Medication): Promise<Result> {
        let action = async (accountId: number): Promise<Result> => {
            data.patientId = accountId
            return BaseService.insert(GetType(data), data)
        }
        return SsoService.actionToken(Patient, token, action)
    }

    static async update(token: string, data: Allergy | Surgery | Medication): Promise<Result> {
        let action = async (accountId: number): Promise<Result> => {
            const id = data.id
            delete data.id
            return OwnerBaseService.update(GetType(data), data, id, 'patientId', accountId, false)
        }
        return SsoService.actionToken(Patient, token, action)
    }
    
    static async delete(table: ObjectType<Allergy | Surgery | Medication>, token: string, id: number): Promise<Result> {
        let action = async (accountId: number): Promise<Result> => {
            return OwnerBaseService.delete(table, id, "patientId", accountId, false)
        }
        return SsoService.actionToken(Patient, token, action)
    }

}