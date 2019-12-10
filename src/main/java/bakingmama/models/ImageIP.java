package bakingmama.models;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import javax.imageio.ImageIO;
import javax.sql.rowset.serial.SerialBlob;
import java.awt.image.RenderedImage;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.sql.Blob;
import java.sql.SQLException;

@Component
public class ImageIP {
  @Autowired
  ImageRepository imageRepository;

  /**
   * Saves a byte array into the DB as a new Image.
   */
  public Image addImage(byte[] bytes, Item item) {
    try {
      Blob blob = new SerialBlob(bytes);

      Image im = new Image();
      im.setData(blob);
      imageRepository.save(im);

      if (item != null) { item.setImage(im); }

      return im;
    } catch (SQLException sqle) {
      return null;
    }
  }

  public Image addImage(byte[] bytes) {
    return this.addImage(bytes, null);
  }

  public Image addImage(RenderedImage ri, Item item) {
    try {
      ByteArrayOutputStream baos = new ByteArrayOutputStream();
      ImageIO.write(ri, "png", baos);
      return this.addImage(baos.toByteArray(), item);
    } catch (IOException ioe) {
      return null;
    }
  }
}
