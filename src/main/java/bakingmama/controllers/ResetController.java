package bakingmama.controllers;

import bakingmama.models.Recipe;
import bakingmama.models.RecipeRepository;
import bakingmama.models.User;
import bakingmama.models.UserRepository;
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
    Recipe newRecipe = new Recipe();
    newRecipe.setRecipeName("test-recipeName");
    newRecipe.setUser(user);
    recipeRepository.save(newRecipe);
  }
}
