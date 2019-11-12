package bakingmama.controllers;

import bakingmama.models.*;

import bakingmama.util.JavaUtils;
import bakingmama.util.JsonUtils;
import bakingmama.util.ModelUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
public class RecipeController implements BaseApiController {
  @Autowired
  private UserRepository userRepository;
  @Autowired
  private RecipeRepository recipeRepository;
  @Autowired
  private ItemRepository itemRepository;
  @Autowired
  ModelUtils mu;

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
    String description = (String) body.get("description");

    // If user doesn't exist, don't allow recipe creation.
    User user = userRepository.findByUsername(username);
    if (user == null) {
      JsonUtils.setStatus(returnMap, JsonUtils.ERROR, "User couldn't be found!");
      return returnMap;
    }

    Recipe newRecipe = mu.addRecipe(user, recipeName, description);
    returnMap.put("id", newRecipe.getId());

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
      recipes.add(recipe.toMapOverview());
    }

    JsonUtils.setStatus(returnMap, JsonUtils.SUCCESS);
    return returnMap;
  }

  @CrossOrigin
  @PostMapping(
      path = "/addStep",
      consumes = "application/json",
      produces = "application/json"
  )
  Map<String, Object> addStep(@RequestBody Map<String, Object> body) {
    Map<String, Object> returnMap = new HashMap<>();

    // Grab Recipe ID
    Long id = JsonUtils.parseId(body.get("id"));
    // Grab Step Stuff
    Map<String, Object> stepMap = JsonUtils.castMap(body.get("step"));
    Map<String, Object> itemMap = JsonUtils.castMap(stepMap.get("item"));
    Item item = JavaUtils.findAndUnpack(itemRepository, itemMap.get("id"));
    String verb = (String) stepMap.get("verb");
    Integer sequence = (Integer) stepMap.get("sequence");

    // Check for recipe existence by ID.
    Optional<Recipe> oRecipe = recipeRepository.findById(id);
    if (oRecipe.isEmpty()) {
      JsonUtils.setStatus(returnMap, JsonUtils.ERROR, "Recipe couldn't be found!");
      return returnMap;
    }

    Recipe recipe = oRecipe.get();
    Step newStep = mu.addStepNaive(recipe, item, verb, sequence);
    returnMap.put("id", newStep.getId());

    JsonUtils.setStatus(returnMap, JsonUtils.SUCCESS);
    return returnMap;
  }

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
    returnMap.put("recipe", recipe.toMap());

    JsonUtils.setStatus(returnMap, JsonUtils.SUCCESS);
    return returnMap;
  }
}
