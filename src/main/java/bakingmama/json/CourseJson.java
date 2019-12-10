package bakingmama.json;

import bakingmama.models.Course;
import bakingmama.persistence.CoursePersistence;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.Map;

public class CourseJson extends BaseJson {
    @Autowired
    CoursePersistence cp;

    public CourseJson(Map<String, Object> json) { super(json); }
    public CourseJson(Map<String, Object> json, boolean filter) { super(json, "course"); }
    public CourseJson(Object json) { super(json); }

    @Override
    public Course toModel() {
        return cp.findCourse(this.json.get("id"));
    }
}