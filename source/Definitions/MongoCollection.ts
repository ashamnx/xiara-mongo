import { MongoAdapter } from "../MongoAdapter";
import { MongoSchema, IProperty } from "./MongoSchema";
import { Property } from "./Decorators";
import { MongoQuery, MongoQueryMulti, MongoQuerySingle } from "./Query";
import { Db, Collection, Cursor, AggregationCursor, ObjectId, WriteOpResult, InsertOneWriteOpResult, UpdateWriteOpResult, CollectionInsertOneOptions, ReplaceOneOptions, DeleteWriteOpResultObject, ReplaceWriteOpResult, InsertWriteOpResult, CollStats, FindOneAndReplaceOption, FindAndModifyWriteOpResultObject } from "mongodb";
//import { IFindQuery } "./FindQuery";
import { MongoSchemaRegistry } from "./MongoSchemaRegistry";
import { ObjectID } from "bson";
export interface ICollection
{
	getSchemaDefinition(): MongoSchema;
};

export class MongoCollection implements ICollection
{

	@Property()
	_id: ObjectId;
	//_version: number;

	constructor(data: any = null)
	{
		if(data != null)
		{
			this.hydrate(data);
		}
	}

	static constructCollection<T>(type: new () => T): T
	{
		return new type();
	}

	hydrate(data: any)
	{
		if(!data)
			return;
			
		let schema = this.getSchemaDefinition();
		for(let field of schema.fields)
		{
			if(field.options)
			{
				if(data[field.name] === undefined && field.options.default !== undefined)
				{
					if(field.options.default.name == "Date")
					{
						this[field.name] = new field.options.default();
						continue;
					}

					if(typeof field.options.default === "function")
					{
						this[field.name] = field.options.default();
						continue;
					}
					this[field.name] = field.options.default;
					continue;
				}

				if(field.options.reference && typeof data[field.name] === "object")
				{
					let referencedCollection = new field.options.reference();
					referencedCollection.hydrate(data[field.name]);
					this[field.name] = referencedCollection;
					continue;
				}
			}
			this[field.name] = data[field.name];
		}
	}

	dehydrate(fields: IProperty[]): object
	{
		let rawData = {};
		for(let field of fields)
		{
			if(field.options.reference)
			{
				if(this[field.name] === undefined)
					continue;	

				rawData[field.name] = this[field.name][field.options.by || "_id"];
				continue;
			}

			if(this[field.name] === undefined && field.options.default !== undefined)
			{
				if(field.options.default.name == "Date")
				{
					rawData[field.name] = new field.options.default();
					continue;
				}

				if(typeof field.options.default === "function")
				{
					rawData[field.name] = field.options.default();
					continue;
				}else{
					rawData[field.name] = field.options.default;
				}
			}else{
				rawData[field.name] = this[field.name];
			}
			
		}
		return rawData;
	}

	toObject(): object
	{
		let schema = this.getSchemaDefinition();
		return this.dehydrate(schema.fields);
	}

	// Same as dehydrate but drops the hidden fields
	toJSON()
	{
		let schema = this.getSchemaDefinition();
		return this.dehydrate(schema.getVisibleFields());
	}

	getValidatedObject(): object
	{
		let schema = this.getSchemaDefinition();
		let collection = schema.collection();
		let data = this.toObject();
		let validationResult = schema.validate(data);
		if(!validationResult)
		{
			return null;
		}
		return data;
	}

	private static sanitizeQuery(query: any)
	{
		if(query && query._id && typeof query._id === "string")
		{
			query._id = new ObjectID(query._id);
		}
	}

	static query<T extends MongoCollection>(query?: Object): MongoQuery< T >
	{
		MongoCollection.sanitizeQuery(query);
		return new MongoQuery<T>(this, query);
	}

	static find<T extends MongoCollection>(query?: Object): MongoQueryMulti< T >
	{
		MongoCollection.sanitizeQuery(query);
		return new MongoQueryMulti<T>(this, query);
	}
	
	static findOne<T extends MongoCollection>(query?: Object): MongoQuerySingle< T >
	{
		MongoCollection.sanitizeQuery(query);
		return new MongoQuerySingle<T>(this, query);
	}

	static createOne<T extends MongoCollection>(data?: Object): Promise< T >
	{
		let instance: T = this.constructCollection<T>(<any>this);
		instance.hydrate(data);
		return instance.save();
	}

	static findOneAndUpdate<T extends MongoCollection>(query?: Object, data?: Object, options: FindOneAndReplaceOption = undefined): Promise<FindAndModifyWriteOpResultObject>
	{
		MongoCollection.sanitizeQuery(query);
		let collection = this.getSchema().collection();
		return collection.findOneAndUpdate(query, {
			$set: data
		}, options).then( result => {
			if(options && options.returnOriginal)
			{
				return result.value;
			}
			return result;
		}).catch( error => {
			return error;
		})
	}

	static updateOne<T extends MongoCollection>(query?: Object, data?: Object, options: ReplaceOneOptions = undefined): Promise<UpdateWriteOpResult>
	{
		MongoCollection.sanitizeQuery(query);
		let collection = this.getSchema().collection();
		return collection.updateOne(query, {
			$set: data
		}, options);
	}

	static update<T extends MongoCollection>(query?: Object, data?: Object, options: ReplaceOneOptions & { multi?: boolean } = undefined): Promise<WriteOpResult>
	{
		MongoCollection.sanitizeQuery(query);
		let collection = this.getSchema().collection();
		return collection.update(query, {
			$set: data
		}, options);
	}

	static remove(query: Object): Promise<WriteOpResult>
	{
		MongoCollection.sanitizeQuery(query);
		let  collection = this.getSchema().collection();
		return collection.remove(query);
	}

	static removeOne(query: Object): Promise<WriteOpResult>
	{
		MongoCollection.sanitizeQuery(query);
		let  collection = this.getSchema().collection();
		return collection.remove(query, {single: true});
	}

	static aggregate<T extends MongoCollection>(pipeline:any[] = []): AggregationCursor<T>
	{
		return this.getCollection().aggregate(pipeline);
	}

	static getSchema(): MongoSchema
	{
		return MongoSchemaRegistry.getSchema(this.name);
	}

	static getCollection(): Collection<any>
	{
		return this.getSchema().collection();
	}

	static stats(): Promise<CollStats>
	{
		return this.getCollection().stats();
	}

	collection(): Collection<any>
	{
		return this.getSchemaDefinition().collection();
	}

	getSchemaDefinition(): MongoSchema
	{
		return MongoSchemaRegistry.getSchema(this.constructor.name);
		//return (<any>this.constructor).SchemaDefinition;
	}

	save(options: any = {}): Promise<any>
	{
		if(!this._id)
		{
			return this.insert(options);
		}else{
			return this.update(options);
		}
	}

	insert(options: CollectionInsertOneOptions = undefined): Promise<this>
	{
		let schema = this.getSchemaDefinition();
		let collection = schema.collection();
		let data = this.toObject();
		let validationResult = schema.validate(data);
		if(!validationResult)
		{
			return collection.insertOne(data, options).then( result => {
				this._id = result.insertedId; // Assign inserted _id
				return this;
			});
		}
		return Promise.reject(validationResult);
	}
	
	update(options: ReplaceOneOptions = undefined): Promise<this>
	{
		let schema = this.getSchemaDefinition();
		let collection = schema.collection();
		let data = this.toObject();
		let validationResult = schema.validate(data);
		if(!validationResult)
		{
			return collection.updateOne({
				_id: this._id,
			}, {
				$set: data
			}, options).then( result => {
				return this;
			});
		}
		return Promise.reject(validationResult);
	}
	
	remove(): Promise<any>
	{
		if(!this._id)
		{
			return Promise.reject("_id is not defined");
		}

		return this.collection().deleteOne({
			_id: this._id
		});
	}

	replace(replaceWith: MongoCollection): Promise<WriteOpResult>
	{
		let schema = replaceWith.getSchemaDefinition();
		let collection = schema.collection();
		let data = replaceWith.toObject();
		let validationResult = schema.validate(data);
		if(!validationResult)
		{
			return this.collection().replaceOne({ _id: this._id }, data);
		}
		return Promise.reject(validationResult);
	}
};