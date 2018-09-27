import { MongoSchema } from "./MongoSchema";
export declare class MongoSchemaRegistry {
    static schemas: {
        [key: string]: MongoSchema;
    };
    static register(name: string, schema: MongoSchema): void;
    static getSchema(name: string): MongoSchema;
}
//# sourceMappingURL=MongoSchemaRegistry.d.ts.map