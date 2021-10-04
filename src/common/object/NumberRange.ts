export class NumberRange {

    constructor(public from: number, public to: number) {

    }

    isCollapsed(left: number, right: number): boolean {
        return this.from < right && this.to > left
    }

    isCollapseOther(other: NumberRange): boolean {
        return this.from < other.to && this.to > other.from
    }

    isCollapseOrContinueOther(other: NumberRange): boolean {
        return this.from <= other.to && this.to >= other.from
    }

}