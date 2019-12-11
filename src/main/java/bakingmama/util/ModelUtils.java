package bakingmama.util;

import bakingmama.models.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.Set;

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

  public Recipe addRecipe(User user, String name, String description) {
    Recipe recipe = new Recipe();
    recipe.setUser(user);
    recipe.setRecipeName(name);
    recipe.setDescription(description);
    recipeRepository.save(recipe);
    return recipe;
  }

  public Recipe editRecipe(Recipe recipe, String name, String description)
  {
    recipe.setRecipeName(name);
    recipe.setDescription(description);
    recipeRepository.save(recipe);
    return recipe;
  }

  public boolean deleteRecipe(Recipe recipe)
  {
    Set<Step> steps = recipe.getSteps();
    Set<Item> items = recipe.getItems();
    for(Step step : steps)
    {
      Set<Ingredient> ingredients= step.getIngredients();
      Ingredient result = step.getResultIngredient();
      if(result != null)
      {
        ingredientRepository.delete(result);
      }
      for(Ingredient ingredient : ingredients)
      {
        ingredientRepository.delete(ingredient);
      }
    }
    for(Item item : items)
    {
      itemRepository.delete(item);
    }
    recipeRepository.delete(recipe);
    return true;
  }

  public Item addItem(String itemName, Recipe recipe, Image image) {
    Item item = new Item();
    item.setItemName(itemName);
    item.setRecipe(recipe);
    item.setImage(image);
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

  public Step addStep(Recipe recipe, Ingredient result, String verb, Integer sequence, String description, Set<Ingredient> ingredientSet, String title) {
    Step step = new Step();
    step.setRecipe(recipe);
    step.setResultIngredient(result);
    step.setVerb(verb);
    step.setSequence(sequence);
    step.setDescription(description);
    step.setIngredients(ingredientSet);
    step.setTitle(title);
    stepRepository.save(step);
    return step;
  }
}
