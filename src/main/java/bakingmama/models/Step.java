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

  @ManyToOne(cascade = CascadeType.PERSIST)
  private Recipe recipe;

  @OneToOne(cascade = CascadeType.PERSIST)
  private Item resultItem;

  @OneToMany(
      cascade = CascadeType.PERSIST,
      mappedBy = "step"
  )
  private Set<Ingredient> ingredients;


  public Map<String, Object> toMap() {
    Map<String, Object> map = new HashMap<>();
    map.put("id", id);
    map.put("verb", verb);
    map.put("sequence", sequence);
    map.put("result", resultItem.toMap());

    List<Map<String, Object>> ingredientsList = new ArrayList<>();
    map.put("ingredients", ingredientsList);
    for (Ingredient ingredient : ingredients) {
      ingredientsList.add(ingredient.toMap());
    }
    return map;
  }
}
