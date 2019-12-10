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
public class Image {
  @Id
  @GeneratedValue(strategy = GenerationType.AUTO)
  private Long id;

  @Column
  @Lob
  private Blob data;
  
  public byte[] getDataBytes() throws SQLException {
    return data.getBytes(1, (int) data.length());
  }
}
