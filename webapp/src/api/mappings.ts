import { APIStep, APIRecipe, APIDependency, APIItem } from "../models/API";
import { Recipe, Dependency, Step, Item } from "../models/recipe";

function fromAPIDependency(
    { id: dependencyID, amount, unit, item: { itemName, id } }: APIDependency
): Dependency {
    return {
        id: `${dependencyID}`,
        amount,
        unit,
        item: {
            id: `${id}`,
            name: itemName
        }
    };
}

function fromAPIStep(
    { id, title, description, dependencies, result, verb, sequence }: APIStep
): Step {
    return {
        id: `${id}`,
        name: title,
        description,
        dependencies: dependencies.map(fromAPIDependency),
        result: result ? fromAPIDependency(result) : null,
        verb,
        sequence
    };
}

function fromAPIItem(
    { id, itemName, image }: APIItem
): Item {
    return {
        id: `${id}`,
        name: itemName,
        image,
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
        items: items.map(fromAPIItem)
    };
}
