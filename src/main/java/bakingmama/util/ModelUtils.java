package bakingmama.util;

import bakingmama.models.*;
import org.springframework.beans.factory.annotation.Autowired;

public class ModelUtils {
  @Autowired
  UserRepository userRepository;
  @Autowired
  RecipeRepository recipeRepository;
  @Autowired
  StepRepository stepRepository;
  @Autowired
  ItemRepository itemRepository;
  @Autowired
  IngredientRepository ingredientRepository;
}
