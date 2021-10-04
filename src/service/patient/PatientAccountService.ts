import { Result, StatusCode } from "../../common/object/Result";
import { Patient } from "../../entity/patient/Patient";
import { SsoService } from "../../third-party/sso/SsoService";
import { AccountCodeService } from "../other/misc/AccountCodeService";
import { NotifyCenter } from "../../third-party/message/NotifyCenter";
import { Language, NotifyType, MessageType } from "../../common/object/Enum";
import { Notification } from "../../resource/config/Notification";
import { BaseService } from "../../common/business/BaseService";
import { AccountCacheService } from "../other/cache/AccountCacheService";
import { BaseRepository } from "../../common/business/basic/BaseRepository";
import { AppValidator } from "../../support/validator/AppValidator";
import { MedicationExtension } from "../../support/utility/MedicationExtension";
import { CommonRepository } from "../../repository/CommonRepository";

export class PatientAccountService {

    static async get(token: string): Promise<Result> {
        let action = async (accountId: number): Promise<Result> => {
            const obj = await CommonRepository.getActivePatientIncludeHealth(accountId)
            if (obj == undefined) {
                return Result.forbidden()
            } else {
                return Result.success(obj)
            }
            
        }
        return SsoService.actionToken(Patient, token, action)
    }

    static async save(token: string, data: Patient): Promise<Result> {
        let action = async (sso: string): Promise<Result> => {
            let result: Result
            if (sso == data.username) {
                data.sso = sso
                data.medications = MedicationExtension.defaultMedications()
                result = await BaseService.save(data)
            } else {
                result = Result.init(StatusCode.unAuthorized)
            }
            return result
        }
        return SsoService.ssoActionToken(Patient, token, action)
    }

    static async update(token: string, data: Patient): Promise<Result> {
        let action = async (accountId: number): Promise<Result> => {
            return BaseService.update(Patient, data, accountId, false)
        }
        return SsoService.actionToken(Patient, token, action)
    }

    private static updateUsernameIdentifier(id: number, username: string): string {
        return id + '\n' + username + '\n' + "updateUsername"
    }

    static async updateUsernameRequest(token: string, password: string, username: string, language: Language): Promise<Result> {
        let action = async (accountId: number): Promise<Result> => {
            let result: Result
            if (await BaseRepository.isExisted(Patient, 'username', username)) {
                result = Result.existed()
            } else {
                const code = AccountCodeService.update.generate(Patient, this.updateUsernameIdentifier(accountId, username))
                if (AppValidator.isEmail(username)) {
                    const subject = Notification.email.update.subject[language]
                    const message = Notification.email.update.message[language] + code
                    NotifyCenter.sendEmail(username, subject, message, NotifyType.updateUsernameRequest) 
                    result = Result.success({
                        code: MessageType.email,
                        sample: code
                    })
                } else {
                    const message = Notification.sms.update[language] + code
                    NotifyCenter.sendSms(username, message, NotifyType.updateUsernameRequest) 
                    result = Result.success({
                        code: MessageType.sms,
                        sample: code
                    })
                }
                
            }
            return result
        }
        return SsoService.actionTokenPassword(Patient, token, password, action)
    }

    static async updateUsername(token: string, username: string, code: string): Promise<Result> {
        let action = async (accountId: number): Promise<Result> => {
            let result: Result
            if (AccountCodeService.update.verify(Patient, this.updateUsernameIdentifier(accountId, username), code, false)) {
                const patient = await BaseRepository.getById(Patient, ['username', 'sso'], accountId, false)
                if (patient != null) {
                    result = await BaseService.update(Patient, {'username': username, 'sso': username}, accountId, false)
                    if (result.isUpdated) {
                        const response = await SsoService.adminUpdateAccountUsername(Patient, patient.username, username)
                        if (response.code == 200) {
                            AccountCacheService.instance.remove(Patient, accountId)
                        } else {
                            await BaseService.update(Patient, patient, accountId, false)
                            result = Result.initApiResponse(response)
                        }
                    }
                } else {
                    result = Result.unknown()
                }
            } else {
                result = Result.notFound()
            }
            return result
        }
        return SsoService.actionToken(Patient, token, action)
    }

}