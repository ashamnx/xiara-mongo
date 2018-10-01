import { IProperty, MongoSchema } from './MongoSchema';
import { MongoQuery, MongoQueryMulti, MongoQuerySingle } from './Query';
import { AggregationCursor, Collection, CollectionInsertOneOptions, CollStats, FindAndModifyWriteOpResultObject, FindOneAndReplaceOption, ObjectId, ReplaceOneOptions, UpdateWriteOpResult, WriteOpResult } from 'mongodb';
export interface ICollection {
    getSchemaDefinition(): MongoSchema;
}
export declare class MongoCollection implements ICollection {
    _id: ObjectId;
    constructor(data?: any);
    static constructCollection<T>(type: new () => T): T;
    static query<T extends MongoCollection>(query?: Object): MongoQuery<T>;
    static find<T extends MongoCollection>(query?: Object): MongoQueryMulti<T>;
    static findOne<T extends MongoCollection>(query?: Object): MongoQuerySingle<T>;
    static count<T extends MongoCollection>(query?: Object): Promise<number>;
    static findLast<T extends MongoCollection>(query?: Object): MongoQuerySingle<T>;
    static createOne<T extends MongoCollection>(data?: Object): Promise<T>;
    static findOneAndUpdate<T extends MongoCollection>(query?: Object, data?: Object, options?: FindOneAndReplaceOption): Promise<FindAndModifyWriteOpResultObject>;
    static findByIdAndUpdate<T extends MongoCollection>(_id?: Object, data?: Object): Promise<FindAndModifyWriteOpResultObject>;
    static updateOne<T extends MongoCollection>(query?: Object, data?: Object, options?: ReplaceOneOptions): Promise<UpdateWriteOpResult>;
    static update<T extends MongoCollection>(query?: Object, data?: Object, options?: ReplaceOneOptions & {
        multi?: boolean;
    }): Promise<WriteOpResult>;
    static updateMany<T extends MongoCollection>(query?: Object, data?: Object, options?: ReplaceOneOptions & {
        multi?: boolean;
    }): Promise<UpdateWriteOpResult>;
    static remove(query: Object): Promise<WriteOpResult>;
    static removeOne(query: Object): Promise<WriteOpResult>;
    static aggregate<T extends MongoCollection>(pipeline?: any[]): AggregationCursor<T>;
    static getSchema(): MongoSchema;
    static getCollection(): Collection<any>;
    static stats(): Promise<CollStats>;
    private static sanitizeQuery;
    hydrate(data: any): void;
    dehydrate(fields: IProperty[], dropReferences?: boolean): object;
    toMongoStore(): object;
    toObject(): object;
    toJSON(): object;
    getValidatedObject(): object;
    collection(): Collection<any>;
    getSchemaDefinition(): MongoSchema;
    save(options?: any): Promise<any>;
    insert(options?: CollectionInsertOneOptions): Promise<this>;
    update(options?: ReplaceOneOptions): Promise<this>;
    remove(): Promise<any>;
    replace(replaceWith: MongoCollection): Promise<WriteOpResult>;
}
//# sourceMappingURL=MongoCollection.d.ts.map