import { Collection, CollectionCreateOptions, Db } from 'mongodb';
import { SchemaValidationResult } from './Schema';
import { MongoCollection } from './MongoCollection';
export interface IPropertyOptions {
    name?: string;
    required?: boolean;
    unique?: boolean;
    hidden?: boolean;
    index?: -1 | 0 | 1;
    reference?: typeof MongoCollection;
    by?: string;
    autoPopulate?: boolean;
    default?: any;
    type?: any;
}
export interface IPropertyIndex {
    specification: object;
    unique: boolean;
}
export interface IProperty {
    name: string;
    type: any;
    options: IPropertyOptions;
}
export interface IModelOptions {
    indexes?: IPropertyIndex[];
    inherits?: any[];
    log: any;
}
export declare class MongoSchema {
    CollectionSpec: any;
    name: string;
    indexes: IPropertyIndex[];
    fields: IProperty[];
    createOptions: CollectionCreateOptions;
    hooks: any;
    inherits: typeof MongoCollection[];
    protected DB: Db;
    constructor(CollectionSpec: any);
    addField(fieldName: string, fieldType: any, fieldOptions: IPropertyOptions): void;
    getHiddenFields(): any;
    getVisibleFields(): any;
    addIndex(index: IPropertyIndex): void;
    setConnection(db: Db): void;
    findField(name: string): IProperty;
    prepare(): void;
    collection(): Collection<any>;
    createCollection(): void;
    registerHook(hookName: string, callback: any): void;
    callHook(hookName: string, input?: any): any;
    validate(document: object): SchemaValidationResult;
}
//# sourceMappingURL=MongoSchema.d.ts.map