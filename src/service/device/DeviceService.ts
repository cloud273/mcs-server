import { Result } from "../../common/object/Result";
import { Device } from "../../common/entity/Device";
import { GetType } from "../../../node/library/utility/Function";
import { BaseService } from "../../common/business/BaseService";
import { SsoService } from "../../third-party/sso/SsoService";
import { CommonRepository } from "../../repository/CommonRepository";
import { getManager } from "typeorm";

export class DeviceService {
    
    public static async save(token: string, data: Device): Promise<Result> {
        let action = async (accountId: number): Promise<Result> => {
            let result: Result
            await getManager().transaction(async manager => {
                const table = GetType(data)
                data.accountId = accountId
                const id = await CommonRepository.getDeviceId(table, data.topic, data.accountId, manager)
                if (id != undefined) {
                    data.id = id
                }
                if (data.token == undefined) {
                    data.token = null
                }
                if (data.token != undefined && data.token.length > 0) {
                    CommonRepository.deleteAllDevices(table, data.token, data.topic, accountId, manager)
                }
                result = await BaseService.save(data, manager)
            })
            .catch(error => {
                result = Result.unknown()
            })
            return result
        }
        return SsoService.actionToken(data.ownerTable(), token, action)  
    }

}