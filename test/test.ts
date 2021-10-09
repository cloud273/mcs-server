import { ApiResponse, Api } from "../node/library/http/Api"
import { AppBundle, Language, GenderType, ClinicCertType, DoctorCertType, CurrencyUnit, PackageType, DeviceOS } from "../src/common/object/Enum"
import { Clinic } from "../src/entity/clinic/Clinic"
import { ClinicUser } from "../src/entity/clinic/ClinicUser"
import { Address } from "../src/common/entity/Address"
import { Log } from "../node/library/log/Log"
import { Constant } from "../Constant"
import { Doctor } from "../src/entity/clinic/Doctor"
import { ConfigService } from "../src/service/other/misc/ConfigService"
import { Profile } from "../src/common/entity/Profile"
import { Integer } from "../node/library/utility/Integer"
import { ClinicCert } from "../src/entity/clinic/ClinicCert"
import { DoctorCert } from "../src/entity/clinic/DoctorCert"
import { Package } from "../src/entity/clinic/Package"
import { Price } from "../src/common/entity/Price"
import { Schedule } from "../src/entity/clinic/Schedule"
import { DateRange } from "../src/common/entity/DateRange"
import { TimeRange } from "../src/common/entity/TimeRange"

export class Test {

    public static async test() {
        const Fs = require('fs');
        const Path = require('path');
        const test = JSON.parse(Fs.readFileSync(Path.join(__dirname, './sample.json'), 'utf8'))
        console.log(test)
    }

    public static async createDb() {
        let adminId = await TestAdmin.create('dungnguyen27384@gmail.com', '@0933270384', Language.vi)
        if (adminId == undefined) {
            return
        }
        let adminToken = await TestAdmin.login('dungnguyen27384@gmail.com', '@0933270384')
        if (adminToken == undefined) {
            return
        }
        let doctorCount: number = 0
        for(var i = 0; i < 26; i++) {
            const char = String.fromCharCode(i + 65)
            const name =  `Clinic ${char}` 
            const phone = `+849330000${i+10}`
            const workPhone = `+84180010${i+10}`
            const country = ConfigService.instance.getCountry()[0]
            const countryCode = country.code
            const state = country.state[i%country.state.length]
            const stateCode = state.code
            const city = state.city[i%state.city.length]
            const cityCode = city.code
            const clinicId = await TestAdmin.createClinic(
                adminToken, 
                name, 
                `clinic${char}@mailinator.com`.toLowerCase(), 
                phone,
                workPhone,
                countryCode,
                stateCode,
                cityCode,
                `${i} Street Ward`,
                10,
                10,
                `clinic_${i}.jpg`,
                `Description for ${name}`,
                Language.vi,
                '111111'
            )
            if (clinicId == undefined) {
                return
            }
            const issuerDate = new Date().addSecond(-3600 * 24 * (365 + (Integer.Random(0, 7300))))
            const certName = `${name} working certificate`
            const certId = await TestAdmin.createClinicCert(
                adminToken, 
                clinicId, 
                `1000${i}`, 
                certName, 
                'Ministry of health', 
                issuerDate, 
                undefined, 
                `clinic_cert_${i}.jpg`, 
                ClinicCertType.working, 
                `Description for ${certName}`
                )
            if (certId == undefined) {
                return
            }
            for (var j = 0; j < i%3 + 1; j++) {
                const name =  `Doctor ${char}${i}`
                const gender = (j%2 == 0)? GenderType.male : GenderType.female
                const spec1 = ConfigService.instance.getSpecialty()[0].code
                const spec2 = ConfigService.instance.getSpecialty()[1].code
                const specialties = (j == 0) ? [spec1] : ((j == 1) ? [spec2] : [spec1, spec2])
                const dob = new Date().addSecond(-3600 * 24 * (365 * 35 + (Integer.Random(0, 7300))))
                const startWork = new Date().addSecond(-3600 * 24 * (365 * 5 + (Integer.Random(0, 3650))))
                const desc = `Description for ${name}`
                let doctorId = await TestAdmin.createDoctor(
                    adminToken, 
                    clinicId, 
                    `doctor${char}${j}@mailinator.com`.toLowerCase() , 
                    '111111', 
                    Language.vi, 
                    `doctor_${doctorCount}.jpg`, 
                    name, 
                    '', 
                    gender, 
                    dob, 
                    specialties, 
                    'Dr', 
                    'CEO', 
                    `Biography of ${name}`, 
                    startWork, 
                    '+07:00', desc
                    )
                if (doctorId == undefined) {
                    return
                }
                const issuerDate = new Date().addSecond(-3600 * 24 * (365 + (Integer.Random(0, 7300))))
                const certName = `${name} working certificate`
                const certId = await TestAdmin.createDoctorCert(
                    adminToken, 
                    doctorId, 
                    `1000${i}`, 
                    certName, 
                    'Department of health Sai Gon', 
                    issuerDate, 
                    undefined, 
                    `doctor_cert_${doctorCount}.jpg`, 
                    DoctorCertType.working, 
                    `Description for ${certName}`
                    )
                if (certId == undefined) {
                    return
                }
                for (const specialty of specialties) {
                    const packageId = await TestAdmin.createPackage(
                        adminToken, 
                        doctorId, 
                        specialty, 
                        PackageType.classic, 
                        50000 * Integer.Random(1, 10), 
                        CurrencyUnit.vnd, 
                        300 * Integer.Random(1, 3), 
                        `Description for package`
                        )
                    if (packageId == undefined) {
                        return
                    }
                    const duration = this.dateRange(new Date(), new Date().addSecond (3600 * 24 * 365))
                    const morning = this.timeRange(
                        new Date(2000, 1, 1, Integer.Random(7, 8), 30 * Integer.Random(0, 1), 0, 0), 
                        new Date(2000, 1, 1, Integer.Random(11, 12), 30 * Integer.Random(0, 1), 0, 0) 
                        )
                    const afternoon = this.timeRange(
                        new Date(2000, 1, 1, Integer.Random(13, 14), 30 * Integer.Random(0, 1), 0, 0), 
                        new Date(2000, 1, 1, Integer.Random(16, 17), 30 * Integer.Random(0, 1), 0, 0) 
                        )
                    const evening = this.timeRange(
                        new Date(2000, 1, 1, 18, 30 * Integer.Random(0, 1), 0, 0), 
                        new Date(2000, 1, 1, Integer.Random(20, 21), 30 * Integer.Random(0, 1), 0, 0)
                        )
                    let tRanges: TimeRange[][] = []
                    for (var k = 0; k < 7; k++) {
                        const rand = Integer.Random(0,7)
                        if (rand == 0) {
                            tRanges.push([morning])
                        } else if (rand == 1) {
                            tRanges.push([morning, afternoon])
                        } else if (rand == 2) {
                            tRanges.push([morning, afternoon, evening])
                        } else if (rand == 3) {
                            tRanges.push([afternoon])
                        } else if (rand == 4) {
                            tRanges.push([afternoon, evening])
                        } else if (rand == 5) {
                            tRanges.push([evening])
                        } else {
                            tRanges.push([])
                        } 
                    }
                    const scheduleId = await TestAdmin.createSchedule(
                        adminToken, 
                        packageId, 
                        duration, 
                        tRanges[0], 
                        tRanges[1], 
                        tRanges[2], 
                        tRanges[3], 
                        tRanges[4], 
                        tRanges[5], 
                        tRanges[6], 
                        'Description of schedule'
                        )
                    if (scheduleId == undefined) {
                        return
                    }
                }
                doctorCount++
            }
        }
    }

    private static dateRange(from: Date, to: Date): DateRange {
        const result = new DateRange()
        result.from = from.dateString()
        result.to = to.dateString()
        return result
    }

    private static timeRange(from: Date, to: Date): TimeRange {
        const result = new TimeRange()
        result.from = from.timeString()
        result.to = to.timeString()
        return result
    }

}

class TestAdmin {

    static async create(username: string, password: string, language: Language): Promise<number> {
        const headers = {
            'os': DeviceOS.mac,
            'app': AppBundle.admin + '|1.0.0',
            'fn': Constant.authenticate.fn,
            'ln': Constant.authenticate.ln,
            'bd': Constant.authenticate.bd,
            'ad': Constant.authenticate.ad
        }
        const body = {
            'username': username,
            'password': password,
            'language': language
        }
        const response = await TestRequest.request('/admin', 'post', headers, undefined, body)
        Log.message('TestAdmin create', response)
        return response.data.id
    }

    static async login(username: string, password: string): Promise<string | undefined> {
        const body = {
            'login':  {
                'username': username,
                'password': password
            },
            'device': {
                "info": "iMac",
                "os": DeviceOS.mac,
                "production": true,
                "topic": AppBundle.admin
            }
        }
        const response = await TestRequest.adminRequest('/admin/login', undefined, 'post', undefined, body)
        Log.message('TestAdmin login', response)
        return response.data.token
    }

    static async createClinic(
        token: string, 
        name: string, 
        email: string, 
        phone: string, 
        workPhone: string, 
        country: string, 
        state: string, 
        city: string, 
        line: string, 
        long: number, 
        lait: number, 
        image: string, 
        description: string | undefined, 
        language: Language, 
        password: string
        ): Promise<number> {
        const address = new Address()
        address.country = country
        address.state = state
        address.city = city
        address.line = line
        address.longitude = long
        address.latitude = lait

        const clinic = new Clinic()
        clinic.name = name
        clinic.email = email
        clinic.phone = phone
        clinic.workPhone = workPhone
        clinic.image = image
        clinic.description = description
        clinic.address = address

        const user = new ClinicUser()
        user.username = email
        user.password = password
        user.language = language

        const body = {
            'clinic': clinic,
            'user': user
        }
        const response = await  TestRequest.adminRequest('/admin/clinic', token, 'post', undefined, body)
        Log.message('TestAdmin createClinic', response)
        return response.data.id
    }

    static async createClinicCert(
        token: string, 
        clinicId: number, 
        code: string, 
        name: string, 
        issuer: string, 
        issueDate: Date, 
        expDate: Date | undefined, 
        image: string, 
        type: ClinicCertType, 
        description: string | undefined
        ): Promise<number> {
        const obj = new ClinicCert()
        obj.clinicId = clinicId
        obj.code = code
        obj.name = name
        obj.issuer = issuer
        obj.issueDate = issueDate.dateString()
        obj.expDate = (expDate == undefined) ? undefined : expDate.dateString()
        obj.image = image
        obj.type = type
        obj.description = description
        const body = obj
        const response = await  TestRequest.adminRequest('/admin/clinic-certificate', token, 'post', undefined, body)
        Log.message('TestAdmin createClinicCert', response)
        return response.data.id
    }

    static async createDoctor(
        token: string, 
        clinicId: number, 
        username: string, 
        password: string, 
        language: Language, 
        image: string, 
        firstname: string, 
        lastname: string, 
        gender: GenderType, 
        dob: Date, 
        specialties: string[], 
        title: string, 
        office: string, 
        biography: string, 
        startWork: Date, 
        timezone: string, 
        description: string | undefined
        ): Promise<number> {
        const profile = new Profile()
        profile.firstname = firstname
        profile.lastname = lastname
        profile.gender = gender
        profile.dob = dob.dateString()
        
        const doctor = new Doctor()
        doctor.username = username
        doctor.password = password
        doctor.language = language
        doctor.image = image
        doctor.profile = profile
        doctor.specialties = specialties
        doctor.title = title
        doctor.office = office
        doctor.biography = biography
        doctor.startWork = startWork.dateString()
        doctor.timezone = timezone
        doctor.clinicId = clinicId
        doctor.description = description

        const body = doctor
        const response = await  TestRequest.adminRequest('/admin/doctor', token, 'post', undefined, body)
        Log.message('TestAdmin createDoctor', response)
        return response.data.id
    }

    static async createDoctorCert(
        token: string, 
        doctorId: number, 
        code: string, 
        name: string, 
        issuer: string, 
        issueDate: Date, 
        expDate: Date | undefined, 
        image: string, 
        type: DoctorCertType, 
        description: string | undefined
        ): Promise<number> {
        const obj = new DoctorCert()
        obj.doctorId = doctorId
        obj.code = code
        obj.name = name
        obj.issuer = issuer
        obj.issueDate = issueDate.dateString()
        obj.expDate = (expDate == undefined) ? undefined : expDate.dateString()
        obj.image = image
        obj.type = type
        obj.description = description
        const body = obj
        const response = await  TestRequest.adminRequest('/admin/doctor-certificate', token, 'post', undefined, body)
        Log.message('TestAdmin createDoctorCert', response)
        return response.data.id
    }

    static async createPackage(
        token: string, 
        doctorId: number, 
        specialty: string, 
        type: PackageType, 
        amount: number, 
        currency: CurrencyUnit, 
        visitTime: number, 
        description: string | undefined
        ): Promise<number> {
        const price = new Price()
        price.amount = amount
        price.currency = currency
        const obj = new Package()
        obj.doctorId = doctorId
        obj.specialty = specialty
        obj.type = type
        obj.price = price
        obj.visitTime = visitTime
        obj.description = description
        const body = obj
        const response = await  TestRequest.adminRequest('/admin/package', token, 'post', undefined, body)
        Log.message('TestAdmin createPackage', response)
        return response.data.id
    }

    static async createSchedule(
        token: string, 
        packageId: number, 
        duration: DateRange, 
        monday: TimeRange[], 
        tuesday: TimeRange[], 
        wednesday: TimeRange[], 
        thursday: TimeRange[], 
        friday: TimeRange[], 
        saturday: TimeRange[], 
        sunday: TimeRange[], 
        description: string | undefined
        ): Promise<number> {
        const obj = new Schedule()
        obj.packageId = packageId
        obj.duration = duration
        obj.monday = monday
        obj.tuesday = tuesday
        obj.wednesday = wednesday
        obj.thursday = thursday
        obj.friday = friday
        obj.saturday = saturday
        obj.sunday = sunday
        obj.description = description
        const body = obj
        const response = await  TestRequest.adminRequest('/admin/schedule', token, 'post', undefined, body)
        Log.message('TestAdmin createPackage', response)
        return response.data.id
    }

}

class TestRequest {

    private static host = 'http://localhost:' + Constant.host.port + Constant.api.url

    static async request(endPoint: string, method: string, headers: {} | null, qs: {} | null, body: {} | null) : Promise<ApiResponse> {
        const uri = this.host + endPoint
        return Api.request(uri, method, qs, headers, body)
    }

    static async adminRequest(endPoint: string, token: string | undefined, method: string, qs: {} | null, body: {} | null) : Promise<ApiResponse> {
        const headers = {
            'os': 'ios',
            'app': AppBundle.admin + '|1.0.0'
        }
        if (token != undefined) {
            headers['token'] = token
        }
        return this.request(endPoint, method, headers, qs, body)
    }

}


