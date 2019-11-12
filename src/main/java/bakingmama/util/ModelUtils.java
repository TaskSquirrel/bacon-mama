package bakingmama.util;

import bakingmama.models.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

/**
 * Wrapper for all the repository objects --
 *
 * Mainly consists of creation methods.
 */
@Component
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

  public Item addItem(String itemName, Recipe recipe) {
    Item item = new Item();
    item.setItemName(itemName);
    item.setRecipe(recipe);
    itemRepository.save(item);
    return item;
  }

  public Ingredient addIngredient(Item item, Step step, Double amount, String unit) {
    Ingredient ingredient = new Ingredient();
    ingredient.setItem(item);
    ingredient.setStep(step);
    ingredient.setAmount(amount);
    ingredient.setUnit(unit);
    ingredientRepository.save(ingredient);
    return ingredient;
  }

  public Step addStepNaive(Recipe recipe, Item result, String verb, Integer sequence) {
    Step step = new Step();
    step.setRecipe(recipe);
    step.setResultItem(result);
    step.setVerb(verb);
    step.setSequence(sequence);
    stepRepository.save(step);
    return step;
  }
}
