import {CreateConnectionString, IConnectionOptions} from './Utils';
import {BehaviorSubject, Observable} from 'rxjs';
// MongoDB
import {MongoClient, MongoError} from 'mongodb';

export class MongoConnection {
    protected _OnConnectedSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(null);
    protected _db = null;

    constructor(options: IConnectionOptions) {
        this.connect(options);
    }

    OnConnect(): Observable<boolean> {
        return this._OnConnectedSubject.asObservable();
    }

    connect(options: IConnectionOptions) {
        let connectionString = CreateConnectionString(options);
        MongoClient.connect(connectionString, {
            autoReconnect: true,
        }, (error: MongoError, db) => {
            if (error) {
                this._OnConnectedSubject.next(null);
                throw error;
            } else {
                this._db = db.db(options.Database);
                this._OnConnectedSubject.next(true);
            }
        });
    }

    // Closes the mongo connection
    close(forceClose: boolean = false): Promise<void> {
        if (!this._db) {
            throw Error('Not connected.');
        }
        return this._db.close(forceClose);
    }
};