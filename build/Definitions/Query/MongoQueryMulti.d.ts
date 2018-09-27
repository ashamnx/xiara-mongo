import { MongoQuery } from "./MongoQuery";
import { MongoCollection } from "../MongoCollection";
export declare class MongoQueryMulti<T extends MongoCollection> extends MongoQuery<T[]> {
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T[]) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): Promise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): Promise<T[] | TResult>;
    exec(): Promise<T[]>;
    forEach(callback: any, done?: any): void;
}
//# sourceMappingURL=MongoQueryMulti.d.ts.map