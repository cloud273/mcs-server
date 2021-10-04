import { StatusType, UserType } from "../../common/object/Enum"
import { AppointmentRepository } from "../../repository/AppointmentRepository"
import { getManager } from "typeorm"

export class AppointmentService {

    public static async updateStatusActivatedAppointment(id: number, userType: UserType, status: StatusType, note: string): Promise<boolean> {
        let result: boolean
        await getManager().transaction(async manager => {
            result = await AppointmentRepository.updateStatusOfActivatedAppointment(id, userType, status, note, manager)
            if (!result) {
                throw null
            }
        })
        return result
    }

}
