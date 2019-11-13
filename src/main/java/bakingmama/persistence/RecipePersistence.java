package bakingmama.persistence;

import bakingmama.models.Recipe;
import bakingmama.models.RecipeRepository;
import bakingmama.util.JsonUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.Map;
import java.util.Optional;

@Component
public class RecipePersistence {
  @Autowired
  RecipeRepository recipeRepository;

  public <T> T unpackOptional(Optional<T> op) {
    if (op.isEmpty()) {
      return null;
    } else {
      return op.get();
    }
  }

  public Recipe findRecipe(Long recipeId) {
    Optional<Recipe> optional = recipeRepository.findById(recipeId);
    return unpackOptional(optional);  }

  public Recipe findRecipe(Object recipeId) {
    return this.findRecipe(JsonUtils.parseId(recipeId));
  }

  public Recipe findRecipe(Map<String, Object> recipeJson) {
    return this.findRecipe(recipeJson.get("id"));
  }
}
