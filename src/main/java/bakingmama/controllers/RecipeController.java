package bakingmama.controllers;

import bakingmama.models.*;

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
      recipeMap.put("id", recipe.getId());
      recipeMap.put("recipeName", recipe.getRecipeName());

      recipes.add(recipeMap);
    }

    JsonUtils.setStatus(returnMap, JsonUtils.SUCCESS);
    return returnMap;
  }

  /**
   * Gets all the steps of a recipe.
   */
  @CrossOrigin
  @PostMapping(
      path = "/getSteps",
      consumes = "application/json",
      produces = "application/json"
  )
  Map<String, Object> getSteps(@RequestBody Map<String, Object> body) {
    Map<String, Object> returnMap = new HashMap<>();

    Long id = JsonUtils.parseId(body.get("id"));

    // Check for recipe existence by ID.
    Optional<Recipe> oRecipe = recipeRepository.findById(id);
    if (oRecipe.isEmpty()) {
      JsonUtils.setStatus(returnMap, JsonUtils.ERROR, "Recipe couldn't be found!");
      return returnMap;
    }

    Recipe recipe = oRecipe.get();
    List<Map<String, Object>> steps = new ArrayList<>();
    returnMap.put("steps", steps);
    for (Step step : recipe.getSteps()) {
      HashMap<String, Object> stepMap = new HashMap<>();
      stepMap.put("id", step.getId());

      steps.add(stepMap);
    }

    JsonUtils.setStatus(returnMap, JsonUtils.SUCCESS);
    return returnMap;
  }
}
