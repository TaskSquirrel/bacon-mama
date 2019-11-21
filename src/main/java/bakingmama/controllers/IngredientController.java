package bakingmama.controllers;

import bakingmama.models.Image;
import bakingmama.models.ImageRepository;
import bakingmama.util.JavaUtils;
import bakingmama.util.JsonUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import javax.sql.rowset.serial.SerialBlob;
import java.util.HashMap;
import java.util.Map;

@RestController
public class IngredientController implements BaseApiController {
  @Autowired
  ImageRepository imageRepository;

  @CrossOrigin
  @PostMapping(
      path = "/addImage",
      consumes = "multipart/form-data",
      produces = "application/json"
  )
  Map<String, Object> addImage(@RequestParam("file") MultipartFile file) {
    Map<String, Object> returnMap = new HashMap<>();
    try {
      byte[] fileBytes = file.getBytes();
      SerialBlob sb = new SerialBlob(fileBytes);

      Image im = new Image();
      im.setData(sb);
      imageRepository.save(im);
      JsonUtils.setStatus(returnMap, JsonUtils.SUCCESS);
    } catch (Exception e) {
      JsonUtils.setStatus(returnMap, JsonUtils.ERROR, e.getMessage());
    }
    return returnMap;
  }

  @CrossOrigin
  @PostMapping(
      path = "/getImage",
      consumes = "application/json",
      produces = "application/json"
  )
  Map<String, Object> getImage(@RequestBody Map<String, Object> body) {
    Map<String, Object> returnMap = new HashMap<>();

    try {
      Long imageID = JsonUtils.parseId(body.get("id"));
      Image image = JavaUtils.find(imageRepository, imageID);

      // Return image???

      JsonUtils.setStatus(returnMap, JsonUtils.SUCCESS);
    } catch (Exception e) {
      JsonUtils.setStatus(returnMap, JsonUtils.ERROR, e.getMessage());
    }
    return returnMap;
  }
}
