import { Db, ObjectId, Collection, CollectionCreateOptions } from "mongodb";
import { SchemaValidator, SchemaValidationResult } from "./Schema";
import { MongoCollection, ICollection } from "./MongoCollection";

export interface IPropertyOptions
{
	name?: string; // Name of the property
	required?: boolean; // Is the property required?
	unique?: boolean; // Is the field unique?
	hidden?: boolean; // Should the field visible when converted toJSON?
	index?: -1 | 0 | 1; // Is the field indexed?
	reference?: typeof MongoCollection; // Populate this field with another field (ObjectId)
	by?: string; // Reference from the other collection by this field
	autoPopulate?: boolean;
	default?: any; // default value
	type?: any; // Type of the field (Override)
};

export interface IPropertyIndex
{
	specification: object;
	unique: boolean,
};


export interface IProperty
{
	name: string;
	type: any;
	options: IPropertyOptions;
};

export interface IModelOptions
{
	indexes?: IPropertyIndex[];
	inherits?: any[]
}

export class MongoSchema
{
	public name: string;
	public indexes: IPropertyIndex[] = [];
	public fields: IProperty[] = [];
	protected  DB: Db;
	public createOptions: CollectionCreateOptions;
	public hooks: any = {};
	public inherits: typeof MongoCollection[] = [];

	constructor(public CollectionSpec: any)
	{
	//	this.addField("_id", ObjectId, {});

		// this.addField("_version", Number, {
		// 	default: 0,
		// });
	}

	addField(fieldName: string, fieldType: any, fieldOptions: IPropertyOptions)
	{
		if(fieldOptions.index !== undefined || fieldOptions.unique !== undefined )
		{
			var index: IPropertyIndex = {
				specification: {},
				unique: fieldOptions.unique,
			};
			index.specification[fieldName] = fieldOptions.index || 1;
			this.addIndex(index);
		}

		if(fieldOptions.type !== undefined)
		{
			fieldType = fieldOptions.type;
		}

		this.fields.push({
			name: fieldName,
			type: fieldType.name,
			options: fieldOptions,
		});
	}

	getHiddenFields()
	{
		return this.callHook("fields:hidden", this.fields.filter( field => field.options.hidden));
	}

	getVisibleFields()
	{
		return this.callHook("fields:visible", this.fields.filter( field => !field.options.hidden ));
	}

	addIndex(index: IPropertyIndex)
	{
		this.indexes.push(index);
	}

	setConnection(db: Db)
	{
		this.DB = db;
		this.callHook("db:connected");
	}

	findField(name: string)
	{
		return this.fields.find( field => {
			if(field.name == name)
				return true;
			return false;
		});
	}

	prepare()
	{
		
		for(let inherited of this.inherits)
		{
			let inheritedSchema:MongoSchema = inherited.getSchema();
			for(let inheritedField of inheritedSchema.fields)
			{
				// Skip fields. We allow overrides this way?
				if(this.findField(inheritedField.name))
					continue;

				this.fields.unshift(inheritedField);
			}
		}
	}

	collection(): Collection<any>
	{
		return this.DB.collection(this.name);
	}

	createCollection()
	{
		this.DB.createCollection(this.name, this.createOptions).then( result => {
			this.callHook("collection:created");
			for(let index of this.indexes)
			{
				this.collection().createIndex(index.specification, {
					unique: index.unique,
					dropDups: true,
					w: 1
				});
			}
			this.callHook("indexes:created");
		});
	}

	registerHook(hookName: string, callback: any)
	{
		this.hooks[hookName] = callback;
	}

	callHook(hookName: string, input?: any)
	{
		if(this.hooks[hookName])
		{
			return this.hooks[hookName](input);
		}
		return input;
	}

	validate(document: object): SchemaValidationResult
	{
		let validatingDocument = this.callHook("validate", document);
		
		for(var field of this.fields)
		{
			var error = SchemaValidator.validateField(field, validatingDocument[field.name]);
			if(error)
			{
				return error;
			}
		}
		
		//SchemaValidator.ValidateDocument(document, this);
	}

};