"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var MongoQuery_1 = require("./MongoQuery");
var MongoQuerySingle = /** @class */ (function (_super) {
    __extends(MongoQuerySingle, _super);
    function MongoQuerySingle() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    MongoQuerySingle.prototype.then = function (onfulfilled, onrejected) {
        return this.exec().then(onfulfilled, onrejected);
    };
    MongoQuerySingle.prototype.catch = function (onrejected) {
        return this.exec().catch(onrejected);
    };
    MongoQuerySingle.prototype.exec = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var query = _this.collection.getCollection().findOne(_this.query).then(function (data) {
                if (_this.isLean) {
                    return resolve(data);
                }
                if (!data) {
                    return resolve(data);
                }
                var instance = _this.collection.constructCollection(_this.collection);
                instance.hydrate(data);
                resolve(instance);
            }).catch(reject);
        });
    };
    return MongoQuerySingle;
}(MongoQuery_1.MongoQuery));
exports.MongoQuerySingle = MongoQuerySingle;
;

//# sourceMappingURL=MongoQuerySingle.js.map
