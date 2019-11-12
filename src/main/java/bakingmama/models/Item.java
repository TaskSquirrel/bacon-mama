package bakingmama.models;

import lombok.*;

import javax.persistence.*;
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

  // Image related stuff (future support)
  private String imageUrl;
}
