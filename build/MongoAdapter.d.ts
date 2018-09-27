import { IConnectionOptions } from "./Utils";
import { MongoConnection } from "./Connection";
import { MongoCollection } from "./Definitions";
export declare class MongoAdapter extends MongoConnection {
    collections: typeof MongoCollection[];
    constructor(options: IConnectionOptions);
    bootstrap(collections: typeof MongoCollection[]): void;
    initCollection(collection: typeof MongoCollection): void;
}
//# sourceMappingURL=MongoAdapter.d.ts.map