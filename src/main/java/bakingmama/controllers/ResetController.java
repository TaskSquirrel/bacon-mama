package bakingmama.controllers;

import bakingmama.models.*;
import bakingmama.util.JsonUtils;
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
  StepRepository stepRepository;
  @Autowired
  ItemRepository itemRepository;
  @Autowired
  IngredientRepository ingredientRepository;

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
    Recipe newRecipe = new Recipe();
    newRecipe.setRecipeName("test-recipeName");
    newRecipe.setDescription("test-recipeDescription");
    newRecipe.setUser(user);
    recipeRepository.save(newRecipe);

    // Add some items for test recipe:
    Item eggs = new Item();
    eggs.setItemName("eggs");
    eggs.setRecipe(newRecipe);
    itemRepository.save(eggs);
    //
    Item flour = new Item();
    flour.setItemName("flour");
    flour.setRecipe(newRecipe);
    itemRepository.save(flour);
    //
    Item dough = new Item();
    dough.setItemName("dough");
    dough.setRecipe(newRecipe);
    itemRepository.save(dough);
    //
    Item bread = new Item();
    bread.setItemName("bread");
    bread.setRecipe(newRecipe);
    itemRepository.save(bread);

    // Add steps
    Step newStep1 = new Step();
    newStep1.setRecipe(newRecipe);
    newStep1.setResultItem(dough);
    newStep1.setSequence(1);
    newStep1.setVerb("mix");
    //
    Step newStep2 = new Step();
    newStep2.setRecipe(newRecipe);
    newStep2.setResultItem(bread);
    newStep2.setSequence(2);
    newStep2.setVerb("bake");
    stepRepository.save(newStep1);
    stepRepository.save(newStep2);

    // Add ingredients to the steps:
    Ingredient ieggs = new Ingredient();
    ieggs.setItem(eggs);
    ieggs.setAmount(3d);
    ieggs.setUnit("");
    ieggs.setStep(newStep1);
    ingredientRepository.save(ieggs);
    //
    Ingredient iflour = new Ingredient();
    iflour.setItem(flour);
    iflour.setAmount(500d);
    iflour.setUnit("grams");
    iflour.setStep(newStep1);
    ingredientRepository.save(iflour);
    //
    Ingredient idough = new Ingredient();
    idough.setItem(dough);
    idough.setAmount(10d);
    idough.setUnit("ounces");
    idough.setStep(newStep2);
    ingredientRepository.save(idough);
  }
}
