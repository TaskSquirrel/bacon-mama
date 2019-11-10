package bakingmama.models;

import lombok.*;

import javax.persistence.*;

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

  @ManyToOne(cascade = CascadeType.PERSIST)
  private User user;
}
