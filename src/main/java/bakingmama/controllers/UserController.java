package bakingmama.controllers;

import bakingmama.models.User;
import bakingmama.models.UserRepository;

import org.springframework.web.bind.annotation.*;

import java.util.Collection;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
public class UserController extends BaseApiController {
  private UserRepository userRepository;

  public UserController(UserRepository userRepository) {
    this.userRepository = userRepository;
  }

  @CrossOrigin
  @PostMapping(
      path = "/login",
      consumes = "application/json",
      produces = "application/json"
  )
  Map<String, Object> login(@RequestBody Map<String, Object> body) {
    Map<String, Object> returnMap = new HashMap<>();

    String name = (String) body.get("username");
    String password = (String) body.get("password");

    List<User> list = userRepository.findByName(name);

    if (list.size() != 1) {
      returnMap.put("status", "error");
      returnMap.put("message", "Failed to login!");
      return returnMap;
    }

    User user = list.get(0);
    if (user.getPassword().equals(password)) {
      returnMap.put("status", "OK");
      return returnMap;
    } else {
      returnMap.put("status", "error");
      returnMap.put("message", "Failed to login (2)");
      return returnMap;
    }
  }

  @CrossOrigin
  @PostMapping(
      path = "/addUser",
      consumes = "application/json",
      produces = "application/json"
  )
  Map<String, Object> addUser(@RequestBody Map<String, Object> body) {
    Map<String, Object> returnMap = new HashMap<>();

    String name = (String) body.get("username");
    String password = (String) body.get("password");

    if (userRepository.existsByName(name)) {
      returnMap.put("error", true);
      returnMap.put("message", "Username already taken.");
    } else {
      User newUser = new User();
      newUser.setName(name);
      newUser.setPassword(password);
      userRepository.save(newUser);
      returnMap.put("success", true);
    }
    return returnMap;
  }
}
