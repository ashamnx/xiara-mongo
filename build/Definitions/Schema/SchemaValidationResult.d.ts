export declare class SchemaValidationResult {
    error: string;
    message: string;
    constructor(error: string, message: string);
    isOk(): boolean;
    nicest(): string;
    throwError(): void;
}
export declare class SchemaFieldValidationError extends SchemaValidationResult {
    field: string;
    message: string;
    constructor(field: string, message: string);
}
//# sourceMappingURL=SchemaValidationResult.d.ts.map