import { Constant, HostEndpoint } from "../../../../Constant";
import { SupportSpecialties } from "../../../resource/config/SupportSpecialties";
import { SupportReasons } from "../../../resource/config/SupportReasons";
import { SupportCountries } from "../../../resource/config/SupportCountries";

export class ConfigService {

    public static instance = new ConfigService()

    private countries: any[]

    private specialties: any[]

    private reasons: any

    private constructor() {
        this.specialties = SupportSpecialties
        this.specialties.forEach(obj => {
            obj.image = obj.code + ".png"
        })
        this.countries = SupportCountries
        this.reasons = SupportReasons
    }

    public get(): any {
        return {
            'countries': this.countries,
            'specialties': this.specialties,
            'reasons': this.reasons,
            'appointment': {
                'creatable': Constant.appointment.createableEnd,
                'cancelable': Constant.appointment.cancelableEnd,
                'acceptable': Constant.appointment.acceptableEnd,
                'rejectable': Constant.appointment.rejectableEnd,
                'beginable': {
                    'from': Constant.appointment.beginableFrom,
                    'to': Constant.appointment.beginableEnd,
                }, 
                'finishable': Constant.appointment.finishableEnd
            }
        }
    }

    public getSpecialty(): any {
        return this.specialties
    }

    public getReasons(): any {
        return this.reasons
    }

    public getCountry(): any {
        return this.countries
    }

    public existedSpecialty(code: string): boolean {
        const objs = this.specialties
        for (const obj of objs) {
            if (obj.code == code) {
                return true
            }
        }
        return false
    }

    public existedCountry(code: string): boolean {
        const countries = this.countries
        for (const country of countries) {
            if (country.code == code) {
                return true
            }
        }
        return false
    }

    public existedState(code: string): boolean {
        const countries = this.countries
        for (const country of countries) {
            const states = country.state
            for (const state of states) {
                if (state.code == code) {
                    return true
                }
            }
        }
        return false
    }

    public existedCity(code: string): boolean {
        const countries = this.countries
        for (const country of countries) {
            const states = country.state
            for (const state of states) {
                const cities = state.city
                for (const city of cities) {
                    if (city.code == code) {
                        return true
                    }
                }
            }
        }
        return false
    }

    public existedAddress(stateCode: string, cityCode: string): boolean {
        const countries = this.countries
        for (const country of countries) {
            const states = country.state
            for (const state of states) {
                if (state.code == stateCode) {
                    const cities = state.cities
                    for (const city of cities) {
                        if (city.code == cityCode) {
                            return true
                        }
                    }
                    break
                }
            }
        }
        return false
    }

}