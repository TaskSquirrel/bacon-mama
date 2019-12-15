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
  @Autowired
  ImageRepository imageRepository;
  @Autowired
  HistoryRepository historyRepository;

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

    String description = "";
    String descriptionFromRequest = (String) body.get("description");

    if (descriptionFromRequest != null) {
      description = descriptionFromRequest;
    }

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
  Map<String, Object> editRecipe(@RequestBody Map<String, Object> body, @RequestHeader HttpHeaders headers, @RequestAttribute("userName") String userName) {
    // Pre-processing:
    System.out.println("Recieved Auth: " + headers.get(HttpHeaders.AUTHORIZATION).get(0));

    Map<String, Object> returnMap = new HashMap<>();

    Recipe recipe = rp.findRecipe(JsonUtils.castMap(body.get("recipe")));

    Map<String, Object> newRecipe = JsonUtils.castMap(body.get("replace"));
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

    if (user.getRole() != null && user.getRole().equals("professor")){
      List<Map<String, Object>> recipes = new ArrayList<>();
      returnMap.put("recipes", recipes);
      for (Recipe recipe : user.getRecipes()) {
        recipes.add(recipe.toMapOverview());
      }
    }
    else
    {
      List<Map<String, Object>> recipes = new ArrayList<>();
      returnMap.put("recipes", recipes);
      Set<Course> courses = user.getCourses();
      List<History> userHistory = historyRepository.findByStudentId(user.getId());
      for(Course course : courses)
      {
        Set<Recipe> recipeInCourse = course.getRecipes();
        for(Recipe recipe : recipeInCourse)
        {
          boolean inHistory = false;
          for(History history : userHistory)
          {
            Long historyID = history.getRecipeId();

            if (historyID == null) {
                continue;
            }

            if(history.getRecipeId().equals(recipe.getId()))
            {
              recipes.add(recipe.toMapOverview(true));
              inHistory = true;
              break;
            }
          }
          if(!inHistory){
            recipes.add(recipe.toMapOverview(false));
          }
        }
      }
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
      Map<String, Object> itemMap = JsonUtils.castMap(body.get("item"));
      String itemName = (String) itemMap.get("name");

      Image image = null;
      if (itemMap.containsKey("image")) {
        Object imageValue = itemMap.get("image");
        if (imageValue != null) {
          Long imageID = JsonUtils.parseId(itemMap.get("image"));
          image = imageRepository.getOne(imageID);
        }
      }

      Item newItem = mu.addItem(itemName, recipe, image);
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

  @CrossOrigin
  @PostMapping(path = "/completeRecipe", consumes = "application/json", produces = "application/json")
  Map<String, Object> completeRecipe(@RequestBody Map<String, Object> json, @RequestAttribute("userID") String userID) {
    try {
      Long studentId = JsonUtils.parseId(userID);
      Long recipeId = JsonUtils.parseId(json.get("recipeId"));

      if (studentId == null || recipeId == null) {
        throw new Exception("Failed to add history!");
      }

      History h = new History();
      h.setRecipeId(recipeId);
      h.setStudentId(studentId);
      h.setStatus("complete");
      historyRepository.save(h);
    } catch (Exception e) {
      return JsonUtils.returnError(e.getMessage());
    }
    return JsonUtils.returnSuccess();
  }
}
