import { Db, ObjectId, Collection, CollectionCreateOptions } from "mongodb";
import { MongoSchema } from "./MongoSchema";

export class MongoSchemaRegistry
{
	static schemas: {[key: string]: MongoSchema} = {};
	static register(name: string, schema: MongoSchema)
	{
		MongoSchemaRegistry.schemas[name] = schema;
	}

	static getSchema(name: string): MongoSchema
	{
		return MongoSchemaRegistry.schemas[name];
	}
};