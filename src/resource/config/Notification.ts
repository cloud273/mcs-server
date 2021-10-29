'use strict';

export const Notification = {
    email: {
        update: {
            subject: {
                "en": "Update email",
                "vi": "Cập nhật email"
            },
            message: {
                "en": "Your activation code is ",
                "vi": "Mã cập nhật của bạn là "
            }
        }
    },
    sms: {
        update: {
            "en": "Your activation code is ",
            "vi": "Ma cap nhat cua ban la "
        }
    },
    device: {
        clinic: {
            appointment: {
                createdByPatient: {
                    "en": "New appointment",
                    "vi": "Cuộc hẹn mới"
                },
                cancelledByPatient: {
                    "en": "Appointment cancelled by patient",
                    "vi": "Cuộc hẹn bị huỷ bởi bệnh nhân"
                },
                rejectedBySystem: {
                    "en": "Appointment rejected by system",
                    "vi": "Cuộc hẹn bị huỷ bởi hệ thống"
                },
                begunByDoctor: {
                    "en": "Appointment is begun",
                    "vi": "Cuộc hẹn được bắt đầu"
                },
                finishedByDoctor: {
                    "en": "Appointment is finished",
                    "vi": "Cuộc hẹn đã hoàn tất"
                }
            }
        },
        doctor: {
            appointment: {
                createdByPatient: {
                    "en": "New appointment",
                    "vi": "Cuộc hẹn mới"
                },
                cancelledByPatient: {
                    "en": "Appointment cancelled by patient",
                    "vi": "Cuộc hẹn bị huỷ bởi bệnh nhân"
                },
                acceptedByClinic: {
                    "en": "Appointment accepted by clinic",
                    "vi": "Cuộc hẹn được chấp nhận bởi phòng khám"
                },
                rejectedBySystem: {
                    "en": "Appointment rejected by system",
                    "vi": "Cuộc hẹn bị huỷ bởi hệ thống"
                },
                rejectedByClinic: {
                    "en": "Appointment rejected by clinic",
                    "vi": "Cuộc hẹn bị huỷ bởi phòng khám"
                }
            }
        },
        patient: {
            appointment: {
                acceptedByClinic: {
                    "en": "Appointment accepted by clinic",
                    "vi": "Cuộc hẹn được chấp nhận bởi phòng khám"
                },
                rejectedBySystem: {
                    "en": "Appointment rejected by system",
                    "vi": "Cuộc hẹn bị huỷ bởi hệ thống"
                },
                rejectedByClinic: {
                    "en": "Appointment rejected by clinic",
                    "vi": "Cuộc hẹn bị huỷ bởi phòng khám"
                },
                begunByDoctor: {
                    "en": "Appointment is begun",
                    "vi": "Cuộc hẹn được bắt đầu"
                },
                finishedByDoctor: {
                    "en": "Appointment is finished",
                    "vi": "Cuộc hẹn đã hoàn tất"
                }  
            }
        }
    }
}