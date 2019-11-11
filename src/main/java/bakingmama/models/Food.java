package bakingmama.models;

import lombok.*;

import javax.persistence.*;
import java.util.Set;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Entity
public class Food {
  @Id
  @ManyToOne(cascade = CascadeType.PERSIST)
  private String foodName;
}
