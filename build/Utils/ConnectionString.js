"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function CreateConnectionString(Connection) {
    var ConnectionString = "mongodb://";
    if (Connection.User) {
        ConnectionString += encodeURIComponent(Connection.User);
    }
    if (Connection.Password) {
        ConnectionString += ":" + encodeURIComponent(Connection.Password);
    }
    if (Connection.Hostname) {
        if (Connection.User) {
            ConnectionString += "@";
        }
        ConnectionString += Connection.Hostname;
    }
    if (Connection.ReplicaSet && Connection.Replicas) {
        if (Connection.User) {
            ConnectionString += "@";
        }
        for (var _i = 0, _a = Connection.Replicas; _i < _a.length; _i++) {
            var Replica = _a[_i];
            ConnectionString += Replica.Hostname;
            ConnectionString += ":" + Replica.Port + ",";
        }
        ConnectionString = ConnectionString.slice(0, -1);
    }
    if (Connection.Port) {
        ConnectionString += ":" + Connection.Port;
    }
    if (Connection.Database) {
        ConnectionString += "/" + Connection.Database;
    }
    if (Connection.ReplicaSet) {
        ConnectionString += "?replicaSet=" + Connection.ReplicaSet;
    }
    return ConnectionString;
}
exports.CreateConnectionString = CreateConnectionString;

//# sourceMappingURL=ConnectionString.js.map
