import { PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, VersionColumn } from "typeorm";
import { ScopeEntity, Scope, ScopeNested } from "../../../node/library/decoration/ScopeEntity";
import { validateSync, ValidationError, IsOptional, MaxLength, IsPositive } from "class-validator";
import { Log } from "../../../node/library/log/Log";

export const vID = '__id__'
export const vInsert = '__insert__'
export const vUpdate = '__update__'
export const vPartialUpdate = '__partialUpdate__'

export const sId = '__id__'
export const sDeactivated = '__deactivated__'
export const sBasic = '__basic__'
export const sDetail = '__detail_'
export const sAddress = '__address__'
export const sCommunicate = '__communicate__'
export const sBooking= '__booking__'

export function Select(scope: string | string[]) {
    return Scope(scope)
}

export function SelectNested(clas: Function, scope: string | string[]) {
    return ScopeNested(scope, clas)
}

export abstract class EmptyEntity extends ScopeEntity {

    public static id(alias?: string): string[] {
        return this.select([sId], alias)
    }

    public static basic(includeDeactivated: boolean = false, alias?: string): string[] {
        return this.selectScope(sBasic, true, includeDeactivated, alias)
    }

    public static detail(includeDeactivated: boolean = false, alias?: string): string[] {
        return this.selectScope(sDetail, true, includeDeactivated, alias)
    }

    public static booking(alias?: string): string[] {
        return this.selectScope(sBooking, true, false, alias)
    }

    public static communicating(alias?: string): string[] {
        return this.selectScope(sCommunicate, true, false, alias)
    }

    public static address(alias?: string): string[] {
        return this.selectScope(sAddress, true, false, alias)
    }

    public static selectScope(scope: string, includeId: boolean, includeDeactivated: boolean, alias?: string): string[] {
        let scopes: string[] = [scope]
        if (includeId) {
            scopes.push(sId)
        } 
        if (includeDeactivated) {
            scopes.push(sDeactivated)
        } 
        return this.select(scopes, alias)
    }

    public static select(scope: string | string[], alias?: string): string[] {
        return this.scope(scope, alias)
    }

    private log(errors: ValidationError[]) {
        errors.forEach(error => {
            const errs = error.children
            if (errs != null && errs.length > 0) {
                this.log(errs)
            } else {
                Log.error("Validation", error)
            }
        });
    }

    public validate(): boolean {
        const errors = validateSync(this, {whitelist: true, forbidNonWhitelisted: true})
        if (errors != null && errors.length > 0) {
            this.log(errors)
        }
        return (errors == null || errors.length == 0)
    }

    public validateGroup(groups: string[]): boolean {
        const errors = validateSync(this, {groups: groups, whitelist: true, forbidNonWhitelisted: true})
        if (errors != null && errors.length > 0) {
            this.log(errors)
        }
        return (errors == null || errors.length == 0)
    }

    public validateOptionalGroup(groups: string[]): boolean {
        const errors = validateSync(this, {groups: groups, whitelist: true, forbidNonWhitelisted: true, skipMissingProperties: true})
        if (errors != null && errors.length > 0) {
            this.log(errors)
        }
        return (errors == null || errors.length == 0)
    }

    public validateID(): boolean {
        return this.validateGroup([vID])
    }

    public validateCreate(): boolean {
        return this.validateGroup([vInsert])
    }

    public validateUpdate(): boolean {
        return this.validateGroup([vUpdate])
    }

    public validateUpdateWithID(): boolean {
        return this.validateGroup([vID, vUpdate])
    }

    public validateUpdatePartial(): boolean {
        let success = this.validateOptionalGroup([vPartialUpdate])
        if (success) {
            success = Object.entries(this).length > 0
        }
        return success
    }

    public validateUpdatePartialWithID(): boolean {
        return this.validateOptionalGroup([vID, vPartialUpdate])
    }

}

export abstract class Identifier extends EmptyEntity {

    @PrimaryGeneratedColumn()
    @Select([sId])
    @IsPositive({ groups: [vID] })
    id: number

}

export abstract class Base extends Identifier {

    @CreateDateColumn({select: false})
    createdAt: Date

    @UpdateDateColumn({select: false})
    updatedAt: Date

    @VersionColumn({select: false})
    version: number

    @Column({default: false})
    @Select(sDeactivated)
    deactivated: Boolean

    @Column({type: "varchar", length: 512, nullable: true})
    @IsOptional({groups: [vInsert, vUpdate]})
    @MaxLength(512, {groups: [vInsert, vUpdate]})
    @Select([sDetail])
    description: string

}

export abstract class Organization extends Base {
    
}


