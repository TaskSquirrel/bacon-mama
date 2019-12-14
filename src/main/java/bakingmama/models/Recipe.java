package bakingmama.models;

import lombok.*;

import javax.persistence.*;
import java.util.*;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Entity
public class Recipe {
  @Id
  @GeneratedValue(strategy = GenerationType.AUTO)
  private Long id;
  private String recipeName;
  private String description;

  @ManyToOne()
  private User user;

  @OneToMany(mappedBy = "recipe")
  private Set<Step> steps;

  @OneToMany(mappedBy = "recipe")
  private Set<Item> items;

  @ManyToMany
  private Set<Course> courses;

  public Map<String, Object> toMapOverview() {
    Map<String, Object> map = new HashMap<>();
    map.put("id", id);
    map.put("recipeName", recipeName);
    map.put("description", description);
    return map;
  }

  public Map<String, Object> toMapOverview(String status) {
    Map<String, Object> map = new HashMap<>();
    map.put("id", id);
    map.put("recipeName", recipeName);
    map.put("description", description);
    map.put("status", status);
    return map;
  }

  public Map<String, Object> toMap() {
    Map<String, Object> map = this.toMapOverview();

    List<Map<String, Object>> stepsList = new ArrayList<>();
    map.put("steps", stepsList);
    for (Step step : steps) {
      stepsList.add(step.toMap());
    }

    List<Map<String, Object>> itemsList = new ArrayList<>();
    map.put("items", itemsList);
    for (Item item : items) {
      itemsList.add(item.toMap());
    }
    return map;
  }
}
