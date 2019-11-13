package bakingmama.persistence;

import bakingmama.json.RecipeJson;
import bakingmama.json.StepJson;
import bakingmama.models.*;
import bakingmama.util.JsonUtils;
import bakingmama.util.ModelUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.config.AutowireCapableBeanFactory;
import org.springframework.stereotype.Component;

import java.util.*;

@Component
public class StepPersistence {
  @Autowired
  AutowireCapableBeanFactory beanFactory;

  @Autowired
  StepRepository stepRepository;
  @Autowired
  ItemRepository itemRepository;
  @Autowired
  IngredientRepository ingredientRepository;
  @Autowired
  RecipeRepository recipeRepository;
  @Autowired
  ModelUtils mu;

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
  public boolean editStep(Map<String, Object> json) {
    StepJson stepJson = new StepJson(json, true);
    beanFactory.autowireBean(stepJson);

    // Edit step and save into DB
    Step step = stepJson.toModel();
    step.edit(stepJson.getVerb(), stepJson.getSequence(), stepJson.getResult());
    stepRepository.save(step);

    // Delete old ingredients and add new ingredients with new Step
    this.clearIngredients(step);
    Set<Ingredient> ingredientsSet = this.addIngredients(step, stepJson.getIngredients());
    step.setIngredients(ingredientsSet);
    stepRepository.save(step);

    return true;
  }

  public boolean addStep(Map<String, Object> json) {
    StepJson stepJson = new StepJson(json, true);
    RecipeJson recipeJson = new RecipeJson(json, true);
    beanFactory.autowireBean(stepJson);
    beanFactory.autowireBean(recipeJson);

    // Get associated Recipe and create new Step
    Recipe recipe = recipeJson.toModel();
    Step addedStep = mu.addStep(recipe, null, "", stepJson.getSequence(), new HashSet<>());
    Long addedStepId = addedStep.getId();

    // Adjust order where necessary
    Set<Step> recipeSteps = recipe.getSteps();
    for (Step step : recipeSteps) {
      if (step.getSequence() >= addedStep.getSequence() && !(step.getId().equals(addedStepId))) {
        step.setSequence(step.getSequence() + 1);
        stepRepository.save(step);
      }
    }

    // Save new step
    recipeSteps.add(addedStep);
    recipe.setSteps(recipeSteps);
    recipeRepository.save(recipe);

    return true;
  }

  public Recipe deleteStep(Long stepId, Long recipeId)
  {
    Recipe recipe = recipeRepository.getOne(recipeId);
    Step deleteStep = stepRepository.getOne(stepId);
    Integer pivot = deleteStep.getSequence();
    
    stepRepository.deleteById(stepId);

    Set<Step> recipeSteps = recipe.getSteps();
    for(Step step : recipeSteps)
    {
      if(step.getSequence() >= pivot)
      {
        step.setSequence(step.getSequence() - 1);
        stepRepository.save(step);
      }
    }

    //adding step to list and setting it to the recipe
    recipe.setSteps(recipeSteps);

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
