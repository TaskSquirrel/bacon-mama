package bakingmama.controllers;

import bakingmama.models.User;
import bakingmama.models.UserRepository;

import bakingmama.util.JsonUtils;
import bakingmama.util.TokenUtils;

import org.springframework.web.bind.annotation.*;

import java.util.Collection;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.auth0.jwt.JWT;
import com.auth0.jwt.exceptions.JWTVerificationException;
import com.auth0.jwt.interfaces.Claim;
import com.auth0.jwt.interfaces.DecodedJWT;

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

    // 1) Check if user can be found
    // 2) If found, check if passwords are NOT equal
    // 3) Otherwise, return success
    User user = userRepository.findByUsername(username);
    if (user == null) {
      JsonUtils.setStatus(returnMap, JsonUtils.ERROR, "Username couldn't be found!");
    } else if (!user.getPassword().equals(password)) {
      JsonUtils.setStatus(returnMap, JsonUtils.ERROR, "Incorrect password for user~");
    } else {
      JsonUtils.setStatus(returnMap, JsonUtils.SUCCESS);
    }

    return returnMap;
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

  @CrossOrigin
  @PostMapping(
      path = "/validateID",
      consumes = "application/json",
      produces = "application/json"
  )
  public Map<String, Object> validateID(@RequestBody Map<String, Object> body)
  {
    Map<String, Object> returnMap = new HashMap<>();
    
    String token = (String) body.get("token");

    JsonUtils.setStatus(returnMap, JsonUtils.ERROR, "Can not validate.");
    try {
      DecodedJWT decoded = TokenUtils.getVerifier().verify(token);
      Claim payloadJson = decoded.getClaim("username");
      String username = payloadJson.asString();

      if(userRepository.existsByUsername(username))
      {
        returnMap.put("username", username);
        JsonUtils.setStatus(returnMap, JsonUtils.SUCCESS);
      }

      return returnMap;
    } catch (JWTVerificationException e) {
      return returnMap;
    }
  }
}
