package bakingmama.models;

import lombok.*;

import javax.persistence.*;
import java.util.Set;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Entity
public class User {
  @Id
  @GeneratedValue(strategy = GenerationType.AUTO)
  private Long id;
  private String username;
  private String password;

  @OneToMany(mappedBy = "user")
  private Set<Recipe> recipes;

  @ManyToMany
  private Set<Course> courses;

  private String role;
}
