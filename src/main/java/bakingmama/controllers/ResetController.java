package bakingmama.controllers;

import bakingmama.models.*;
import bakingmama.util.JsonUtils;
import bakingmama.util.ModelUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import javax.imageio.ImageIO;
import javax.persistence.EntityManager;
import javax.persistence.EntityManagerFactory;
import javax.persistence.EntityTransaction;
import java.awt.image.BufferedImage;
import java.io.BufferedInputStream;
import java.io.File;
import java.io.IOException;
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
  ImageIP imageIP;
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

      em.createQuery("DELETE FROM Image").executeUpdate();
      em.createQuery("DELETE FROM Ingredient").executeUpdate();
      em.createQuery("DELETE FROM Step").executeUpdate();
      em.createQuery("DELETE FROM Item").executeUpdate();
      em.createQuery("DELETE FROM Recipe").executeUpdate();
      em.createQuery("DELETE FROM User").executeUpdate();
      em.createQuery("DELETE FROM Course").executeUpdate();

      utx.commit();

      this.makeUser();
      this.makeRecipe();
      JsonUtils.setStatus(returnMap, JsonUtils.SUCCESS, "Reset successful!");
    } catch (Exception e) {
      String errorMessage = e.getMessage();
      JsonUtils.setStatus(returnMap, JsonUtils.ERROR, errorMessage);
    }

    return returnMap;
  }

  void makeUser() {
    User newUser = new User();
    newUser.setUsername("test-username");
    newUser.setPassword("test-password");
    newUser.setRole("professor");
    userRepository.save(newUser);
  }

  void makeRecipe() throws Exception {
    User user = userRepository.findByUsername("test-username");

    // Make recipe and attach it to the user:
    Recipe newRecipe = mu.addRecipe(user, "test-recipeName", "test-recipeDescription");

    // Add some items for test recipe:
    Item eggs = mu.addItem("eggs", newRecipe, null);
    Item flour = mu.addItem("flour", newRecipe, null);
    Item dough = mu.addItem("dough", newRecipe, null);
    Item bread = mu.addItem("bread", newRecipe, null);

    Ingredient doughIng = mu.addIngredient(dough, null, 10d, "ounces");
    Ingredient breadIng = mu.addIngredient(bread, null, 100d, "pieces");

    // Add steps
    Step newStep1 = mu.addStep(newRecipe, doughIng, "mix", 1, "You are mixing",  new HashSet<>(), "title 1");
    Step newStep2 = mu.addStep(newRecipe, breadIng, "bake", 2, "You are baking", new HashSet<>(), "title 2");

    doughIng.setResultStep(newStep1);
    breadIng.setResultStep(newStep2);
    ingredientRepository.save(doughIng);
    ingredientRepository.save(breadIng);

    // Add ingredients to the steps:
    mu.addIngredient(eggs, newStep1, 3d, "");
    mu.addIngredient(flour, newStep1, 500d, "grams");
    mu.addIngredient(dough, newStep2, 10d, "ounces");

    // Add images to the recipe
    try {
      ClassLoader cl = ResetController.class.getClassLoader();

      BufferedImage img;
      File file;

      file = new File(cl.getResource("static/images/eggs.jpg").getFile());
      img = ImageIO.read(file);
      imageIP.addImage(img, eggs);

      file = new File(cl.getResource("static/images/flour.png").getFile());
      img = ImageIO.read(file);
      imageIP.addImage(img, flour);

      file = new File(cl.getResource("static/images/dough.jpg").getFile());
      img = ImageIO.read(file);
      imageIP.addImage(img, dough);

      file = new File(cl.getResource("static/images/bread.jpg").getFile());
      img = ImageIO.read(file);
      imageIP.addImage(img, bread);

    } catch (Exception e) {
      throw new Exception("Reset is messed up! Message: " + e.getMessage());
    }
  }
}
