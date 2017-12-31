import { MongoSchema, IProperty } from "./MongoSchema";
import { MongoQuery, MongoQueryMulti, MongoQuerySingle } from "./Query";
import { Collection, AggregationCursor, ObjectId, WriteOpResult, UpdateWriteOpResult, CollectionInsertOneOptions, ReplaceOneOptions } from "mongodb";
export interface ICollection {
    getSchemaDefinition(): MongoSchema;
}
export declare class MongoCollection implements ICollection {
    _id: ObjectId;
    constructor(data?: any);
    static constructCollection<T>(type: new () => T): T;
    hydrate(data: any): void;
    dehydrate(fields: IProperty[]): object;
    toObject(): object;
    toJSON(): object;
    static query<T extends MongoCollection>(query?: Object): MongoQuery<T>;
    static find<T extends MongoCollection>(query?: Object): MongoQueryMulti<T>;
    static findOne<T extends MongoCollection>(query?: Object): MongoQuerySingle<T>;
    static createOne<T extends MongoCollection>(data?: Object): Promise<T>;
    static updateOne<T extends MongoCollection>(query?: Object, data?: Object, options?: ReplaceOneOptions): Promise<UpdateWriteOpResult>;
    static update<T extends MongoCollection>(query?: Object, data?: Object, options?: ReplaceOneOptions & {
        multi?: boolean;
    }): Promise<WriteOpResult>;
    static aggregate<T extends MongoCollection>(pipeline?: any[]): AggregationCursor<T>;
    static getSchema(): MongoSchema;
    static getCollection(): Collection<any>;
    collection(): Collection<any>;
    getSchemaDefinition(): MongoSchema;
    save(options?: any): Promise<any>;
    insert(options?: CollectionInsertOneOptions): Promise<this>;
    update(options?: ReplaceOneOptions): Promise<this>;
    remove(): Promise<any>;
}
