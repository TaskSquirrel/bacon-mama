package bakingmama.models;

import lombok.*;

import javax.persistence.*;
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

  @OneToMany(
      cascade = CascadeType.PERSIST,
      mappedBy = "food"
  )
  private String ingredientName;

  private double amount;

  private String unit;
}
