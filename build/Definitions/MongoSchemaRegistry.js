"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var MongoSchemaRegistry = /** @class */ (function () {
    function MongoSchemaRegistry() {
    }
    MongoSchemaRegistry.register = function (name, schema) {
        MongoSchemaRegistry.schemas[name] = schema;
    };
    MongoSchemaRegistry.getSchema = function (name) {
        return MongoSchemaRegistry.schemas[name];
    };
    MongoSchemaRegistry.schemas = {};
    return MongoSchemaRegistry;
}());
exports.MongoSchemaRegistry = MongoSchemaRegistry;
;

//# sourceMappingURL=MongoSchemaRegistry.js.map
