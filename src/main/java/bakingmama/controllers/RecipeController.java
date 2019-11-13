package bakingmama.controllers;

import bakingmama.json.RecipeJson;
import bakingmama.models.*;

import bakingmama.persistence.RecipePersistence;
import bakingmama.persistence.StepPersistence;
import bakingmama.util.JsonUtils;
import bakingmama.util.ModelUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.config.AutowireCapableBeanFactory;
import org.springframework.web.bind.annotation.*;

import javax.persistence.EntityManager;
import java.util.*;

@RestController
public class RecipeController implements BaseApiController {
  @Autowired
  private UserRepository userRepository;
  @Autowired
  private RecipeRepository recipeRepository;
  @Autowired
  ModelUtils mu;
  @Autowired
  StepPersistence sp;
  @Autowired
  RecipePersistence rp;
  @Autowired
  EntityManager em;
  @Autowired
  AutowireCapableBeanFactory beanFactory;


  Recipe unpackOptional(Long id) {
    Optional<Recipe> optional = recipeRepository.findById(id);
    if (optional.isEmpty()) {
      return null;
    } else {
      return optional.get();
    }
  }

  private Map<String, Object> recipeSuccess(Map<String, Object> json) {
    Map<String, Object> map = new HashMap<>();
    RecipeJson rj = new RecipeJson(json, true);
    beanFactory.autowireBean(rj);

    Recipe recipe = rj.toModel();
    map.put("recipe", recipe.toMap());
    JsonUtils.setStatus(map, JsonUtils.SUCCESS);
    return map;
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
    String description = (String) body.get("description");

    // If user doesn't exist, don't allow recipe creation.
//    User user = userRepository.findByUsername(username);
//    if (user == null) {
//      JsonUtils.setStatus(returnMap, JsonUtils.ERROR, "User couldn't be found!");
//      return returnMap;
//    }

    Recipe newRecipe = mu.addRecipe(null, recipeName, description);
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
      path = "/getRecipe",
      consumes = "application/json",
      produces = "application/json"
  )
  Map<String, Object> getRecipe(@RequestBody Map<String, Object> body) {
    Map<String, Object> returnMap = new HashMap<>();

    Long id = JsonUtils.parseId(body.get("id"));

    // Check for recipe existence by ID.
    Recipe recipe = unpackOptional(id);
    if (recipe == null) {
      JsonUtils.setStatus(returnMap, JsonUtils.ERROR, "Recipe couldn't be found!");
      return returnMap;
    }

    returnMap.put("recipe", recipe.toMap());

    JsonUtils.setStatus(returnMap, JsonUtils.SUCCESS);
    return returnMap;
  }

  @CrossOrigin
  @PostMapping(
      path = "/addItem",
      consumes = "application/json",
      produces = "application/json"
  )
  Map<String, Object> addItem(@RequestBody Map<String, Object> body) {
    Map<String, Object> returnMap = new HashMap<>();

    // Grab Recipe ID
    Recipe recipe = rp.findRecipe(JsonUtils.castMap(body.get("recipe")));
    // Grab Item Stuff
    Map<String, Object> stepMap = JsonUtils.castMap(body.get("item"));
    String itemName = (String) stepMap.get("name");

    Item newItem = mu.addItem(itemName, recipe);
    returnMap.put("recipe", recipe.toMap());

    JsonUtils.setStatus(returnMap, JsonUtils.SUCCESS);
    return returnMap;
  }

  @CrossOrigin
  @PostMapping(path = "/editStep", consumes = "application/json", produces = "application/json")
  Map<String, Object> editStep(@RequestBody Map<String, Object> json) {
    sp.editStep(JsonUtils.castMap(json.get("step")));
    return this.recipeSuccess(json);
  }

  @CrossOrigin
  @PostMapping(path = "/addSteps", consumes = "application/json", produces = "application/json")
  Map<String, Object> addSteps(@RequestBody Map<String, Object> json) {
    Map<String, Object> returnJson = new HashMap<>();

    Long recipeID = JsonUtils.parseId(JsonUtils.castMap(json.get("recipe")).get("id"));
    Map<String, Object> newStep = JsonUtils.castMap(json.get("step"));

    Recipe recipe = sp.addStep(newStep, recipeRepository.getOne(recipeID), recipeID);
    recipeRepository.save(recipe);
    returnJson.put("recipe", recipe.toMap());

    JsonUtils.setStatus(returnJson, JsonUtils.SUCCESS);
    return returnJson;
  }

  @CrossOrigin
  @PostMapping(path = "/deleteStep", consumes = "application/json", produces = "application/json")
  Map<String, Object> deleteStep(@RequestBody Map<String, Object> json) {
    Map<String, Object> returnJson = new HashMap<>();

    Long recipeID = JsonUtils.parseId(JsonUtils.castMap(json.get("recipe")).get("id"));
    Map<String, Object> newStep = JsonUtils.castMap(json.get("step"));
    Long stepId = JsonUtils.parseId(newStep.get("id"));

    Recipe recipe = sp.deleteStep(stepId, recipeID);

    returnJson.put("recipe", recipe.toMap());

    JsonUtils.setStatus(returnJson, JsonUtils.SUCCESS);
    return returnJson;
  }
}
