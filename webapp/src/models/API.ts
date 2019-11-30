export interface Response {
    status: "OK" | "error";
    message?: string;
}

export interface APIUserLogin extends Response {
    token: string;
    name: string;
    userID: string;
}

export interface APIDependency {
    id: number;
    amount: number;
    unit: string;
    item: APIItem;
}

export interface APIStep {
    id: number;
    title: string;
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

export interface APIRecipeList {
    id: number;
    recipeName: string;
    description?: string;
}

export interface APIRecipeResponse extends Response {
    recipe: APIRecipe;
}

export interface APIManyRecipeResponse extends Response {
    recipes: APIRecipeList[];
}

export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
