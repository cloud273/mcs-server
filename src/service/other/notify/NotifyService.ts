import { AppointmentRepository } from "../../../repository/AppointmentRepository";
import { Notification } from "../../../resource/config/Notification";
import { NotifyType } from "../../../common/object/Enum";
import { NotifyCenter } from "../../../third-party/message/NotifyCenter";

export class NotifyService {

    static async appointmentCreatedByPatient(id: number) {
        const doctor = await AppointmentRepository.getActiveDoctorCommunication(id)
        const user = await AppointmentRepository.getActiveClinicCommunication(id)
        if (doctor.devices.length > 0) {
            const title = Notification.device.doctor.appointment.createdByPatient[doctor.language]
            for (const device of doctor.devices) {
                NotifyCenter.pushDevice(device, title, NotifyType.appointmentCreated)
            }
        }
        if (user.devices.length > 0) {
            const title = Notification.device.clinic.appointment.createdByPatient[user.language]
            for (const device of user.devices) {
                NotifyCenter.pushDevice(device, title, NotifyType.appointmentCreated)
            }
        }
    }

    static async appointmentCancelledByPatient(id: number, note: string) {
        const doctor = await AppointmentRepository.getActiveDoctorCommunication(id)
        const user = await AppointmentRepository.getActiveClinicCommunication(id)
        if (doctor.devices.length > 0) {
            const title = Notification.device.doctor.appointment.cancelledByPatient[doctor.language]
            for (const device of doctor.devices) {
                NotifyCenter.pushDevice(device, title, NotifyType.appointmentCancelled)
            }
        }
        if (user.devices.length > 0) {
            const title = Notification.device.clinic.appointment.cancelledByPatient[user.language]
            for (const device of user.devices) {
                NotifyCenter.pushDevice(device, title, NotifyType.appointmentCancelled)
            }
        }
    }

    static async appointmentRejectedByDoctor(id: number, note: string) {
        const user = await AppointmentRepository.getActiveClinicCommunication(id)
        const patient = await AppointmentRepository.getActivePatientCommunication(id)
        if (user.devices.length > 0) {
            const title = Notification.device.doctor.appointment.rejectedByClinic[user.language]
            for (const device of user.devices) {
                NotifyCenter.pushDevice(device, title, NotifyType.appointmentRejected)
            }
        }
        if (patient.devices.length > 0) {
            const title = Notification.device.patient.appointment.rejectedByClinic[patient.language]
            for (const device of patient.devices) {
                NotifyCenter.pushDevice(device, title, NotifyType.appointmentRejected)
            }
        }
    }

    static async appointmentRejectedByClinic(id: number, note: string) {
        const doctor = await AppointmentRepository.getActiveDoctorCommunication(id)
        const patient = await AppointmentRepository.getActivePatientCommunication(id)
        if (doctor.devices.length > 0) {
            const title = Notification.device.doctor.appointment.rejectedByClinic[doctor.language]
            for (const device of doctor.devices) {
                NotifyCenter.pushDevice(device, title, NotifyType.appointmentRejected)
            }
        }
        if (patient.devices.length > 0) {
            const title = Notification.device.patient.appointment.rejectedByClinic[patient.language]
            for (const device of patient.devices) {
                NotifyCenter.pushDevice(device, title, NotifyType.appointmentRejected)
            }
        }
    }

    static async appointmentRejectedByAdmin(id: number, note: string) {
        const doctor = await AppointmentRepository.getActiveDoctorCommunication(id)
        const user = await AppointmentRepository.getActiveClinicCommunication(id)
        const patient = await AppointmentRepository.getActivePatientCommunication(id)
        if (doctor.devices.length > 0) {
            const title = Notification.device.doctor.appointment.rejectedBySystem[doctor.language]
            for (const device of doctor.devices) {
                NotifyCenter.pushDevice(device, title, NotifyType.appointmentRejected)
            }
        }
        if (user.devices.length > 0) {
            const title = Notification.device.clinic.appointment.rejectedBySystem[user.language]
            for (const device of user.devices) {
                NotifyCenter.pushDevice(device, title, NotifyType.appointmentCancelled)
            }
        }
        if (patient.devices.length > 0) {
            const title = Notification.device.patient.appointment.rejectedBySystem[patient.language]
            for (const device of patient.devices) {
                NotifyCenter.pushDevice(device, title, NotifyType.appointmentRejected)
            }
        }
    }

    static async appointmentBegunByDoctor(id: number, note: string) {
        const patient = await AppointmentRepository.getActivePatientCommunication(id)
        const user = await AppointmentRepository.getActiveClinicCommunication(id)
        if (user.devices.length > 0) {
            const title = Notification.device.clinic.appointment.begunByDoctor[user.language]
            for (const device of user.devices) {
                NotifyCenter.pushDevice(device, title, NotifyType.appointmentBegun)
            }
        }
        if (patient.devices.length > 0) {
            const title = Notification.device.patient.appointment.begunByDoctor[patient.language]
            for (const device of patient.devices) {
                NotifyCenter.pushDevice(device, title, NotifyType.appointmentBegun)
            }
        }
    }

    static async appointmentFinishedByDoctor(id: number, note: string) {
        const patient = await AppointmentRepository.getActivePatientCommunication(id)
        const user = await AppointmentRepository.getActiveClinicCommunication(id)
        if (user.devices.length > 0) {
            const title = Notification.device.clinic.appointment.finishedByDoctor[user.language]
            for (const device of user.devices) {
                NotifyCenter.pushDevice(device, title, NotifyType.appointmentFinished)
            }
        }
        if (patient.devices.length > 0) {
            const title = Notification.device.patient.appointment.finishedByDoctor[patient.language]
            for (const device of patient.devices) {
                NotifyCenter.pushDevice(device, title, NotifyType.appointmentFinished)
            }
        }
    }

}
