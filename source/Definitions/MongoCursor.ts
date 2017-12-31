import { Cursor } from "mongodb";
export class MongoCursor<T>
{
	constructor(public cursor: Cursor<T>)
	{

	}
};