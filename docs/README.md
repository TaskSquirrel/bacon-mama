# Documentation

## Endpoints

All endpoints start with `/api`, and is `POST` unless specified otherwise.

| Endpoint | Input | Output | Function/Notes |
| -------- | ----- | ------ | -------------- |
| GET `/reset` | nothing | nothing | It DELETES ALL THE ROWS IN YOUR TABLE and then puts in some test data (inserts a User with username called `test-username` and password `test-password`) and a recipe |
| `/addRecipe` | JSON with `username`, `recipeName`, and `description` field | `id` of new recipe | Hit `/reset` and use User with `test-username` for testing and getting a dummy user in |
| `/addStep` | <code>{</code><br /><code>&nbsp;"id": &nbsp;"recipeIdHere, </code><br /><code> &nbsp;"step": {</code><br /><code>&nbsp;&nbsp;"verb": "mix", </code><br /><code> &nbsp;&nbsp;"sequence": 10, </code><br /><code>&nbsp;&nbsp;"item": {</code><br /><code>&nbsp;&nbsp;&nbsp;"id": "itemIdHere"</code><br /><code>&nbsp;&nbsp;}</code><br /><code>&nbsp;}</code><br /><code>}</code> | `id` of new step |
| `/addItem` | <code>{</code><br /><code>&nbsp;"id": &nbsp;"recipeIdHere, </code><br /><code> &nbsp;"item": {</code><br /><code>&nbsp;&nbsp;"name": "bread"</code><br /><code>&nbsp;}</code><br /><code>}</code>
| `/getRecipe` | JSON with `username` | All the recipe names and IDs for that user |
| `/getSteps` | JSON with `id`, which is the recipe ID | The entire recipe with steps |
| `/getItems` | JSON with `id`, which is still the recipe ID | The food items in the recipe in an array under `items` property |
