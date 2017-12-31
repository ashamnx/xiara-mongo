import { AggregationCursor, CollectionAggregationOptions, MongoCallback } from "mongodb";
import { MongoCollection } from "../MongoCollection";
export declare class MongoQuery<T> {
    collection: typeof MongoCollection;
    query: Object;
    isLean: boolean;
    pipeline: any[];
    populatedFields: any[];
    constructor(collection: typeof MongoCollection, query?: Object);
    lean(isLean?: boolean): this;
    where(clause?: object): this;
    gt(clause?: object): this;
    gte(clause?: object): this;
    lt(clause?: object): this;
    lte(clause?: object): this;
    skip(skip?: number): this;
    limit(limit?: number): this;
    populate(...fields: string[]): this;
    cast<U>(): MongoQuery<U>;
    aggregate(pipeline?: any[], options?: CollectionAggregationOptions, callback?: MongoCallback<any>): AggregationCursor<any>;
    cursor(cursorOptions?: {
        batchSize: number;
    }, explain?: boolean): AggregationCursor<any>;
}
