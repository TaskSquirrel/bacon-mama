package bakingmama.models;

import lombok.*;

import javax.persistence.*;
import java.util.HashMap;
import java.util.Map;
import java.util.Set;

//
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Entity
public class Item {
  @Id
  @GeneratedValue(strategy = GenerationType.AUTO)
  private Long id;

  private String itemName;
  private String description;

  // Deprecated -- not using AWS
  private String imageUrl;

  @OneToOne()
  private Image image;

  @ManyToOne()
  private Recipe recipe;

  public Map<String, Object> toMap() {
    Map<String, Object> map = new HashMap<>();
    map.put("id", id);
    map.put("itemName", itemName);
    return map;
  }
}
