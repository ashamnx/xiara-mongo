# @xiara/mongo
Xiara/Mongo is a MongoDB ODM written entirely in typescript. It is based on mongo-node driver and aim's to support the latest features available in mongo.
This is an object modeling tool designed to work in asynchronous environments.

## WHY?!
All the avilable libraries & frameworks require you to create an Interface and on top of that to create the definition of the model.
Or they are low with features, performance or are not documented properly and out-dated.

I wanted to use a simple api to create my models. The ability to use inheritance & other es6-7 features to define my models.
So i come up with the simplest solution. Define your model as a class with a single `@Model` decorator that extends the `MongoCollection` then bootsrap it with a `MongoAdapter`

## Quick Start

```typescript
import { MongoAdapter } from "@xiara/mongo";

let mongo = new MongoAdapter({
	Hostname: "127.0.0.1",
	Port: 27017,
	Database: "test",

	// Or connect to replicaset	
	ReplicaSet: "replsetname",
	Replicas: [
		{
			Hostname: "127.0.0.1",
			Port: 27018,
		},
		{
			Hostname: "127.0.0.1",
			Port: 27019,
		},
		{
			Hostname: "127.0.0.1",
			Port: 27020,
		}
	]

});

// Bootstrap the models
mongo.bootstrap([
	TodoModel,
	UserModel,
	IndexesModel,
	TimedCollection,
]);

// Listen for connection event?
mongo.OnConnect().subscribe((success) => {
	if(success)
	{
		console.log("MongoDB Connected");
	}
});

```

## Define a Collection

Below example shows how to define a simple model:

```typescript
import { ObjectId, Model, MongoCollection, Property, Hook } from "@xiara/mongo";


// Define collection called "todos"
@Model("todos")
export class TodoModel extends MongoCollection
{
	// Property task as a string and is always required!
	@Property({ required: true })
	task: string;

	// Always updates to Date when saved.
	@Property({ required: true, default: Date, })
	updatedAt: Date = new Date();

	// Default is the current date
	@Property({ required: true})
	createdAt: Date = new Date();
}
```

## Query the Collection

**Simple Insert**
```typescript
var todo = new TodoModel();
todo.task = "Read this!";
todo.save().then( ... ) // Returns promise
```

**Initialize with the constructor**
```typescript
new TodoModel({
	task: "Yup this is awesome!"
}).save().then( ... ) // Returns promise
```


**Provide _id to update**
```typescript
let todo = new TodoModel();
todo._id = new ObjectId("5a486940abd9be16c8c83b58");
todo.task = "Hey ho!"
todo.save().then( ... ) // Returns promise
```


**Find & Update**
```typescript
TodoModel.findOne<TodoModel>({
	_id: new ObjectId("5a486940abd9be16c8c83b58")
}).then(todo => {
	todo.task = "This is awesome!";
	todo.save().then( ... ) // Returns promise
});
```

**Update**
```typescript
TodoModel.updateOne<TodoModel>({
	_id: new ObjectId("5a486940abd9be16c8c83b58")
}, {
	task: "updated!",
}).then( ... ) // Returns promise
```



**Insert**
```typescript
TodoModel.createOne<TodoModel>({
	task: "created!",
}).then( ... ) // Returns promise
```


**Find Many**
```typescript
TodoModel.find<TodoModel>().then( todos => {
	for(let todo of todos)
	{
		console.log("Task:", todo.task);
	}
});
```

## Inheritance & property sharing, relations, interfaces

```typescript
import { ObjectId, Model, MongoCollection, Property, Hook } from "@xiara/mongo";


interface IPersonalDetails
{

}

// Timed collection provides updatedAt & createdAt fields for the 
// other models (Properties are mapped accordingly!) 
// We don't define @Model decorator here as we do not want this model to create a collection.
// We only want to define fields and behavior here
export class TimedCollection extends MongoCollection
{
	@Property({ required: true, default: Date, })
	updatedAt: Date = new Date();

	@Property({ required: true})
	createdAt: Date = new Date();
}


// Define collection named "users"
@Model("users")
export class UserModel extends TimedCollection
{
	// Property task as a string and is always required!
	@Property({ required: true })
	username: string;

	// password field is not visible when JSON serializing
	@Property({ required: true, hidden: true })
	password: string;

	@Property({ required: true })
	personal: IPersonalDetails;
	
}

// Define collection named "posts"
@Model("posts")
export class PostModel extends TimedCollection
{
	// UserModel is now referenced and is connected via ObjectId mapping.
	// Also automatically populated when queried.
	@Property({ required: true, reference: UserModel, autoPopulate: true })
	user: UserModel;

	@Property({ required: true })
	title: string;

	@Property({ required: true })
	content: string;

	// Use default constructor variables to initialize the field with a default value.
	@Property({ required: true })
	upvotes: number = 0;

	// Use default constructor variables to initialize the field with a default value.
	@Property({ required: true })
	downvotes: number = 0;
}
```


## HOOKS & Instance Functions

Hooks come in all sort of types:

- `db:connected` Triggered when database connection is estabilished.
- `collection:init` Triggerd when a collection is created (ex: `new Model()`)
- `collection:created` Triggerd when the collection is ready
- `indexes:created` Triggered when indexes are added
- `validate` Triggered before field validation (filter)
- `fields:hidden` Triggered when hidden fields are requested (filter)
- `fields:visible` Triggered when visible fields are requested (filter)

```typescript
import { ObjectId, Model, MongoCollection, Property, Hook } from "@xiara/mongo";

@Model("hooks")
export class HooksExample extends MongoCollection
{
	@Property()
	field: string;

	// Override constructor?
	constructor()
	{
		super({
			field: "Always bored?",
		});
	}

	// Instance Function
	getCustomData()
	{
		return this.field + "test";
	}

	// Event Hook
	@Hook("db:connected")
	static OnConnected()
	{

	}
	
	// Event Hook
	@Hook("collection:init")
	static OnConnected()
	{

	}

	// Filter Hook
	@Hook("fields:hidden")
	static OnHiddenFiledsFiltered(fields)
	{
		return fields.filter( field => field.name == "field" );
	}
}
```

### Indexes, Model Decorator, Others

```typescript
import { ObjectId, Model, MongoCollection, Property, Hook } from "@xiara/mongo";

@Model("hooks", {
	// Define index on collection level
	indexes: {
		specification: {
			username: 1,
			anotherindex: -1
		},
		unique: true
	},
	// Specify what model to inherit (Usefull when extends is not available).
	// Now TimedCollection fields are being used but typing are not available
	inherits: [ TimedCollection ],
})
export class IndexesModel extends MongoCollection
{
	@Property()
	username: string;

	@Property()
	anotherindex: string;

	// Define index on field level
	@Property({ unique: true, index: 1})
	singleindex: string;
}
```

You can use `get / set` accessors to implement hooks (usefull for hashing passwords on insert.)
```typescript
import { ObjectId, Model, MongoCollection, Property, Hook } from "@xiara/mongo";

@Model("example")
export class ExampleModel extends MongoCollection
{
	@Property({ hidden: true })
	protected hashedPassword: string = null;

	// Return the hashed password from model.password
	get password(): string
	{
		return this.hashedPassword;
	}

	// Hash the password when model.password = "test123"; set
	set password(inValue: string)
	{
		this.hashedPassword = hashingAlgorithm(inValue);
	}

	// You can also override toJSON
	toJSON()
	{
		var data = super.toJSON();
		delete data.password;
		return data;
	}
}
```

### Query Builder & Aggregates

**Aggregate**
```typescript
// Specify custom outputs for aggregates
class CustomCollection extends MongoCollection
{
	count: number;
}

CustomCollection.aggregate<CustomCollection>([
	{
		$group: {
			// ...
		}
	},
	{
		$project: {
			count: 1,
		}
	}
]).then( ... ) // Returns promise
```




**Query Builder**
```typescript
// Below query sets up an aggregation pipeline
UserModel.query<UserModel>({
		banned: false,
	})
	.where({status: 'Online'})
	.gte({upvotes: 100})
	.lte({downvotes: 10})
	.populate("friends")
	.forEach( user => {
		console.log("users online", user);
	});

	// ...
	.then((users) => {
		// Or use promise...
	})
	
```

**User Model Example & Password hashing**

UserModel.ts:
```typescript
import { Model, MongoCollection, Property, Hook } from "@xiara/mongo";
import { TimedCollection } from "./Base";
import { compareSync, genSaltSync, hashSync } from "bcrypt";

@Model("users")
export class UserModel extends MongoCollection
{
	@Property({ required: true, unique: true })
	username: string;

	@Property({ required: true, hidden: true })
	protected hashedPassword: string;

	get password(): string
	{
		return this.hashedPassword;
	}

	set password(inValue: string)
	{
		this.hashedPassword = hashSync(inValue, genSaltSync(10));
	}

	validatePassword(inPassword: string): boolean
	{
		return compareSync(inPassword, this.hashedPassword)
	}
}
```

App.ts
```typescript
import { UserModel } from "./UserModel";

let user = new UserModel();
user.username = "azarus";
user.password = "test";
user.save().catch( error => {
	console.log("error:", error);
})
UserModel.findOne<UserModel>({
	username: "azarus"
}).then( user => {
	console.log("Password valid:", user.validatePassword("test"));
})
```

## Have a question?
- [Open an issue. https://github.com/azarus/xiara-mongo/issues](https://github.com/azarus/xiara-mongo/issues)


## License
MIT

## Soon
- Plugins
- More Hooks
- More Features

