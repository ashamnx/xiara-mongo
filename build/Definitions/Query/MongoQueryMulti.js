"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var MongoQuery_1 = require("./MongoQuery");
var MongoQueryMulti = /** @class */ (function (_super) {
    __extends(MongoQueryMulti, _super);
    function MongoQueryMulti() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    MongoQueryMulti.prototype.then = function (onfulfilled, onrejected) {
        return this.exec().then(onfulfilled, onrejected);
    };
    MongoQueryMulti.prototype.catch = function (onrejected) {
        return this.exec().catch(onrejected);
    };
    MongoQueryMulti.prototype.exec = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            if (_this.isLean) {
                _this.cursor().toArray().then(function (array) {
                    resolve(array);
                });
                return;
            }
            _this.cursor().toArray().then(function (array) {
                resolve(array.map(function (document) {
                    var instance = _this.collection.constructCollection(_this.collection);
                    instance.hydrate(document);
                    return instance;
                }));
            });
        });
    };
    MongoQueryMulti.prototype.forEach = function (callback, done) {
        var _this = this;
        var cursor = this.cursor().toArray();
        if (this.isLean) {
            this.cursor().toArray().then(function (array) {
                array.forEach(callback);
                if (done) {
                    done();
                }
            });
            return;
        }
        cursor.then(function (array) {
            array.forEach(function (data) {
                var instance = _this.collection.constructCollection(_this.collection);
                instance.hydrate(data);
                callback(instance);
            });
            if (done) {
                done();
            }
        });
        //cursor.to
    };
    return MongoQueryMulti;
}(MongoQuery_1.MongoQuery));
exports.MongoQueryMulti = MongoQueryMulti;
;

//# sourceMappingURL=MongoQueryMulti.js.map
