"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var MongoQuery = /** @class */ (function () {
    function MongoQuery(collection, query) {
        this.collection = collection;
        this.query = query;
        this.isLean = false;
        this.pipeline = [];
        this.populatedFields = [];
        if (query != null) {
            this.where(query);
        }
    }
    MongoQuery.prototype.lean = function (isLean) {
        if (isLean === void 0) { isLean = true; }
        this.isLean = isLean;
        return this;
    };
    MongoQuery.prototype.where = function (clause) {
        this.pipeline.push({
            $match: clause,
        });
        return this;
    };
    MongoQuery.prototype.gt = function (clause) {
        var fields = Object.keys(clause);
        var query = {};
        for (var _i = 0, fields_1 = fields; _i < fields_1.length; _i++) {
            var f = fields_1[_i];
            query[f] = {
                $gt: clause[f]
            };
        }
        return this.where(query);
    };
    MongoQuery.prototype.gte = function (clause) {
        var fields = Object.keys(clause);
        var query = {};
        for (var _i = 0, fields_2 = fields; _i < fields_2.length; _i++) {
            var f = fields_2[_i];
            query[f] = {
                $gte: clause[f]
            };
        }
        return this.where(query);
    };
    MongoQuery.prototype.lt = function (clause) {
        var fields = Object.keys(clause);
        var query = {};
        for (var _i = 0, fields_3 = fields; _i < fields_3.length; _i++) {
            var f = fields_3[_i];
            query[f] = {
                $lt: clause[f]
            };
        }
        return this.where(query);
    };
    MongoQuery.prototype.lte = function (clause) {
        var fields = Object.keys(clause);
        var query = {};
        for (var _i = 0, fields_4 = fields; _i < fields_4.length; _i++) {
            var f = fields_4[_i];
            query[f] = {
                $lte: clause[f]
            };
        }
        return this.where(query);
    };
    MongoQuery.prototype.skip = function (skip) {
        if (skip === void 0) { skip = 0; }
        this.pipeline.push({
            $skip: skip
        });
        return this;
    };
    MongoQuery.prototype.limit = function (limit) {
        if (limit === void 0) { limit = 0; }
        this.pipeline.push({
            $limit: limit
        });
        return this;
    };
    MongoQuery.prototype.populate = function () {
        var fields = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            fields[_i] = arguments[_i];
        }
        var schema = this.collection.getSchema();
        for (var _a = 0, fields_5 = fields; _a < fields_5.length; _a++) {
            var field = fields_5[_a];
            if (this.populatedFields.indexOf(field) >= 0)
                continue;
            var localField = schema.findField(field);
            if (!localField.options || !localField.options.reference)
                continue;
            var foreignSchema = localField.options.reference.getSchema();
            var foreignField = foreignSchema.findField(localField.options.by || "_id");
            this.pipeline.push({
                $lookup: {
                    from: foreignSchema.name,
                    localField: localField.name,
                    foreignField: foreignField.name,
                    as: localField.name,
                }
            });
            this.pipeline.push({
                $unwind: "$" + localField.name,
            });
            this.populatedFields.push(localField.name);
        }
        return this;
    };
    MongoQuery.prototype.cast = function () {
        return null;
    };
    MongoQuery.prototype.aggregate = function (pipeline, options, callback) {
        if (pipeline === void 0) { pipeline = []; }
        return this.collection.getCollection().aggregate(pipeline);
    };
    MongoQuery.prototype.cursor = function (cursorOptions, explain) {
        var schema = this.collection.getSchema();
        var populateFields = schema.fields.filter(function (field) { return field.options.autoPopulate; });
        this.populate.apply(this, populateFields.map(function (field) { return field.name; }));
        return this.aggregate(this.pipeline, {
            cursor: cursorOptions,
            explain: explain,
        });
    };
    return MongoQuery;
}());
exports.MongoQuery = MongoQuery;
;

//# sourceMappingURL=MongoQuery.js.map
