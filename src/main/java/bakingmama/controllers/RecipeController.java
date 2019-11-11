package bakingmama.controllers;

import bakingmama.models.Recipe;
import bakingmama.models.RecipeRepository;
import bakingmama.models.User;
import bakingmama.models.UserRepository;

import bakingmama.util.JsonUtils;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
public class RecipeController implements BaseApiController {
  private UserRepository userRepository;
  private RecipeRepository recipeRepository;

  public RecipeController(
      UserRepository userRepository,
      RecipeRepository recipeRepository
  ) {
    this.userRepository = userRepository;
    this.recipeRepository = recipeRepository;
  }

  @CrossOrigin
  @PostMapping(
      path = "/addRecipe",
      consumes = "application/json",
      produces = "application/json"
  )
  Map<String, Object> addRecipe(@RequestBody Map<String, Object> body) {
    Map<String, Object> returnMap = new HashMap<>();

    String username = (String) body.get("username");
    String recipeName = (String) body.get("recipeName");

    // If user doesn't exist, don't allow recipe creation.
    User user = userRepository.findByUsername(username);
    if (user == null) {
      JsonUtils.setStatus(returnMap, JsonUtils.ERROR, "User couldn't be found!");
      return returnMap;
    }

    Recipe newRecipe = new Recipe();
    newRecipe.setRecipeName(recipeName);
    newRecipe.setUser(user);
    recipeRepository.save(newRecipe);

    JsonUtils.setStatus(returnMap, JsonUtils.SUCCESS);
    return returnMap;
  }

  @CrossOrigin
  @PostMapping(
      path = "/getRecipes",
      consumes = "application/json",
      produces = "application/json"
  )
  Map<String, Object> getRecipes(@RequestBody Map<String, Object> body) {
    Map<String, Object> returnMap = new HashMap<>();

    String username = (String) body.get("username");

    // If user doesn't exist, don't allow recipe creation.
    User user = userRepository.findByUsername(username);
    if (user == null) {
      JsonUtils.setStatus(returnMap, JsonUtils.ERROR, "User couldn't be found!");
      return returnMap;
    }

    List<Map<String, Object>> recipes = new ArrayList<>();
    returnMap.put("recipes", recipes);
    for (Recipe recipe : user.getRecipes()) {
      HashMap<String, Object> recipeMap = new HashMap<>();
      recipeMap.put("recipeName", recipe.getRecipeName());

      recipes.add(recipeMap);
    }

    JsonUtils.setStatus(returnMap, JsonUtils.SUCCESS);
    return returnMap;
  }
}
