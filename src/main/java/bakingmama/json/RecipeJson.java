package bakingmama.json;

import bakingmama.models.Recipe;
import bakingmama.persistence.RecipePersistence;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.Map;

public class RecipeJson extends BaseJson {
  @Autowired
  RecipePersistence rp;

  public RecipeJson(Map<String, Object> json) { super(json); }
  public RecipeJson(Map<String, Object> json, boolean filter) { super(json, "recipe"); }
  public RecipeJson(Object json) { super(json); }

  @Override
  public Recipe toModel() {
    return rp.findRecipe(this.json);
  }
}
