package bakingmama.controllers;

import bakingmama.models.User;
import bakingmama.models.UserRepository;

import bakingmama.util.JsonUtils;
import org.springframework.web.bind.annotation.*;

import java.util.Collection;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
public class UserController implements BaseApiController {
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

    String username = (String) body.get("username");
    String password = (String) body.get("password");

    User user = userRepository.findByUsername(username);

    if (user == null) {
      JsonUtils.setStatus(returnMap, JsonUtils.ERROR, "Failed to login!");
      return returnMap;
    }

    if (user.getPassword().equals(password)) {
      JsonUtils.setStatus(returnMap, JsonUtils.SUCCESS);
      return returnMap;
    } else {
      JsonUtils.setStatus(returnMap, JsonUtils.ERROR, "Failed to login!");
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

    String username = (String) body.get("username");
    String password = (String) body.get("password");

    if (userRepository.existsByUsername(username)) {
      JsonUtils.setStatus(returnMap, JsonUtils.ERROR, "Username already taken.");
    } else {
      User newUser = new User();
      newUser.setUsername(username);
      newUser.setPassword(password);
      userRepository.save(newUser);
      JsonUtils.setStatus(returnMap, JsonUtils.SUCCESS);
    }
    return returnMap;
  }
}
