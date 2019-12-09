package bakingmama.controllers;

import bakingmama.models.Image;
import bakingmama.models.ImageIP;
import bakingmama.models.ImageRepository;
import bakingmama.util.JavaUtils;
import bakingmama.util.JsonUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import javax.sql.rowset.serial.SerialBlob;
import java.sql.Blob;
import java.util.HashMap;
import java.util.Map;

@RestController
public class ItemController implements BaseApiController {
  @Autowired
  ImageRepository imageRepository;
  @Autowired
  ImageIP imageIP;

  @CrossOrigin
  @PostMapping(path = "/images/add", consumes = "multipart/form-data", produces = "application/json")
  Map<String, Object> addImage(@RequestParam("file") MultipartFile file) {
    try {
      byte[] bytes = file.getBytes();
      imageIP.addImage(bytes);
      return JsonUtils.returnSuccess();
    } catch (Exception e) {
      return JsonUtils.returnError(e.getMessage());
    }
  }

  @CrossOrigin
  @GetMapping(path = "/images/{id}", produces = "application/json")
  Map<String, Object> getImage(@PathVariable Integer id) {
    Map<String, Object> returnMap = new HashMap<>();
    try {
      Long imageID = JsonUtils.parseId(id);
      Image image = imageRepository.getOne(imageID);

      Blob blob = image.getData();
      returnMap.put("image", blob.getBytes(1, (int) blob.length()));
      JsonUtils.setStatus(returnMap, JsonUtils.SUCCESS);
    } catch (Exception e) {
      JsonUtils.setStatus(returnMap, JsonUtils.ERROR, e.getMessage());
    }
    return returnMap;
  }
}
