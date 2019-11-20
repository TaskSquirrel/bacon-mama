package bakingmama.controllers;

import bakingmama.models.*;
import bakingmama.util.JsonUtils;
import bakingmama.util.ModelUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import javax.persistence.EntityManager;
import javax.persistence.EntityManagerFactory;
import javax.persistence.EntityTransaction;
import java.util.*;

@RestController
public class ResetController implements BaseApiController {
  @Autowired
  private EntityManagerFactory emf;

  @Autowired
  UserRepository userRepository;
  @Autowired
  RecipeRepository recipeRepository;
  @Autowired
  IngredientRepository ingredientRepository;
  @Autowired
  ModelUtils mu;

  @CrossOrigin
  @GetMapping(path = "/reset", produces = "application/json")
  Map<String, Object> reset() {
    Map<String, Object> returnMap = new HashMap<>();

    // Possible exceptions:
    // utx.begin:
    // NotSupportedException | SystemException
    // utx.commit:
    // SecurityException | IllegalStateException | RollbackException | HeuristicMixedException | HeuristicRollbackException

    EntityManager em = emf.createEntityManager();
    EntityTransaction utx = em.getTransaction();
    try {
      utx.begin();

      em.createQuery("DELETE FROM Ingredient").executeUpdate();
      em.createQuery("DELETE FROM Step").executeUpdate();
      em.createQuery("DELETE FROM Item").executeUpdate();
      em.createQuery("DELETE FROM Recipe").executeUpdate();
      em.createQuery("DELETE FROM User").executeUpdate();

      utx.commit();

      this.makeUser();
      this.makeRecipe();
    } catch (Exception e) {
      String errorMessage = e.getMessage();
      JsonUtils.setStatus(returnMap, JsonUtils.ERROR, errorMessage);
    } finally {
      JsonUtils.setStatus(returnMap, JsonUtils.SUCCESS, "Reset successful!");
    }

    return returnMap;
  }

  // Makes dummy user
  void makeUser() {
    User newUser = new User();
    newUser.setUsername("test-username");
    newUser.setPassword("test-password");
    userRepository.save(newUser);
  }

  void makeRecipe() {
    User user = userRepository.findByUsername("test-username");

    // Make recipe and attach it to the user:
    Recipe newRecipe = mu.addRecipe(user, "test-recipeName", "test-recipeDescription");

    // Add some items for test recipe:
    Item eggs = mu.addItem("eggs", newRecipe);
    Item flour = mu.addItem("flour", newRecipe);
    Item dough = mu.addItem("dough", newRecipe);
    Item bread = mu.addItem("bread", newRecipe);

    Ingredient doughIng = mu.addIngredient(dough, null, 10d, "ounces");
    Ingredient breadIng = mu.addIngredient(bread, null, 100d, "pieces");

    // Add steps
    Step newStep1 = mu.addStep(newRecipe, doughIng, "mix", 1, "You are mixing",  new HashSet<>());
    Step newStep2 = mu.addStep(newRecipe, breadIng, "bake", 2, "You are baking", new HashSet<>());

    doughIng.setResultStep(newStep1);
    breadIng.setResultStep(newStep2);
    ingredientRepository.save(doughIng);
    ingredientRepository.save(breadIng);

    // Add ingredients to the steps:
    mu.addIngredient(eggs, newStep1, 3d, "");
    mu.addIngredient(flour, newStep1, 500d, "grams");
    mu.addIngredient(dough, newStep2, 10d, "ounces");
  }
}
