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

  @ManyToOne(cascade = CascadeType.PERSIST)
  private User user;

  @OneToMany(
      cascade = CascadeType.PERSIST,
      mappedBy = "recipe"
  )
  private Set<Step> steps;

  @OneToMany(
      cascade = CascadeType.PERSIST,
      mappedBy = "recipe"
  )
  private Set<Item> items;

  public Map<String, Object> toMapOverview() {
    Map<String, Object> map = new HashMap<>();
    map.put("id", id);
    map.put("recipeName", recipeName);
    map.put("description", description);
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
