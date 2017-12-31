import "reflect-metadata";
import { SchemaFieldValidationError } from "./SchemaValidationResult";
import { IProperty } from "../MongoSchema";
export declare class SchemaValidator {
    static validateField(field: IProperty, data: object): SchemaFieldValidationError;
}
