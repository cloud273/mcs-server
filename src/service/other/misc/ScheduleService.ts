import { Constant } from "../../../../Constant";

export class ScheduleService {

    static instance = new ScheduleService()

    private started: boolean

    private constructor() {
        
    }

    start() {
        if (!this.started) {
            this.started = true
            setInterval(() => {
                this.loop()
            }, 1000 * Constant.service.loop)
        }
    }

    loop() {
        
    }
    
}