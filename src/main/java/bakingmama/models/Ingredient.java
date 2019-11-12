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

  @OneToOne(cascade = CascadeType.PERSIST)
  private Item item;

  @ManyToOne(cascade = CascadeType.PERSIST)
  private Step step;

  public Map<String, Object> toMap() {
    Map<String, Object> map = item.toMap();
    map.put("amount", amount);
    map.put("unit", unit);
    return map;
  }
}
