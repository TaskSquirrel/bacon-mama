package bakingmama.models;

import lombok.*;

import javax.persistence.*;
import java.util.*;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Entity
public class Course
{
  @Id
  @GeneratedValue(strategy = GenerationType.AUTO)
  private Long id;
  private String courseName;

  @ManyToOne
  private User professor;

  @OneToMany(mappedBy = "courses")
  private Set<User> students;
  
  @ManyToMany
  private Set<Recipe> recipes;

  public Map<String, Object> toMapOverview() {
    Map<String, Object> map = new HashMap<>();
    map.put("id", id);
    map.put("courseName", courseName);
    map.put("professor", this.professor.getUsername());
    return map;
  }

  public Map<String, Object> toMap()
  {
    Map<String, Object> map = this.toMapOverview();

    List<Map<String, Object>> studentList = new ArrayList<>();
    map.put("students", studentList);
    for (User student : students) {
      Map<String, Object> addStudent = new HashMap<>();
      addStudent.put("userName", student.getUsername());
      studentList.add(addStudent);
    }

    List<Map<String, Object>> recipeList = new ArrayList<>();
    map.put("recipes", recipeList);
    for(Recipe recipe : recipes){
      recipeList.add(recipe.toMap());
    }

    return map;
  }
}