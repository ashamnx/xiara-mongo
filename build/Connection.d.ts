import { IConnectionOptions } from './Utils';
import { BehaviorSubject, Observable } from 'rxjs';
export declare class MongoConnection {
    protected _OnConnectedSubject: BehaviorSubject<boolean>;
    protected _db: any;
    constructor(options: IConnectionOptions);
    OnConnect(): Observable<boolean>;
    connect(options: IConnectionOptions): void;
    close(forceClose?: boolean): Promise<void>;
}
//# sourceMappingURL=Connection.d.ts.map