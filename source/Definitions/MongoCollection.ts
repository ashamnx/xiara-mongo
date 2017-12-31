import { MongoAdapter } from "../MongoAdapter";
import { MongoSchema, IProperty } from "./MongoSchema";
import { Property } from "./Decorators";
import { MongoQuery, MongoQueryMulti, MongoQuerySingle } from "./Query";
import { Db, Collection, Cursor, AggregationCursor, ObjectId, WriteOpResult, InsertOneWriteOpResult, UpdateWriteOpResult, CollectionInsertOneOptions, ReplaceOneOptions } from "mongodb";
//import { IFindQuery } "./FindQuery";
import { MongoSchemaRegistry } from "./MongoSchemaRegistry";
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
		for(var field of schema.fields)
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
		var rawData = {};
		for(var field of fields)
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

	static query<T extends MongoCollection>(query?: Object): MongoQuery< T >
	{
		return new MongoQuery<T>(this, query);
	}

	static find<T extends MongoCollection>(query?: Object): MongoQueryMulti< T >
	{
		return new MongoQueryMulti<T>(this, query);
	}
	
	static findOne<T extends MongoCollection>(query?: Object): MongoQuerySingle< T >
	{
		return new MongoQuerySingle<T>(this, query);
	}

	static createOne<T extends MongoCollection>(data?: Object): Promise< T >
	{
		var instance: T = this.constructCollection<T>(<any>this);
		instance.hydrate(data);
		return instance.save();
	}

	static updateOne<T extends MongoCollection>(query?: Object, data?: Object, options: ReplaceOneOptions = undefined): Promise<UpdateWriteOpResult>
	{
		var collection = this.getSchema().collection();
		return collection.updateOne(query, data, options);
	}

	static update<T extends MongoCollection>(query?: Object, data?: Object, options: ReplaceOneOptions & { multi?: boolean } = undefined): Promise<WriteOpResult>
	{
		var collection = this.getSchema().collection();
		return collection.update(query, data, options);
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
		var collection = schema.collection();
		var data = this.toObject();
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
		var collection = schema.collection();
		var data = this.toObject();
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
};