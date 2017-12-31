import { CreateConnectionString, IConnectionOptions } from "./Utils";
import { Observable, BehaviorSubject } from "rxjs";

// MongoDB
import { MongoClient, Db, MongoError } from "mongodb";

export class MongoConnection
{
	protected _OnConnectedSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(null);
	protected _db: Db = null;
	constructor(options: IConnectionOptions)
	{
		this.connect(options);
	}

	OnConnect(): Observable<boolean>
	{
		return this._OnConnectedSubject.asObservable();
	}

	connect(options: IConnectionOptions)
	{
		let connectionString = CreateConnectionString(options);
		MongoClient.connect(connectionString, {
			autoReconnect: true,
		}, (error: MongoError, db: Db) => {
			if(error)
			{
				this._OnConnectedSubject.next(null);
				throw error;
			}else{
				this._db = db.db(options.Database);
				this._OnConnectedSubject.next(true);
			}
		})
	}

	// Closes the mongo connection
	close(forceClose: boolean = false): Promise<void>
	{
		if(!this._db)
		{
			throw Error("Not connected.");
		}
		return this._db.close(forceClose);
	}
};