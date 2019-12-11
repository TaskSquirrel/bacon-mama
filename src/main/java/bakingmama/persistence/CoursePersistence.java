package bakingmama.persistence;

import bakingmama.models.Course;
import bakingmama.models.CourseRepository;
import bakingmama.util.JsonUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.Map;
import java.util.Optional;

@Component
public class CoursePersistence {
  @Autowired
  CourseRepository courseRepository;

  public <T> T unpackOptional(Optional<T> op) {
    if (!op.isPresent()) {
      return null;
    } else {
      return op.get();
    }
  }

  public Course findCourse(Long courseId) {
    Optional<Course> optional = courseRepository.findById(courseId);
    return unpackOptional(optional);  }

  public Course findCourse(Object courseId) {
    return this.findCourse(JsonUtils.parseId(courseId));
  }

  public Course findCourse(Map<String, Object> courseJson) {
    return this.findCourse(courseJson.get("id"));
  }
}