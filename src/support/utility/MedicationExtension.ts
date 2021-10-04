import { MedicationType, Trilean } from "../../common/object/Enum"
import { Medication } from "../../entity/patient/Medication"

export class MedicationExtension {

    private static defaultMedication(type: MedicationType): Medication {
        const result = new Medication()
        result.name = type
        result.value = Trilean.unknown
        return result
    }

    static defaultMedications(): Medication[] {
        return [
            this.defaultMedication(MedicationType.highBP),
            this.defaultMedication(MedicationType.highCholesterol),
            this.defaultMedication(MedicationType.pregnant),
            this.defaultMedication(MedicationType.cancer)
        ]
    }

}