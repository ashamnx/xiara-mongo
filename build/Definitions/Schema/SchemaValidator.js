"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
var SchemaValidationResult_1 = require("./SchemaValidationResult");
var SchemaValidator = /** @class */ (function () {
    function SchemaValidator() {
    }
    SchemaValidator.validateField = function (field, data) {
        if (data === undefined) {
            if (field.options.required) {
                return new SchemaValidationResult_1.SchemaFieldValidationError(field.name, "Field Is required");
            }
            return null;
        }
        if (data.constructor.name !== field.type) {
            if (!field.options.reference) {
                return new SchemaValidationResult_1.SchemaFieldValidationError(field.name, "Invalid Type: '" + field.type + "' is needed. '" + data.constructor.name + "' was given");
            }
        }
        return null;
    };
    return SchemaValidator;
}());
exports.SchemaValidator = SchemaValidator;
;

//# sourceMappingURL=SchemaValidator.js.map
