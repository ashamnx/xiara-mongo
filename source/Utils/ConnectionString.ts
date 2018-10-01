import {IConnectionOptions} from './IConnectionOptions';

export function CreateConnectionString(Connection: IConnectionOptions): string {
    let ConnectionString = 'mongodb://';
    if (Connection.User) {
        ConnectionString += encodeURIComponent(Connection.User);
    }
    if (Connection.Password) {
        ConnectionString += ':' + encodeURIComponent(Connection.Password);
    }
    if (Connection.Hostname) {
        if (Connection.User) {
            ConnectionString += '@';
        }
        ConnectionString += Connection.Hostname;
    }
    if (Connection.ReplicaSet && Connection.Replicas) {
        if (Connection.User) {
            ConnectionString += '@';
        }

        for (let Replica of Connection.Replicas) {
            ConnectionString += Replica.Hostname;
            ConnectionString += ':' + Replica.Port + ',';
        }
        ConnectionString = ConnectionString.slice(0, -1);
    }
    if (Connection.Port) {
        ConnectionString += ':' + Connection.Port;
    }

    if (Connection.Database) {
        ConnectionString += '/' + Connection.Database;
    }
    if (Connection.ReplicaSet) {
        ConnectionString += '?replicaSet=' + Connection.ReplicaSet;
    }

    return ConnectionString;
}