"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
var Decorators_1 = require("./Decorators");
var Query_1 = require("./Query");
var mongodb_1 = require("mongodb");
//import { IFindQuery } "./FindQuery";
var MongoSchemaRegistry_1 = require("./MongoSchemaRegistry");
var bson_1 = require("bson");
;
var MongoCollection = /** @class */ (function () {
    //_version: number;
    function MongoCollection(data) {
        if (data === void 0) { data = null; }
        if (data != null) {
            this.hydrate(data);
        }
    }
    MongoCollection.constructCollection = function (type) {
        return new type();
    };
    MongoCollection.prototype.hydrate = function (data) {
        if (!data)
            return;
        var schema = this.getSchemaDefinition();
        for (var _i = 0, _a = schema.fields; _i < _a.length; _i++) {
            var field = _a[_i];
            if (field.options) {
                if (data[field.name] === undefined && field.options.default !== undefined) {
                    if (field.options.default.name == "Date") {
                        this[field.name] = new field.options.default();
                        continue;
                    }
                    if (typeof field.options.default === "function") {
                        this[field.name] = field.options.default();
                        continue;
                    }
                    this[field.name] = field.options.default;
                    continue;
                }
                console.log("data[" + field.name + "]", data[field.name]);
                if (data[field.name] && field.options.reference && typeof data[field.name] === "object") {
                    console.log("hydrating:", field.name, typeof data[field.name]);
                    var referencedCollection = new field.options.reference();
                    referencedCollection.hydrate(data[field.name]);
                    this[field.name] = referencedCollection;
                    continue;
                }
            }
            this[field.name] = data[field.name];
        }
    };
    MongoCollection.prototype.dehydrate = function (fields) {
        var rawData = {};
        for (var _i = 0, fields_1 = fields; _i < fields_1.length; _i++) {
            var field = fields_1[_i];
            if (field.options.reference) {
                if (this[field.name] === undefined || this[field.name] === null)
                    continue;
                rawData[field.name] = this[field.name][field.options.by || "_id"];
                continue;
            }
            if ((this[field.name] === undefined || this[field.name] === null) && field.options.default !== undefined) {
                if (field.options.default.name == "Date") {
                    rawData[field.name] = new field.options.default();
                    continue;
                }
                if (typeof field.options.default === "function") {
                    rawData[field.name] = field.options.default();
                    continue;
                }
                else {
                    rawData[field.name] = field.options.default;
                }
            }
            else {
                rawData[field.name] = this[field.name];
            }
        }
        return rawData;
    };
    MongoCollection.prototype.toObject = function () {
        var schema = this.getSchemaDefinition();
        return this.dehydrate(schema.fields);
    };
    // Same as dehydrate but drops the hidden fields
    MongoCollection.prototype.toJSON = function () {
        var schema = this.getSchemaDefinition();
        return this.dehydrate(schema.getVisibleFields());
    };
    MongoCollection.prototype.getValidatedObject = function () {
        var schema = this.getSchemaDefinition();
        var collection = schema.collection();
        var data = this.toObject();
        var validationResult = schema.validate(data);
        if (!validationResult) {
            return null;
        }
        return data;
    };
    MongoCollection.sanitizeQuery = function (query) {
        if (query && query._id && typeof query._id === "string") {
            query._id = new bson_1.ObjectID(query._id);
        }
    };
    MongoCollection.query = function (query) {
        MongoCollection.sanitizeQuery(query);
        return new Query_1.MongoQuery(this, query);
    };
    MongoCollection.find = function (query) {
        MongoCollection.sanitizeQuery(query);
        return new Query_1.MongoQueryMulti(this, query);
    };
    MongoCollection.findOne = function (query) {
        MongoCollection.sanitizeQuery(query);
        return new Query_1.MongoQuerySingle(this, query);
    };
    MongoCollection.createOne = function (data) {
        var instance = this.constructCollection(this);
        instance.hydrate(data);
        return instance.save();
    };
    MongoCollection.findOneAndUpdate = function (query, data, options) {
        if (options === void 0) { options = undefined; }
        MongoCollection.sanitizeQuery(query);
        var collection = this.getSchema().collection();
        return collection.findOneAndUpdate(query, {
            $set: data
        }, options).then(function (result) {
            if (options && options.returnOriginal) {
                return result.value;
            }
            return result;
        }).catch(function (error) {
            return error;
        });
    };
    MongoCollection.updateOne = function (query, data, options) {
        if (options === void 0) { options = undefined; }
        MongoCollection.sanitizeQuery(query);
        var collection = this.getSchema().collection();
        return collection.updateOne(query, {
            $set: data
        }, options);
    };
    MongoCollection.update = function (query, data, options) {
        if (options === void 0) { options = undefined; }
        MongoCollection.sanitizeQuery(query);
        var collection = this.getSchema().collection();
        return collection.update(query, {
            $set: data
        }, options);
    };
    MongoCollection.remove = function (query) {
        MongoCollection.sanitizeQuery(query);
        var collection = this.getSchema().collection();
        return collection.remove(query);
    };
    MongoCollection.removeOne = function (query) {
        MongoCollection.sanitizeQuery(query);
        var collection = this.getSchema().collection();
        return collection.remove(query, { single: true });
    };
    MongoCollection.aggregate = function (pipeline) {
        if (pipeline === void 0) { pipeline = []; }
        return this.getCollection().aggregate(pipeline);
    };
    MongoCollection.getSchema = function () {
        return MongoSchemaRegistry_1.MongoSchemaRegistry.getSchema(this.name);
    };
    MongoCollection.getCollection = function () {
        return this.getSchema().collection();
    };
    MongoCollection.stats = function () {
        return this.getCollection().stats();
    };
    MongoCollection.prototype.collection = function () {
        return this.getSchemaDefinition().collection();
    };
    MongoCollection.prototype.getSchemaDefinition = function () {
        return MongoSchemaRegistry_1.MongoSchemaRegistry.getSchema(this.constructor.name);
        //return (<any>this.constructor).SchemaDefinition;
    };
    MongoCollection.prototype.save = function (options) {
        if (options === void 0) { options = {}; }
        if (!this._id) {
            return this.insert(options);
        }
        else {
            return this.update(options);
        }
    };
    MongoCollection.prototype.insert = function (options) {
        var _this = this;
        if (options === void 0) { options = undefined; }
        var schema = this.getSchemaDefinition();
        var collection = schema.collection();
        var data = this.toObject();
        var validationResult = schema.validate(data);
        if (!validationResult) {
            return collection.insertOne(data, options).then(function (result) {
                _this._id = result.insertedId; // Assign inserted _id
                console.log("New insertedId:", _this._id);
                return _this;
            });
        }
        return Promise.reject(validationResult);
    };
    MongoCollection.prototype.update = function (options) {
        var _this = this;
        if (options === void 0) { options = undefined; }
        var schema = this.getSchemaDefinition();
        var collection = schema.collection();
        var data = this.toObject();
        var validationResult = schema.validate(data);
        if (!validationResult) {
            return collection.updateOne({
                _id: this._id,
            }, {
                $set: data
            }, options).then(function (result) {
                return _this;
            });
        }
        return Promise.reject(validationResult);
    };
    MongoCollection.prototype.remove = function () {
        if (!this._id) {
            return Promise.reject("_id is not defined");
        }
        return this.collection().deleteOne({
            _id: this._id
        });
    };
    MongoCollection.prototype.replace = function (replaceWith) {
        var schema = replaceWith.getSchemaDefinition();
        var collection = schema.collection();
        var data = replaceWith.toObject();
        var validationResult = schema.validate(data);
        if (!validationResult) {
            return this.collection().replaceOne({ _id: this._id }, data);
        }
        return Promise.reject(validationResult);
    };
    __decorate([
        Decorators_1.Property(),
        __metadata("design:type", mongodb_1.ObjectId)
    ], MongoCollection.prototype, "_id", void 0);
    return MongoCollection;
}());
exports.MongoCollection = MongoCollection;
;

//# sourceMappingURL=MongoCollection.js.map
