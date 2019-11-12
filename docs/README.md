# Documentation

## Endpoints

All endpoints start with `/api`, and is `POST` unless specified otherwise.

| Endpoint | Input | Output | Function/Notes |
| -------- | ----- | ------ | -------------- |
| GET `/reset` | nothing | nothing | It puts in some test data (inserts a User with username called `test-username` and password `test-password`) and a recipe |
| `/addRecipe` | JSON with `username`, `recipeName`, and `description` field | `id` of new recipe | Hit `/reset` and use User with `test-username` for testing and getting a dummy user in |
| `/addStep` | <code>{<br />&nbsp;"id": &nbsp;"recipeIdHere, <br /> &nbsp;"step": {<br />&nbsp;&nbsp;"verb": "mix", <br /> &nbsp;&nbsp;"sequence": 10, <br />&nbsp;&nbsp;"item": {<br />&nbsp;&nbsp;&nbsp;"id": "itemIdHere"<br />&nbsp;&nbsp;}<br />&nbsp;}<br />}</code> | `id` of new step |
