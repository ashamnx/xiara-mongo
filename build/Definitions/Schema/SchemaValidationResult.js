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
var SchemaValidationResult = /** @class */ (function () {
    function SchemaValidationResult(error, message) {
        this.error = error;
        this.message = message;
    }
    SchemaValidationResult.prototype.isOk = function () {
        return !this.error;
    };
    SchemaValidationResult.prototype.nicest = function () {
        return this.message;
    };
    SchemaValidationResult.prototype.throwError = function () {
        throw new Error(this.error + " '" + this.message + "'");
    };
    return SchemaValidationResult;
}());
exports.SchemaValidationResult = SchemaValidationResult;
;
var SchemaFieldValidationError = /** @class */ (function (_super) {
    __extends(SchemaFieldValidationError, _super);
    function SchemaFieldValidationError(field, message) {
        var _this = _super.call(this, "Field Validation Error:", message) || this;
        _this.field = field;
        _this.message = message;
        return _this;
    }
    return SchemaFieldValidationError;
}(SchemaValidationResult));
exports.SchemaFieldValidationError = SchemaFieldValidationError;
;

//# sourceMappingURL=SchemaValidationResult.js.map
