import { Recipe, Step, Item } from "./recipe";

export interface Response {
    status: "OK" | "error";
    message?: string;
}

export interface APIDependency {
    id: number;
    amount: number;
    unit: string;
    item: APIItem;
}

export interface APIStep {
    id: number;
    name: string;
    description?: string;
    dependencies: APIDependency[];
    result: APIDependency | null;
    sequence: number;
    verb: string;
}

export interface APIItem {
    id: number;
    itemName: string;
    description?: string;
}

export interface APIRecipe {
    id: number;
    recipeName: string;
    description?: string;
    steps: APIStep[];
    items: APIItem[];
}

export interface APIRecipeResponse extends Response {
    recipe: APIRecipe;
}

export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
