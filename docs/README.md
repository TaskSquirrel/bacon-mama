# Documentation

## Endpoints

All endpoints start with `/api`, and is `POST` unless specified otherwise.

| Endpoint | Input | Output | Function/Notes |
| -------- | ----- | ------ | -------------- |
| GET `/reset` | nothing | nothing | It puts in some test data (inserts a User with username called `test-username` and password `test-password`) and a recipe |
| `/addRecipe` | JSON with `username`, `recipeName`, and `description` field | `id` of new recipe | Hit `/reset` and use User with `test-username` for testing and getting a dummy user in |
| `/addStep` | <code>{</code><br /><code>&nbsp;"id": &nbsp;"recipeIdHere, </code><br /><code> &nbsp;"step": {</code><br /><code>&nbsp;&nbsp;"verb": "mix", </code><br /><code> &nbsp;&nbsp;"sequence": 10, </code><br /><code>&nbsp;&nbsp;"item": {</code><br /><code>&nbsp;&nbsp;&nbsp;"id": "itemIdHere"</code><br /><code>&nbsp;&nbsp;}</code><br /><code>&nbsp;}</code><br /><code>}</code> | `id` of new step |