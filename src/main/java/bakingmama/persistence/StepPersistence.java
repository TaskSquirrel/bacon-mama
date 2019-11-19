package bakingmama.persistence;

import bakingmama.json.IngredientJson;
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

  public Step findStep(Map<String, Object> stepJson) { return this.findStep(stepJson.get("id")); }

  public Item findItem(Long itemId) {
    Optional<Item> optional = itemRepository.findById(itemId);
    return unpackOptional(optional);
  }

  public boolean clearIngredients(Step step) {
    for (Ingredient ingredient : step.getIngredients()) {
      ingredientRepository.delete(ingredient);
    }
    return true;
  }

  public Ingredient addResultIngredient(IngredientJson ij, Step resultStep) {
    // If the current step has no ingredient...
    if (resultStep.getResultIngredient() != null) {
      ingredientRepository.delete(resultStep.getResultIngredient());
    }
    // If no ingredient was passed in:
    if (ij == null) {
      return null;
    }
    Ingredient ing = this.addIngredient(ij, null);
    ing.setResultStep(resultStep);
    ingredientRepository.save(ing);
    return ing;
  }

  public Ingredient addIngredient(IngredientJson ij, Step step) {
    return mu.addIngredient(ij.getItem(), step, ij.getAmount(), ij.getUnit());
  }

  /**
   * Given a JSON with all the step properties, edit and save the step.
   */
  public boolean editStep(Map<String, Object> json) {
    StepJson stepJson = new StepJson(json, true);
    IngredientJson ingredientJson = stepJson.getResultJson();
    beanFactory.autowireBean(stepJson);
    beanFactory.autowireBean(ingredientJson);

    // Edit step and save into DB
    Step step = stepJson.toModel();
    step.edit(stepJson.getVerb(), stepJson.getSequence(), addResultIngredient(ingredientJson, step));
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

  public Recipe deleteStep(Long stepId, Long recipeId) {
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
      IngredientJson ij = new IngredientJson(ingredientMap);
      beanFactory.autowireBean(ij);
      Ingredient ingredient = this.addIngredient(ij, step);
      ingredientsSet.add(ingredient);
    }
    return ingredientsSet;
  }
}
