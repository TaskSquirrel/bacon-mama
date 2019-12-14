package bakingmama.models;

import lombok.*;

import javax.persistence.*;
import java.sql.Blob;
import java.sql.SQLException;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Entity
public class History {
  @Id
  @GeneratedValue(strategy = GenerationType.AUTO)
  private Long id;

  // If courseId + studentId is in here, it means student has completed said course.
  private Long recipeId;
  private Long studentId;

  private String status;
}
