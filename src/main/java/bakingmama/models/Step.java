package bakingmama.models;

import lombok.*;

import javax.persistence.*;
import java.util.*;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Entity
public class Step {
  @Id
  @GeneratedValue(strategy = GenerationType.AUTO)
  private Long id;

  // Action being done in this step
  private String verb;
  // Order in the recipe -- order is keyword so can't use
  private Integer sequence;

  @ManyToOne()
  private Recipe recipe;

  @OneToOne()
  private Item resultItem;

  @OneToMany(mappedBy = "step")
  private Set<Ingredient> ingredients;

  public boolean edit(String verb, Integer sequence, Item resultItem) {
    this.verb = verb;
    this.sequence = sequence;
    this.resultItem = resultItem;
    return true;
  }

  public Map<String, Object> toMap() {
    Map<String, Object> map = new HashMap<>();
    map.put("id", id);
    map.put("verb", verb);
    map.put("sequence", sequence);
    map.put("result", resultItem == null ? new HashMap<>() : resultItem.toMap());

    List<Map<String, Object>> ingredientsList = new ArrayList<>();
    map.put("ingredients", ingredientsList);
    for (Ingredient ingredient : ingredients) {
      ingredientsList.add(ingredient.toMap());
    }
    return map;
  }
}
