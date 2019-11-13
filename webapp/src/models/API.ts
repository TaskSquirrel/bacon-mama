import { Recipe, Step, Item } from "./recipe";

export interface Response {
    status: "OK" | "error";
    message?: string;
}

export interface APIRecipeResponse extends Response {
    recipe: {
        recipeName: string;
        description?: string;
        steps: Step[];
        items: Item[];
        id: number;
    };
}

export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
