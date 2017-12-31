import "reflect-metadata";
import { CollectionCreateOptions } from "mongodb";
import { IModelOptions, IPropertyOptions } from "./MongoSchema";
export declare function Model(name: string, options?: IModelOptions, createOptions?: CollectionCreateOptions): (target: any) => void;
export declare function Property(fieldOptions?: IPropertyOptions): (target: any, key: string) => void;
export declare function Hook(hookName: string): (target: any, key: string) => void;
