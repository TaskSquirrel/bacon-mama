package bakingmama.controllers;

import bakingmama.json.CourseJson;
import bakingmama.models.*;

import bakingmama.util.JsonUtils;
import bakingmama.util.ModelUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.config.AutowireCapableBeanFactory;
import org.springframework.web.bind.annotation.*;

import java.util.*;

import javax.persistence.EntityManager;

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
}