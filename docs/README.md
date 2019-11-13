# Documentation

## Endpoints

All endpoints start with `/api`, and is `POST` unless specified otherwise.

| Endpoint | Input | Output | Function/Notes |
| -------- | ----- | ------ | -------------- |
| GET `/reset` | nothing | nothing | It DELETES ALL THE ROWS IN YOUR TABLE and then puts in some test data (inserts a User with username called `test-username` and password `test-password`) and a recipe |
| `/addRecipe` | JSON with `username`, `recipeName`, and `description` field | `id` of new recipe | Hit `/reset` and use User with `test-username` for testing and getting a dummy user in |
| `/addStep` | <code>{</code><br /><code>&nbsp;"id":"recipeIdHere",</code><br /><code> &nbsp;"step": {</code><br /><code>&nbsp;&nbsp;"verb": "mix", </code><br /><code> &nbsp;&nbsp;"sequence": 10, </code><br /><code>&nbsp;&nbsp;"item": {</code><br /><code>&nbsp;&nbsp;&nbsp;"id": "itemIdHere"</code><br /><code>&nbsp;&nbsp;}</code><br /><code>&nbsp;}</code><br /><code>}</code> | `id` of new step |
| `/addItem` | <code>{</code><br /><code>&nbsp;"id": &nbsp;"recipeIdHere, </code><br /><code> &nbsp;"item": {</code><br /><code>&nbsp;&nbsp;"name": "bread"</code><br /><code>&nbsp;}</code><br /><code>}</code>
| `/addIngredient` | 
| `/getRecipes` | JSON with `username` | All the recipe names and IDs for that user |
| `/getRecipe` | JSON with `id` | All the relevant recipe data -- basically the steps and items | Could probably ignore the `/getSteps` and `/getItems` endpoint |
| `/getSteps` | JSON with `id`, which is the recipe ID | The entire recipe with steps | DEPRECATED
| `/getItems` | JSON with `id`, which is still the recipe ID | The food items in the recipe in an array under `items` property |

### Steps-related Endpoints

All steps related endpoints should look like:

* Input: Add Step

```
{
    "step": { 
        "result": {
                    "itemName": "bread",
                    "id": 123
                },
                "sequence": 1,
                "verb": "mix",
                "ingredients": [
                    {
                        "item": {
                            "itemName": "dough",
                            "id": 271
                        },
                        "amount": 1000.90,
                        "unit": "ounces",
                        "id": 277
                    }
                ]
		}
    },
    "recipe": {
        "id": 123
    }
}
```

* Input: Edit Step

```
{
    "step": { 
        "result": {
                    "itemName": "bread",
                    "id": 123
                },
                "sequence": 1,
                "verb": "mix",
                "ingredients": [
                    {
                        "item": {
                            "itemName": "dough",
                            "id": 271
                        },
                        "amount": 1000.90,
                        "unit": "ounces",
                        "id": 277
                    }
                ]
                "id" : 123;
		}
    },
    "recipe": {
        "id": 123
    }
}
```

* Input: Delete Step

```
{
    "step": { 
          "id" : 123;
    },
    "recipe": {
        "id": 123
    }
}
```

This way all input looks like the same throughout and is consistent.
