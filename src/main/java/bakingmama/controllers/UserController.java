package bakingmama.controllers;

import bakingmama.models.User;
import bakingmama.models.UserRepository;

import bakingmama.util.JsonUtils;
import bakingmama.util.TokenUtils;

import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Collection;

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
    if (user == null || !user.getPassword().equals(password)) {
      JsonUtils.setStatus(returnMap, JsonUtils.ERROR, "Credentials incorrect!");
    } else {
      String token = JWT.create()
        .withClaim("username", username)
        .withClaim("userID", user.getId().toString())
        .withClaim("role", user.getRole())
        .sign(TokenUtils.getAlgorithm());

      returnMap.put("token", token);
      returnMap.put("name", username);
      returnMap.put("role", user.getRole());
      returnMap.put("userID", user.getId());

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

    String role = "student";
    String roleFromRequest = (String) body.get("role");

    if (roleFromRequest != null) {
      role = roleFromRequest;
    }

    String username = (String) body.get("username");
    String password = (String) body.get("password");

    if (userRepository.existsByUsername(username)) {
      JsonUtils.setStatus(returnMap, JsonUtils.ERROR, "Username already taken.");
    } else {
      User newUser = new User();
      newUser.setUsername(username);
      newUser.setPassword(password);
      newUser.setRole(role);
      userRepository.save(newUser);

      JsonUtils.setStatus(returnMap, JsonUtils.SUCCESS);

      String token = JWT.create()
        .withClaim("username", newUser.getUsername())
        .withClaim("userID", newUser.getId())
        .withClaim("role", newUser.getRole())
        .sign(TokenUtils.getAlgorithm());

      returnMap.put("token", token);
    }
    return returnMap;
  }

  @CrossOrigin
  @PostMapping(
      path = "/validate",
      consumes = "application/json",
      produces = "application/json"
  )
  public Map<String, Object> validateID(@RequestBody Map<String, Object> body, @RequestAttribute("userName") String userName)
  {
    Map<String, Object> returnMap = new HashMap<>();

    try {
      if(userRepository.existsByUsername(userName))
      {
        JsonUtils.setStatus(returnMap, JsonUtils.SUCCESS);
      }
      else{
        JsonUtils.setStatus(returnMap, JsonUtils.ERROR);
      }

      return returnMap;
    } catch (JWTVerificationException e) {
      JsonUtils.setStatus(returnMap, JsonUtils.ERROR);
      return returnMap;
    }
  }
}
