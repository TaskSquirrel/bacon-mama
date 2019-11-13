import { APIRecipeResponse } from "../models/API";
import { Recipe } from "../models/recipe";

export function toRecipe(response: APIRecipeResponse) {
    const { recipe } = response;

    return {
        id: `${recipe.id}`,
        name: recipe.recipeName,
        description: recipe.description,
        steps: recipe.steps,
        items: recipe.items
    } as Recipe;
}
