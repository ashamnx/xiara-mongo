import { MongoSchema } from "../MongoSchema";

export class SchemaValidationResult
{
	constructor(public error: string, public message: string)
	{

	}

	isOk(): boolean
	{
		return !this.error;
	}

	nicest(): string
	{
		return this.message;
	}

	throwError()
	{
		throw new Error(this.error + " '" + this.message + "'");
	}
};

export class SchemaFieldValidationError extends SchemaValidationResult
{
	constructor(public field: string, public message: string)
	{
		super("Field Validation Error:", message);
	}

};
