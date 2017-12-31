"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Utils_1 = require("./Utils");
var rxjs_1 = require("rxjs");
// MongoDB
var mongodb_1 = require("mongodb");
var MongoConnection = /** @class */ (function () {
    function MongoConnection(options) {
        this._OnConnectedSubject = new rxjs_1.BehaviorSubject(null);
        this._db = null;
        this.connect(options);
    }
    MongoConnection.prototype.OnConnect = function () {
        return this._OnConnectedSubject.asObservable();
    };
    MongoConnection.prototype.connect = function (options) {
        var _this = this;
        var connectionString = Utils_1.CreateConnectionString(options);
        mongodb_1.MongoClient.connect(connectionString, {
            autoReconnect: true,
        }, function (error, db) {
            if (error) {
                _this._OnConnectedSubject.next(null);
                throw error;
            }
            else {
                _this._db = db.db(options.Database);
                _this._OnConnectedSubject.next(true);
            }
        });
    };
    // Closes the mongo connection
    MongoConnection.prototype.close = function (forceClose) {
        if (forceClose === void 0) { forceClose = false; }
        if (!this._db) {
            throw Error("Not connected.");
        }
        return this._db.close(forceClose);
    };
    return MongoConnection;
}());
exports.MongoConnection = MongoConnection;
;

//# sourceMappingURL=Connection.js.map
