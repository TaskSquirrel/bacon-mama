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

    // Add steps
    Step newStep1 = mu.addStepNaive(newRecipe, dough, "mix", 1);
    Step newStep2 = mu.addStepNaive(newRecipe, bread, "bake", 2);

    // Add ingredients to the steps:
    mu.addIngredient(eggs, newStep1, 3d, "");
    mu.addIngredient(flour, newStep1, 500d, "grams");
    mu.addIngredient(dough, newStep2, 10d, "ounces");
  }
}
