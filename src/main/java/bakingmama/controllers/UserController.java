package bakingmama.controllers;

import bakingmama.models.User;
import bakingmama.models.UserRepository;

import org.springframework.web.bind.annotation.*;

import java.util.Collection;

@RestController
public class UserController extends BaseApiController {
  private UserRepository userRepository;

  public UserController(UserRepository userRepository) {
    this.userRepository = userRepository;
  }

  @GetMapping("/users")
  Collection<User> users() {
    return userRepository.findAll();
  }
}
