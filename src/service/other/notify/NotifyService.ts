import { AppointmentRepository } from "../../../repository/AppointmentRepository";
import { Notification } from "../../../resource/config/Notification";
import { NotifyType } from "../../../common/object/Enum";
import { NotifyCenter } from "../../../third-party/message/NotifyCenter";

export class NotifyService {

    static async appointmentCreatedByPatient(id: number) {
        const clinic = await AppointmentRepository.getActiveClinicCommunication(id)
        if (clinic.devices.length > 0) {
            const title = Notification.device.clinic.appointment.createdByPatient[clinic.language]
            for (const device of clinic.devices) {
                NotifyCenter.pushDevice(device, title, NotifyType.appointmentCreated)
            }
        }
    }

    static async appointmentCancelledByPatient(id: number, note: string, notifyDoctor: boolean) {
        if (notifyDoctor) {
            const doctor = await AppointmentRepository.getActiveDoctorCommunication(id)
            if (doctor.devices.length > 0) {
                const title = Notification.device.doctor.appointment.cancelledByPatient[doctor.language]
                for (const device of doctor.devices) {
                    NotifyCenter.pushDevice(device, title, NotifyType.appointmentCancelled)
                }
            }
            const clinic = await AppointmentRepository.getActiveClinicCommunication(id)
            if (clinic.devices.length > 0) {
                const title = Notification.device.clinic.appointment.cancelledByPatient[clinic.language]
                for (const device of clinic.devices) {
                    NotifyCenter.pushDevice(device, title, NotifyType.appointmentCancelled)
                }
            }
        }
    }

    static async appointmentAcceptedByClinic(id: number, note: string) {
        const doctor = await AppointmentRepository.getActiveDoctorCommunication(id)
        if (doctor.devices.length > 0) {
            const title = Notification.device.doctor.appointment.acceptedByClinic[doctor.language]
            for (const device of doctor.devices) {
                NotifyCenter.pushDevice(device, title, NotifyType.appointmentAccepted)
            }
        }
        const patient = await AppointmentRepository.getActivePatientCommunication(id)
        if (patient.devices.length > 0) {
            const title = Notification.device.patient.appointment.acceptedByClinic[patient.language]
            for (const device of patient.devices) {
                NotifyCenter.pushDevice(device, title, NotifyType.appointmentAccepted)
            }
        }
    }

    static async appointmentRejectedByClinic(id: number, note: string) {
        const patient = await AppointmentRepository.getActivePatientCommunication(id)
        if (patient.devices.length > 0) {
            const title = Notification.device.patient.appointment.rejectedByClinic[patient.language]
            for (const device of patient.devices) {
                NotifyCenter.pushDevice(device, title, NotifyType.appointmentRejected)
            }
        }
    }

    static async appointmentRejectedByAdmin(id: number, note: string) {
        const doctor = await AppointmentRepository.getActiveDoctorCommunication(id)
        if (doctor.devices.length > 0) {
            const title = Notification.device.doctor.appointment.rejectedBySystem[doctor.language]
            for (const device of doctor.devices) {
                NotifyCenter.pushDevice(device, title, NotifyType.appointmentRejected)
            }
        }
        const clinic = await AppointmentRepository.getActiveClinicCommunication(id)
        if (clinic.devices.length > 0) {
            const title = Notification.device.clinic.appointment.rejectedBySystem[clinic.language]
            for (const device of clinic.devices) {
                NotifyCenter.pushDevice(device, title, NotifyType.appointmentCancelled)
            }
        }
        const patient = await AppointmentRepository.getActivePatientCommunication(id)
        if (patient.devices.length > 0) {
            const title = Notification.device.patient.appointment.rejectedBySystem[patient.language]
            for (const device of patient.devices) {
                NotifyCenter.pushDevice(device, title, NotifyType.appointmentRejected)
            }
        }
    }

    static async appointmentBegunByDoctor(id: number, note: string) {
        const clinic = await AppointmentRepository.getActiveClinicCommunication(id)
        if (clinic.devices.length > 0) {
            const title = Notification.device.clinic.appointment.begunByDoctor[clinic.language]
            for (const device of clinic.devices) {
                NotifyCenter.pushDevice(device, title, NotifyType.appointmentBegun)
            }
        }
        const patient = await AppointmentRepository.getActivePatientCommunication(id)
        if (patient.devices.length > 0) {
            const title = Notification.device.patient.appointment.begunByDoctor[patient.language]
            for (const device of patient.devices) {
                NotifyCenter.pushDevice(device, title, NotifyType.appointmentBegun)
            }
        }
    }

    static async appointmentFinishedByDoctor(id: number, note: string) {
        const clinic = await AppointmentRepository.getActiveClinicCommunication(id)
        if (clinic.devices.length > 0) {
            const title = Notification.device.clinic.appointment.finishedByDoctor[clinic.language]
            for (const device of clinic.devices) {
                NotifyCenter.pushDevice(device, title, NotifyType.appointmentFinished)
            }
        }
        const patient = await AppointmentRepository.getActivePatientCommunication(id)
        if (patient.devices.length > 0) {
            const title = Notification.device.patient.appointment.finishedByDoctor[patient.language]
            for (const device of patient.devices) {
                NotifyCenter.pushDevice(device, title, NotifyType.appointmentFinished)
            }
        }
    }

}
