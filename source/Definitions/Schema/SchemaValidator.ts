import "reflect-metadata";
import { MongoSchema } from "../MongoSchema";
import { SchemaFieldValidationError } from "./SchemaValidationResult";
import { IProperty } from "../MongoSchema";

export class SchemaValidator
{
	static validateField(field: IProperty, data: object): SchemaFieldValidationError
	{
		if(data === undefined)
		{
			if(field.options.required)
			{
				return new SchemaFieldValidationError(field.name, "Field Is required");
			}
			return null;
		}

		
		if(data.constructor.name !== field.type)
		{
			if(!field.options.reference)
			{
				return new SchemaFieldValidationError(field.name, "Invalid Type: '" + field.type + "' is needed. '" + data.constructor.name + "' was given");	
			}
		}
		
		return null;
	}
};