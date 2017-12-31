import { IConnectionOptions } from "./Utils";
import { MongoConnection } from "./Connection";
import { ICollection, MongoCollection, MongoSchema } from "./Definitions"

export class MongoAdapter extends MongoConnection
{
	collections: typeof MongoCollection[];
	constructor( options: IConnectionOptions)
	{
		super(options);
	}

	bootstrap( collections: typeof MongoCollection[] )
	{
		this.OnConnect().subscribe((connected) => {
			if(connected)
			{
				this.collections = [];
				for(let collection of collections)
				{
					this.initCollection(collection);
				}
			}
		});
		
	}

	initCollection(collection: typeof MongoCollection)
	{
		let schema = collection.getSchema();
		schema.prepare();
		schema.setConnection(this._db); // Connect the schema with this adapter.
		schema.createCollection();

		this.collections.push(collection);
	}
};