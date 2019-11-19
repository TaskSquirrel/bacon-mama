package bakingmama.models;

import lombok.*;

import javax.persistence.*;
import java.util.HashMap;
import java.util.Map;
import java.util.Set;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Entity
public class Ingredient {
  @Id
  @GeneratedValue(strategy = GenerationType.AUTO)
  private Long id;

  private Double amount;
  private String unit;

  @OneToOne()
  private Item item;

  @OneToOne()
  private Step resultStep;

  @ManyToOne()
  private Step step;

  public Map<String, Object> toMap() {
    Map<String, Object> map = new HashMap<>();
    map.put("id", id);
    map.put("item", item.toMap());
    map.put("amount", amount);
    map.put("unit", unit);
    return map;
  }
}
