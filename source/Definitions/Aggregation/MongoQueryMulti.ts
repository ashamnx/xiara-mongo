import { Db, Collection, Cursor, AggregationCursor } from "mongodb";
import { MongoQuery } from "./MongoQuery";
import { MongoCollection } from "../MongoCollection";

export class MongoQueryMulti<T extends MongoCollection> extends MongoQuery<T[]>
{
	then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T[]) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): Promise<TResult1 | TResult2>
	{
		return this.exec().then( onfulfilled, onrejected );
	}

	catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): Promise<T[] | TResult>
	{
		return this.exec().catch(onrejected);
	}

	exec(): Promise<T[]>
	{
		return new Promise( (resolve, reject: any) => {
			if(this.isLean)
			{
				this.cursor().toArray().then( array => {
					resolve(array);
				});
				return;
			}
			
			this.cursor().toArray().then( array => {
				resolve(array.map( document => {
					let instance: any = this.collection.constructCollection<T>(<any>this.collection);
					instance.hydrate(document);
					return instance;
				}));
			});

		});
	}

	forEach(callback, done?)
	{
		let cursor = this.cursor().toArray();
		if(this.isLean)
		{
			this.cursor().toArray().then( array => {
				array.forEach(callback);
				if(done)
				{
					done();
				}
			})
			return;
		}
		
		cursor.then( array => {
			array.forEach( data => {
				var instance: any = this.collection.constructCollection<T>(<any>this.collection);
				instance.hydrate(data);
				callback(instance);
			});
			if(done)
			{
				done();
			}
		});
		
		
		//cursor.to
	}
};