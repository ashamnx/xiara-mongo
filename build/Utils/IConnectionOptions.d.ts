export declare class IReplicaConnection {
    Hostname?: string;
    Port?: number;
}
export declare class IConnectionOptions {
    User?: string;
    Password?: string;
    Hostname?: string;
    ReplicaSet?: string;
    Replicas?: IReplicaConnection[];
    Port?: number;
    Database?: string;
}
