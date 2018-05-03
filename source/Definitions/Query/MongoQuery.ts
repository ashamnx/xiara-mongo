import { Db, Collection, AggregationCursor, AggregationCursorResult, CollectionAggregationOptions, MongoCallback, ObjectID } from "mongodb";
import { MongoCollection } from "../MongoCollection";
import { MongoSchemaRegistry } from "../MongoSchemaRegistry";
export class MongoQuery<T>
{
	public isLean: boolean = false;
	public isNatural: boolean = false;
	public pipeline = [];
	public populatedFields:any[] = [];
	constructor(public collection: typeof MongoCollection, public query?: any)
	{
		if(query != null)
		{
			this.where(query);
		}
	}

	lean(isLean = true): this
	{
		this.isLean = isLean;
		return this;
	}

	where(clause?: any): this
	{
		this.pipeline.push({
			$match: clause,
		});
		return this;
	}

	gt(clause?: object): this
	{
		let fields = Object.keys(clause);
		var query = {};
		for(let f of fields)
		{
			query[f] = {
				$gt: clause[f]
			};
		}
		return this.where(query);
	}


	gte(clause?: object): this
	{
		let fields = Object.keys(clause);
		var query = {};
		for(let f of fields)
		{
			query[f] = {
				$gte: clause[f]
			};
		}
		return this.where(query);
	}


	lt(clause?: object): this
	{
		let fields = Object.keys(clause);
		var query = {};
		for(let f of fields)
		{
			query[f] = {
				$lt: clause[f]
			};
		}
		return this.where(query);
	}


	lte(clause?: object): this
	{
		let fields = Object.keys(clause);
		var query = {};
		for(let f of fields)
		{
			query[f] = {
				$lte: clause[f]
			};
		}
		return this.where(query);
	}

	skip(skip:number = 0): this
	{
		this.pipeline.push({
			$skip: skip
		});
		return this;
	}

	sort(clause?: object): this
	{
		this.pipeline.push({
			$sort: clause
		});
		return this;
	}

	count(clause?: object): this
	{
		this.pipeline.push({
			count: clause
		});
		return this;
	}

	limit(limit:number = 0): this
	{
		this.pipeline.push({
			$limit: limit
		});
		return this;
	}

	populate(...fields:string[]): this
	{

		let schema = this.collection.getSchema();

		for(var field of fields)
		{
			if(this.populatedFields.indexOf(field) >= 0)
				continue;

			let localField = schema.findField(field);
			if(!localField.options || !localField.options.reference)
				continue;

			let foreignSchema = localField.options.reference.getSchema();
			let foreignField = foreignSchema.findField(localField.options.by || "_id");

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
	}

	cast<U>(): MongoQuery<U>
	{
		return null;
	}

    aggregate(pipeline: any[] = [], options?: CollectionAggregationOptions, callback?: MongoCallback<any>): AggregationCursor<any>
	{
		return this.collection.getCollection().aggregate<any>(pipeline);
	}

	cursor(cursorOptions?: { batchSize: number }, explain?: boolean): AggregationCursor<any>
	{
		let schema = this.collection.getSchema();
		let populateFields = schema.fields.filter( field => field.options.autoPopulate);
		this.populate.apply(this, populateFields.map(field => field.name));
		return this.aggregate(this.pipeline, {
			cursor: cursorOptions,
			explain: explain,
		});
	}


}