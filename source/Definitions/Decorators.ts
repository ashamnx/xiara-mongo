import 'reflect-metadata';
import {CollectionCreateOptions} from 'mongodb';
import {IModelOptions, IPropertyOptions, MongoSchema} from './MongoSchema';
import {MongoSchemaRegistry} from './MongoSchemaRegistry';

function resolveParentInheritors(target: any): any[] {
    let parent = Object.getPrototypeOf(target);
    if (!parent || !parent.name) {
        return [];
    }
    let inheritors = resolveParentInheritors(parent);
    inheritors.unshift(parent);
    return inheritors;
}

export function Model(name: string, options?: IModelOptions, createOptions?: CollectionCreateOptions) {
    return function (target: any) {
        if (!target.SchemaDefinition) {
            target.SchemaDefinition = new MongoSchema(target);
        }

        let parents = resolveParentInheritors(target);
        let schema: MongoSchema = MongoSchemaRegistry.getSchema(target.name);
        if (!schema) {
            schema = new MongoSchema(target);
            MongoSchemaRegistry.register(target.name, schema);
        }

        schema.name = name;
        schema.createOptions = createOptions;
        schema.inherits = parents;
        if (!options)
            return;

        if (options.indexes) {
            for (let index of options.indexes) {
                schema.addIndex(index);
            }
        }

        if (options.inherits) {
            schema.inherits.push.prototype.apply(options.inherits);
            //schema.inherits = options.inherits.concat(parents);
        }
    };
}

export function Property(fieldOptions: IPropertyOptions = {}) {
    return function (target: any, key: string) {
        let schema: MongoSchema = MongoSchemaRegistry.getSchema(target.constructor.name);
        if (!schema) {
            schema = new MongoSchema(target.constructor);
            MongoSchemaRegistry.register(target.constructor.name, schema);
        }
        schema.addField(key, Reflect.getMetadata('design:type', target, key), fieldOptions);
    };
}

export function Hook(hookName: string) {
    return function (target: any, key: string) {
        if (!target.SchemaDefinition) {
            target.SchemaDefinition = new MongoSchema(target);
        }
        let schema: MongoSchema = target.SchemaDefinition;
        schema.registerHook(hookName, target[key]);
    };
}

