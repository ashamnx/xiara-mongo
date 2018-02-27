import { Db, Collection } from "mongodb";
import { MongoQuery } from "./MongoQuery";
import { MongoCollection } from "../MongoCollection";

export class MongoQuerySingle<T extends MongoCollection> extends MongoQuery<T>
{
	then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): Promise<TResult1 | TResult2>
	{
		return this.exec().then( onfulfilled, onrejected );
	}

	catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): Promise<T | TResult>
	{
		return this.exec().catch(onrejected);
	}

	exec(): Promise<T>
	{
		return new Promise<T>( (resolve, reject: any) => {
			let query: Promise<any> = this.collection.getCollection().findOne(this.query).then((data) => {
				if(this.isLean)
				{
					return resolve(data);
				}
				if(!data)
				{
					return resolve(data);
				}
				var instance: T = this.collection.constructCollection<T>(<any>this.collection);
				instance.hydrate(data);
				resolve(instance);
			}).catch( reject );
		});
	}
};