import { APIStep, APIRecipe, APIDependency, APIItem } from "../models/API";
import { Recipe, Dependency, Step, Item } from "../models/recipe";

function fromAPIDependency(
    { amount, unit, item: { itemName, id } }: APIDependency
): Dependency {
    return {
        amount,
        unit,
        item: {
            id: `${id}`,
            name: itemName
        }
    };
}

function fromAPIStep(
    { id, name, description, dependencies, result, verb, sequence }: APIStep
): Step {
    return {
        id: `${id}`,
        name,
        description,
        dependencies: dependencies.map(fromAPIDependency),
        result: result ? fromAPIDependency(result) : null,
        verb,
        sequence
    };
}

function fromAPIItem(
    { id, itemName }: APIItem
): Item {
    return {
        id: `${id}`,
        name: itemName
    };
}

export function fromAPIRecipe(
    { id, recipeName, description, steps, items }: APIRecipe
): Recipe {
    return {
        id: `${id}`,
        name: recipeName,
        description,
        steps: steps.map(fromAPIStep),
        items: items.map(fromAPIItem),
    };
}
