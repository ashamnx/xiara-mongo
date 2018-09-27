"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    }
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var Connection_1 = require("./Connection");
var MongoAdapter = /** @class */ (function (_super) {
    __extends(MongoAdapter, _super);
    function MongoAdapter(options) {
        return _super.call(this, options) || this;
    }
    MongoAdapter.prototype.bootstrap = function (collections) {
        var _this = this;
        this.OnConnect().subscribe(function (connected) {
            if (connected) {
                _this.collections = [];
                for (var _i = 0, collections_1 = collections; _i < collections_1.length; _i++) {
                    var collection = collections_1[_i];
                    _this.initCollection(collection);
                }
            }
        });
    };
    MongoAdapter.prototype.initCollection = function (collection) {
        var schema = collection.getSchema();
        schema.prepare();
        schema.setConnection(this._db); // Connect the schema with this adapter.
        schema.createCollection();
        this.collections.push(collection);
    };
    return MongoAdapter;
}(Connection_1.MongoConnection));
exports.MongoAdapter = MongoAdapter;
;

//# sourceMappingURL=MongoAdapter.js.map
