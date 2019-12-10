package bakingmama.controllers;

import bakingmama.json.CourseJson;
import bakingmama.models.*;
import bakingmama.persistence.CoursePersistence;
import bakingmama.persistence.RecipePersistence;
import bakingmama.util.JsonUtils;
import bakingmama.util.ModelUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.config.AutowireCapableBeanFactory;
import org.springframework.web.bind.annotation.*;

import java.util.*;

import javax.persistence.EntityManager;

@RestController
public class CourseController implements BaseApiController{
    @Autowired
    private CourseRepository courseRepository;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private RecipeRepository recipeRepository;
    @Autowired
    ModelUtils mu;
    @Autowired
    CoursePersistence cp;
    @Autowired
    RecipePersistence rp;

    @Autowired
    EntityManager em;
    @Autowired
    AutowireCapableBeanFactory beanFactory;

    private Map<String, Object> courseSuccess(CourseJson cj) {
        Map<String, Object> map = new HashMap<>();
        Course course = cj.toModel();
    
        map.put("course", course.toMap());
        JsonUtils.setStatus(map, JsonUtils.SUCCESS);
        return map;
      }

    @CrossOrigin
    @PostMapping(
      path = "/addCourse",
      consumes = "application/json",
      produces = "application/json"
    )
    Map<String, Object> addCourse(@RequestBody Map<String, Object> body) {
        Map<String, Object> returnMap = new HashMap<>();
        String professorName = (String) body.get("professor");
        String courseName = (String) body.get("courseName");

        User professor = userRepository.findByUsername(professorName);
        if (professor == null) {
            JsonUtils.setStatus(returnMap, JsonUtils.ERROR, "User couldn't be found!");
            return returnMap;
        }

        Course newCourse = mu.addCourse(professor, courseName);
        returnMap.put("id", newCourse.getId());

        JsonUtils.setStatus(returnMap, JsonUtils.SUCCESS);
        return returnMap;
    }

    @CrossOrigin
    @PostMapping(
      path = "/getCourse",
      consumes = "application/json",
      produces = "application/json"
    )
    Map<String, Object> getCourse(@RequestBody Map<String, Object> body) {
        Map<String, Object> returnMap = new HashMap<>();

        CourseJson cj = new CourseJson(body);
        beanFactory.autowireBean(cj);

        Course course = cj.toModel();
        if (course == null) {
            JsonUtils.setStatus(returnMap, JsonUtils.ERROR, "Course couldn't be found!");
            return returnMap;
        }
        
        return this.courseSuccess(cj);
    }

    @CrossOrigin
    @PostMapping(
      path = "/editCourse",
      consumes = "application/json",
      produces = "application/json"
    )
    Map<String, Object> editCourse(@RequestBody Map<String, Object> body) {
        Map<String, Object> returnMap = new HashMap<>();

        Course course = cp.findCourse(JsonUtils.castMap(body.get("course")));
        Map<String, Object> newCourse = JsonUtils.castMap(body.get("replace"));

        String courseName = (String) newCourse.get("courseName");

        course = mu.editCourse(course, courseName);

        returnMap.put("course", course.toMap());
        
        JsonUtils.setStatus(returnMap, JsonUtils.SUCCESS);

        return returnMap;
    }

    @CrossOrigin
    @PostMapping(
      path = "/addStudentToCourse",
      consumes = "application/json",
      produces = "application/json"
    )
    Map<String, Object> addStudentToCourse(@RequestBody Map<String, Object> body) {
      Map<String, Object> returnMap = new HashMap<>();

      String username = (String) body.get("username");
      User user = userRepository.findByUsername(username);
      if (user == null) {
        JsonUtils.setStatus(returnMap, JsonUtils.ERROR, "User couldn't be found!");
        return returnMap;
      }
      if (user.getRole().equals("professor"))
      {
        JsonUtils.setStatus(returnMap, JsonUtils.ERROR, "Professor can't be a student");
        return returnMap;
      }

      Course course = cp.findCourse(JsonUtils.castMap(body.get("course")));
      course = mu.addStudenToCourse(course, user);
      returnMap.put("course", course.toMap());

      JsonUtils.setStatus(returnMap, JsonUtils.SUCCESS);
      return returnMap;
    }

    @CrossOrigin
    @PostMapping(
      path = "/addRecipeToCourse",
      consumes = "application/json",
      produces = "application/json"
    )
    Map<String, Object> addRecipeToCourse(@RequestBody Map<String, Object> body) {
      Map<String, Object> returnMap = new HashMap<>();

      Recipe recipe = rp.findRecipe(JsonUtils.castMap(body.get("recipe")));
      Course course = cp.findCourse(JsonUtils.castMap(body.get("course")));

      course = mu.addRecipeToCourse(course, recipe);

      returnMap.put("course", course.toMap());

      JsonUtils.setStatus(returnMap, JsonUtils.SUCCESS);
      return returnMap;
    }

    @CrossOrigin
    @PostMapping(
      path = "/removeRecipeFromCourse",
      consumes = "application/json",
      produces = "application/json"
    )
    Map<String, Object> removeRecipeFromCourse(@RequestBody Map<String, Object> body) {
      Map<String, Object> returnMap = new HashMap<>();

      Recipe recipe = rp.findRecipe(JsonUtils.castMap(body.get("recipe")));
      Course course = cp.findCourse(JsonUtils.castMap(body.get("course")));

      course = mu.removeRecipeFromCourse(course, recipe);

      returnMap.put("course", course.toMap());

      JsonUtils.setStatus(returnMap, JsonUtils.SUCCESS);
      return returnMap;
    }


  }