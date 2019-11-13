package bakingmama.persistence;

import bakingmama.models.*;
import bakingmama.util.JsonUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Propagation;

import javax.transaction.Transactional;
import java.util.*;

@Component
public class StepPersistence {
  @Autowired
  StepRepository stepRepository;
  @Autowired
  ItemRepository itemRepository;
  @Autowired
  IngredientRepository ingredientRepository;
  @Autowired
  RecipeRepository recipeRepository;

  public <T> T unpackOptional(Optional<T> op) {
    if (op.isEmpty()) {
      return null;
    } else {
      return op.get();
    }
  }

  public Step findStep(Long stepId) {
    Optional<Step> optional = stepRepository.findById(stepId);
    return unpackOptional(optional);
  }

  public Step findStep(Object stepId) {
    return this.findStep(JsonUtils.parseId(stepId));
  }

  public Item findItem(Long itemId) {
    Optional<Item> optional = itemRepository.findById(itemId);
    return unpackOptional(optional);
  }

  public Item findItem(Object itemId) { return this.findItem(JsonUtils.parseId(itemId)); }

  public Item findItem(Map<String, Object> itemJson) {
    return this.findItem(itemJson.get("id"));
  }

  public boolean clearIngredients(Step step) {
    for (Ingredient ingredient : step.getIngredients()) {
      ingredientRepository.delete(ingredient);
    }
    return true;
  }

  public Ingredient addIngredient(Step step, Item item, Double amount, String unit) {
    Ingredient ingredient = new Ingredient();
    ingredient.setStep(step);
    ingredient.setItem(item);
    ingredient.setAmount(amount);
    ingredient.setUnit(unit);
    ingredientRepository.save(ingredient);
    return ingredient;
  }

  public Ingredient addIngredient(Step step, Map<String, Object> ingredientMap) {
    Item item = this.findItem(JsonUtils.castMap(ingredientMap.get("item")));
    Double amount = (Double) ingredientMap.get("amount");
    String unit = (String) ingredientMap.get("unit");
    return this.addIngredient(step, item, amount, unit);
  }

  /**
   * Given a JSON with all the step properties, edit and save the step.
   */
  public boolean editStep(Map<String, Object> stepJson) {
//    Map<String, Object> stepJson = JsonUtils.castMap(json.get("step"));
    Step step = this.findStep(stepJson.get("id"));

    // Find Result Item
    Map<String, Object> resultItemJson = JsonUtils.castMap(stepJson.get("result"));
    Item resultItem = this.findItem(resultItemJson.get("id"));
    // Get other Step properties
    String verb = (String) stepJson.get("verb");
    Integer sequence = (Integer) stepJson.get("sequence");

    // Edit step, Delete ingredients, and save into DB
    step.edit(verb, sequence, resultItem);
    stepRepository.save(step);
    this.clearIngredients(step);

    // Add ingredients associated with new Step
    Set<Ingredient> ingredientsSet = this.addIngredients(step, JsonUtils.castListMap(stepJson.get("ingredients")));
    step.setIngredients(ingredientsSet);
    stepRepository.save(step);

    return true;
  }

  public Recipe addStep(Map<String, Object> newStep, Recipe recipe, Long id){
    // Find Result Item
    //Map<String, Object> resultItemJson = JsonUtils.castMap(newStep.get("result"));
    
    // Get other Step properties
    Map<String, Object> resultItem = JsonUtils.castMap(newStep.get("result"));
    Item resultItem2 = this.findItem(resultItem.get("id"));
    String verb = (String) newStep.get("verb");
    Integer sequence = (Integer) newStep.get("sequence");

    //Creating New Step
    Step addedStep = new Step();
    addedStep.setRecipe(recipe);
    addedStep.edit(verb, sequence, resultItem2);
    stepRepository.save(addedStep);
    Long skipId = addedStep.getId();
    Set<Ingredient> ingredientsSet = this.addIngredients(addedStep, JsonUtils.castListMap(newStep.get("ingredients")));
    addedStep.setIngredients(ingredientsSet);

    //Incrementing steps in front of this step
    Set<Step> recipeSteps = recipe.getSteps();
    for(Step step : recipeSteps)
    {
      if(step.getSequence() >= sequence && !(step.getId().equals(skipId)))
      {
        step.setSequence(step.getSequence() + 1);
        stepRepository.save(step);
      }
    }

    //adding step to list and setting it to the recipe
    recipeSteps.add(addedStep);
    recipe.setSteps(recipeSteps);

    //saving the step into respository
    stepRepository.save(addedStep);

    return recipe;
  }

  public Set<Ingredient> addIngredients(Step step, List<Map<String, Object>> ingredientsList) {
    Set<Ingredient> ingredientsSet = new HashSet<>();
    for (Map<String, Object> ingredientMap : ingredientsList) {
      Ingredient ingredient = this.addIngredient(step, ingredientMap);
      ingredientsSet.add(ingredient);
    }
    return ingredientsSet;
  }
}
