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

  @OneToOne()
  private Image creator;

  private String itemName;
  private String description;

  @OneToOne()
  private Image image;

  public Map<String, Object> toMap() {
    Map<String, Object> map = new HashMap<>();
    map.put("id", id);
    map.put("itemName", itemName);

    if (image != null) { map.put("image", image.getId()); }

    return map;
  }
}
