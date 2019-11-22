package bakingmama.controllers;

import bakingmama.json.RecipeJson;
import bakingmama.models.*;

import bakingmama.persistence.RecipePersistence;
import bakingmama.persistence.StepPersistence;
import bakingmama.util.JsonUtils;
import bakingmama.util.ModelUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.config.AutowireCapableBeanFactory;
import org.springframework.http.HttpHeaders;
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
    if (!optional.isPresent()) {
      return null;
    } else {
      return optional.get();
    }
  }

  private Map<String, Object> recipeSuccess(RecipeJson rj) {
    Map<String, Object> map = new HashMap<>();
    Recipe recipe = rj.toModel();

    map.put("recipe", recipe.toMap());
    JsonUtils.setStatus(map, JsonUtils.SUCCESS);
    return map;
  }

  private Map<String, Object> recipeSuccess(Map<String, Object> json) {
    RecipeJson rj = new RecipeJson(json, true);
    beanFactory.autowireBean(rj);

    return this.recipeSuccess(rj);
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
      path = "/editRecipe",
      consumes = "application/json",
      produces = "application/json"
  )
  Map<String, Object> editRecipe(@RequestBody Map<String, Object> body, @RequestHeader HttpHeaders headers) {
    // Pre-processing:
    System.out.println("Recieved Auth: " + headers.get(HttpHeaders.AUTHORIZATION).get(0));

    Map<String, Object> returnMap = new HashMap<>();

    Recipe recipe = rp.findRecipe(JsonUtils.castMap(body.get("recipe")));

    Map<String, Object> newRecipe = JsonUtils.castMap(body.get("editRecipe"));
    String recipeName = (String) newRecipe.get("recipeName");
    String description = (String) newRecipe.get("description");

    recipe = mu.editRecipe(recipe, recipeName, description);
    returnMap.put("recipe", recipe.toMap());

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

    RecipeJson rj = new RecipeJson(body);
    beanFactory.autowireBean(rj);

    Recipe recipe = rj.toModel();
    if (recipe == null) {
      JsonUtils.setStatus(returnMap, JsonUtils.ERROR, "Recipe couldn't be found!");
      return returnMap;
    }

    return this.recipeSuccess(rj);
  }

  @CrossOrigin
  @PostMapping(
      path = "/deleteRecipe",
      consumes = "application/json",
      produces = "application/json"
  )
  Map<String, Object> deleteRecipe(@RequestBody Map<String, Object> body) {
    Map<String, Object> returnMap = new HashMap<>();
    RecipeJson rj = new RecipeJson(body, true);
    beanFactory.autowireBean(rj);

    Recipe recipe = rj.toModel();
    if (recipe == null) {
      JsonUtils.setStatus(returnMap, JsonUtils.ERROR, "Recipe does not exist!");
      return returnMap;
    }

    try {
      mu.deleteRecipe(recipe);
      JsonUtils.setStatus(returnMap, JsonUtils.SUCCESS);
    } catch (Exception e) {
      JsonUtils.setStatus(returnMap, JsonUtils.ERROR, e.getMessage());
    }
    return returnMap;
  }

  @CrossOrigin
  @PostMapping(
      path = "/addItem",
      consumes = "application/json",
      produces = "application/json"
  )
  Map<String, Object> addItem(@RequestBody Map<String, Object> body) {
    try {
      // Grab Recipe ID
      Recipe recipe = rp.findRecipe(JsonUtils.castMap(body.get("recipe")));
      // Grab Item Stuff
      Map<String, Object> stepMap = JsonUtils.castMap(body.get("item"));
      String itemName = (String) stepMap.get("name");

      Item newItem = mu.addItem(itemName, recipe);
    } catch (Exception e) {
      return JsonUtils.returnError(e.getMessage());
    }
    return this.recipeSuccess(body);
  }

  @CrossOrigin
  @PostMapping(path = "/editStep", consumes = "application/json", produces = "application/json")
  Map<String, Object> editStep(@RequestBody Map<String, Object> json) {
    try {
      sp.editStep(json);
    } catch (Exception e) {
      return JsonUtils.returnError(e.getMessage());
    }
    return this.recipeSuccess(json);
  }

  @CrossOrigin
  @PostMapping(path = "/addStep", consumes = "application/json", produces = "application/json")
  Map<String, Object> addStep(@RequestBody Map<String, Object> json) {
    try {
      sp.addStep(json);
    } catch (Exception e) {
      return JsonUtils.returnError(e.getMessage());
    }
    return this.recipeSuccess(json);
  }

  @CrossOrigin
  @PostMapping(path = "/deleteStep", consumes = "application/json", produces = "application/json")
  Map<String, Object> deleteStep(@RequestBody Map<String, Object> json) {
    try {
      sp.deleteStep(json);
    } catch (Exception e) {
      return JsonUtils.returnError(e.getMessage());
    }
    return this.recipeSuccess(json);
  }
}
