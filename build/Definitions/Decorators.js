"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
var MongoSchema_1 = require("./MongoSchema");
var MongoSchemaRegistry_1 = require("./MongoSchemaRegistry");
function resolveParentInheritors(target) {
    var parent = Object.getPrototypeOf(target);
    if (!parent || !parent.name) {
        return [];
    }
    var inheritors = resolveParentInheritors(parent);
    inheritors.unshift(parent);
    return inheritors;
}
function Model(name, options, createOptions) {
    return function (target) {
        if (!target.SchemaDefinition) {
            target.SchemaDefinition = new MongoSchema_1.MongoSchema(target);
        }
        var parents = resolveParentInheritors(target);
        var schema = MongoSchemaRegistry_1.MongoSchemaRegistry.getSchema(target.name);
        if (!schema) {
            schema = new MongoSchema_1.MongoSchema(target);
            MongoSchemaRegistry_1.MongoSchemaRegistry.register(target.name, schema);
        }
        schema.name = name;
        schema.createOptions = createOptions;
        schema.inherits = parents;
        if (!options)
            return;
        if (options.indexes) {
            for (var _i = 0, _a = options.indexes; _i < _a.length; _i++) {
                var index = _a[_i];
                schema.addIndex(index);
            }
        }
        if (options.inherits) {
            schema.inherits.push.prototype.apply(options.inherits);
            //schema.inherits = options.inherits.concat(parents);
        }
    };
}
exports.Model = Model;
function Property(fieldOptions) {
    if (fieldOptions === void 0) { fieldOptions = {}; }
    return function (target, key) {
        var schema = MongoSchemaRegistry_1.MongoSchemaRegistry.getSchema(target.constructor.name);
        if (!schema) {
            schema = new MongoSchema_1.MongoSchema(target.constructor);
            MongoSchemaRegistry_1.MongoSchemaRegistry.register(target.constructor.name, schema);
        }
        schema.addField(key, Reflect.getMetadata('design:type', target, key), fieldOptions);
    };
}
exports.Property = Property;
function Hook(hookName) {
    return function (target, key) {
        if (!target.SchemaDefinition) {
            target.SchemaDefinition = new MongoSchema_1.MongoSchema(target);
        }
        var schema = target.SchemaDefinition;
        schema.registerHook(hookName, target[key]);
    };
}
exports.Hook = Hook;

//# sourceMappingURL=Decorators.js.map
