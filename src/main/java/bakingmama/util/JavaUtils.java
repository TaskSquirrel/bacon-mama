package bakingmama.util;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public class JavaUtils {
  /**
   * Pretty BS method to handle Optionals
   */
  public static <T> T find(JpaRepository jpar, Object id) {
    Optional<T> optional = (Optional<T>) jpar.findById(JsonUtils.parseId(id));
    if (optional.isEmpty()) {
      return null;
    } else {
      return optional.get();
    }
  }
}
