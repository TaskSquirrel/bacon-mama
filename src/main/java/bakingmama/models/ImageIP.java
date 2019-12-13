package bakingmama.models;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import javax.imageio.ImageIO;
import javax.sql.rowset.serial.SerialBlob;
import java.awt.*;
import java.awt.image.BufferedImage;
import java.awt.image.RenderedImage;
import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.nio.Buffer;
import java.sql.Blob;
import java.sql.SQLException;

@Component
public class ImageIP {
  @Autowired
  ImageRepository imageRepository;
  @Autowired
  ItemRepository itemRepository;

  private byte[] imageToBytes(RenderedImage ri) throws IOException {
    ByteArrayOutputStream baos = new ByteArrayOutputStream();
    ImageIO.write(ri, "png", baos);
    return baos.toByteArray();
  }

  private BufferedImage castJai(java.awt.Image jai) {
    BufferedImage bi = new BufferedImage(jai.getWidth(null), jai.getHeight(null), BufferedImage.TYPE_INT_ARGB);
    Graphics2D g = bi.createGraphics();
    g.drawImage(jai, 0, 0, null);
    g.dispose();
    return bi;
  }

  /**
   * Converts a byte[] into an image, shrinks it, and then converts back into byte[].
   */
  private byte[] byteShrink(byte[] bytes) throws Exception {
    ByteArrayInputStream bais = new ByteArrayInputStream(bytes);
    BufferedImage image = ImageIO.read(bais);

    BufferedImage newImage = this.castJai(image.getScaledInstance(500, 500, java.awt.Image.SCALE_DEFAULT));
    return imageToBytes(newImage);
  }

  /**
   * Saves a byte array into the DB as a new Image.
   */
  public Image addImage(byte[] bytes, Item item) {
    try {
      Blob blob = new SerialBlob(this.byteShrink(bytes));

      Image im = new Image();
      im.setData(blob);
      imageRepository.save(im);

      if (item != null) {
        item.setImage(im);
        itemRepository.save(item);
      }

      return im;
    } catch (Exception e) {
      System.out.println("Message: " + e.getMessage());
      return null;
    }
  }

  public Image addImage(byte[] bytes) {
    return this.addImage(bytes, null);
  }

  public Image addImage(RenderedImage ri, Item item) {
    try {
      return this.addImage(this.imageToBytes(ri), item);
    } catch (IOException ioe) {
      return null;
    }
  }
}
