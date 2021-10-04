import { Log } from "../../node/library/log/Log";

import TokenGenerator = require('uuid-token-generator');
import moment = require('moment');

export class Global {
    static Startup() {
        Log.message("Startup global", new Date().string())
    }
}

declare global {
    interface Date {
        string(): string
        dateString(): string
        timeString(): string
        offset(date: Date): number
        second(): number
        addSecond(second: number): Date
        gmtWithZoneString(): string
    }
    interface StringConstructor {
        Random(): string
    }
}

Date.prototype.addSecond = function(second: number): Date {
    return new Date(this.getTime() + second * 1000)
}
Date.prototype.second = function(): number {
    return this.getTime()/1000
}
Date.prototype.offset = function(date: Date): number {
    return (this.getTime() - date.getTime())/1000
}
Date.prototype.string = function(): string {
    return moment(this).format("YYYY-MM-DDTHH:mm:ssZ")
}
Date.prototype.dateString = function(): string {
    return moment(this).format("YYYY-MM-DD")
}
Date.prototype.timeString = function(): string {
    return moment(this).format("HH:mm:ss")
}
Date.prototype.gmtWithZoneString = function(): string {
    return moment.utc(this).format("YYYY-MM-DDTHH:mm:ssZ")
}
String.Random = function(): string {
    const tokgen = new TokenGenerator(512, TokenGenerator.BASE62)
    return tokgen.generate()
}
