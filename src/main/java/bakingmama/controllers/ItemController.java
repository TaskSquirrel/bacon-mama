package bakingmama.controllers;

import bakingmama.models.*;
import bakingmama.util.JavaUtils;
import bakingmama.util.JsonUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import javax.sql.rowset.serial.SerialBlob;
import java.sql.Blob;
import java.sql.SQLException;
import java.util.*;

@RestController
public class ItemController implements BaseApiController {
  @Autowired
  ImageIP imageIP;
  @Autowired
  ImageRepository imageRepository;
  @Autowired
  ItemRepository itemRepository;
  @Autowired
  UserRepository userRepository;

  @CrossOrigin
  @PostMapping(path = "/images/add", consumes = "multipart/form-data", produces = "application/json")
  Map<String, Object> addImage(@RequestParam("file") MultipartFile file) {
    try {
      byte[] bytes = file.getBytes();
      Image image = imageIP.addImage(bytes);
      if (image == null) {
        throw new Exception("Error in addImage() -- failed to add image.");
      }

      Map<String, Object> returnMap = new HashMap<>();
      returnMap.put("id", image.getId());
      JsonUtils.setStatus(returnMap, JsonUtils.SUCCESS);
      return returnMap;
    } catch (Exception e) {
      return JsonUtils.returnError(e.getMessage());
    }
  }

  @CrossOrigin
  @GetMapping(path = "/images/bytes/{id}", produces = "application/json")
  Map<String, Object> getImageBytes(@PathVariable Integer id) {
    Map<String, Object> returnMap = new HashMap<>();
    try {
      Long imageID = JsonUtils.parseId(id);
      Image image = imageRepository.getOne(imageID);

      returnMap.put("image", image.getDataBytes());
      JsonUtils.setStatus(returnMap, JsonUtils.SUCCESS);
    } catch (Exception e) {
      JsonUtils.setStatus(returnMap, JsonUtils.ERROR, e.getMessage());
    }
    return returnMap;
  }

  @CrossOrigin
  @GetMapping(path = "/images/{id}", produces = MediaType.IMAGE_JPEG_VALUE)
  @ResponseBody
  byte[] getImage(@PathVariable Integer id) {
    try {
      Map<String, Object> returnMap = new HashMap<>();
      Long imageID = JsonUtils.parseId(id);
      Image image = imageRepository.getOne(imageID);

      return image.getDataBytes();
    } catch (Exception e) {
      return null;
    }
  }

  @CrossOrigin
  @GetMapping(path = "/items/{itemID}/addImage/{imageID}", produces = "application/json")
  Map<String, Object> attachImage(@PathVariable Integer itemID, @PathVariable Integer imageID) {
    try {
      Item item = itemRepository.getOne(JsonUtils.parseId(itemID));
      Image image = imageRepository.getOne(JsonUtils.parseId(imageID));
      item.setImage(image);
      itemRepository.save(item);

      return JsonUtils.returnSuccess();
    } catch (Exception e) {
      return JsonUtils.returnError(e.getMessage());
    }
  }

  @CrossOrigin
  @PostMapping(path = "/getItems", consumes = "application/json", produces = "application/json")
  Map<String, Object> getItems(@RequestBody Map<String, Object> body) {
    try {
      List<Item> items;
      if (body.containsKey("userId")) {
        User creator = userRepository.getOne(JsonUtils.parseId(body.get("userId")));
        items = itemRepository.findByCreator(creator);
        if (body.containsKey("term")) {
          String term = (String) body.get("term");
          items.removeIf(item -> !item.getItemName().contains(term));
        }
      } else {
        // no user id
        String term = (String) body.get("term");
        items = itemRepository.findByItemNameContaining(term);
      }

      Map<String, Object> map = new HashMap<>();
      List<Map<String, Object>> itemsList = new ArrayList<>();
      map.put("items", itemsList);
      for (Item item : items) {
        itemsList.add(item.toMap());
      }
      JsonUtils.setStatus(map, JsonUtils.SUCCESS);
      return map;
    } catch (Exception e) {
      return JsonUtils.returnError(e.getMessage());
    }
  }
}
