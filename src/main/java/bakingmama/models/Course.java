package bakingmama.models;

import lombok.*;

import javax.persistence.*;
import java.util.*;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Entity
public class Course
{
  @Id
  @GeneratedValue(strategy = GenerationType.AUTO)
  private Long id;
  private String courseName;
  private User professor;

  @OneToMany(mappedBy = "recipe")
  private Set<User> students;
  

}