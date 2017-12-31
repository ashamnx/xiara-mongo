"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Schema_1 = require("./Schema");
;
;
;
var MongoSchema = /** @class */ (function () {
    function MongoSchema(CollectionSpec) {
        //	this.addField("_id", ObjectId, {});
        this.CollectionSpec = CollectionSpec;
        this.indexes = [];
        this.fields = [];
        this.hooks = {};
        this.inherits = [];
        // this.addField("_version", Number, {
        // 	default: 0,
        // });
    }
    MongoSchema.prototype.addField = function (fieldName, fieldType, fieldOptions) {
        if (fieldOptions.index !== undefined || fieldOptions.unique !== undefined) {
            var index = {
                specification: {},
                unique: fieldOptions.unique,
            };
            index.specification[fieldName] = fieldOptions.index || 1;
            this.addIndex(index);
        }
        if (fieldOptions.type !== undefined) {
            fieldType = fieldOptions.type;
        }
        this.fields.push({
            name: fieldName,
            type: fieldType.name,
            options: fieldOptions,
        });
    };
    MongoSchema.prototype.getHiddenFields = function () {
        return this.callHook("fields:hidden", this.fields.filter(function (field) { return field.options.hidden; }));
    };
    MongoSchema.prototype.getVisibleFields = function () {
        return this.callHook("fields:visible", this.fields.filter(function (field) { return !field.options.hidden; }));
    };
    MongoSchema.prototype.addIndex = function (index) {
        this.indexes.push(index);
    };
    MongoSchema.prototype.setConnection = function (db) {
        this.DB = db;
        this.callHook("db:connected");
    };
    MongoSchema.prototype.findField = function (name) {
        return this.fields.find(function (field) {
            if (field.name == name)
                return true;
            return false;
        });
    };
    MongoSchema.prototype.prepare = function () {
        for (var _i = 0, _a = this.inherits; _i < _a.length; _i++) {
            var inherited = _a[_i];
            var inheritedSchema = inherited.getSchema();
            for (var _b = 0, _c = inheritedSchema.fields; _b < _c.length; _b++) {
                var inheritedField = _c[_b];
                // Skip fields. We allow overrides this way?
                if (this.findField(inheritedField.name))
                    continue;
                this.fields.unshift(inheritedField);
            }
        }
    };
    MongoSchema.prototype.collection = function () {
        return this.DB.collection(this.name);
    };
    MongoSchema.prototype.createCollection = function () {
        var _this = this;
        this.DB.createCollection(this.name, this.createOptions).then(function (result) {
            _this.callHook("collection:created");
            for (var _i = 0, _a = _this.indexes; _i < _a.length; _i++) {
                var index = _a[_i];
                _this.collection().createIndex(index.specification, {
                    unique: index.unique,
                    dropDups: true,
                    w: 1
                });
            }
            _this.callHook("indexes:created");
        });
    };
    MongoSchema.prototype.registerHook = function (hookName, callback) {
        this.hooks[hookName] = callback;
    };
    MongoSchema.prototype.callHook = function (hookName, input) {
        if (this.hooks[hookName]) {
            return this.hooks[hookName](input);
        }
        return input;
    };
    MongoSchema.prototype.validate = function (document) {
        var validatingDocument = this.callHook("validate", document);
        for (var _i = 0, _a = this.fields; _i < _a.length; _i++) {
            var field = _a[_i];
            var error = Schema_1.SchemaValidator.validateField(field, validatingDocument[field.name]);
            if (error) {
                return error;
            }
        }
        //SchemaValidator.ValidateDocument(document, this);
    };
    return MongoSchema;
}());
exports.MongoSchema = MongoSchema;
;

//# sourceMappingURL=MongoSchema.js.map
