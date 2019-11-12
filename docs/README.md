# Documentation

## Endpoints

All endpoints start with `/api`, and is `POST` unless specified otherwise.

| Endpoint | Input | Output | Function/Notes |
| -------- | ----- | ------ | -------------- |
| GET `/reset` | nothing | nothing | It puts in some test data (inserts a User with username called `test-username` and password `test-password`) and a recipe |
|
| `/addRecipe` | JSON with `username`, `recipeName`, and `description` field | `id` of new recipe | Hit `/reset` and use User with `test-username` for testing and getting a dummy user in |
|
| `/addStep` | JSON with properties `id` (Recipe ID) and `step`, which contains an object with properties `verb`, `sequence`, and `item`, which is another nested object with an `id` | `id` of new step |
|
