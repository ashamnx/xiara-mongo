import { IConnectionOptions } from "./Utils";
import { Observable, BehaviorSubject } from "rxjs";
import { Db } from "mongodb";
export declare class MongoConnection {
    protected _OnConnectedSubject: BehaviorSubject<boolean>;
    protected _db: Db;
    constructor(options: IConnectionOptions);
    OnConnect(): Observable<boolean>;
    connect(options: IConnectionOptions): void;
    close(forceClose?: boolean): Promise<void>;
}
