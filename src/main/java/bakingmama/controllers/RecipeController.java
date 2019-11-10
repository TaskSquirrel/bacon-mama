package bakingmama.controllers;

import bakingmama.models.Recipe;
import bakingmama.models.RecipeRepository;
import bakingmama.models.User;
import bakingmama.models.UserRepository;

import org.springframework.web.bind.annotation.*;

import java.util.Collection;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

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

    User user = userRepository.findByUsername(username);

    if (user == null) {
      returnMap.put("status", "error");
      returnMap.put("message", "Failed to auth!");
      return returnMap;
    }

    Recipe newRecipe = new Recipe();
    newRecipe.setRecipeName(recipeName);
    newRecipe.setUser(user);
    recipeRepository.save(newRecipe);
    returnMap.put("success", true);

    return returnMap;
  }
}
