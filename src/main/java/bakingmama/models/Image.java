package bakingmama.models;

import lombok.*;

import javax.persistence.*;
import java.sql.Blob;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Entity
public class Image {
  @Id
  @GeneratedValue(strategy = GenerationType.AUTO)
  private Long id;

  @Column
  @Lob
  private Blob data;
}
