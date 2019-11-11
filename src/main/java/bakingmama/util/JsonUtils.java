package bakingmama.util;

import java.util.Map;

public class JsonUtils {
  public static String SUCCESS = "OK";
  public static String ERROR = "error";

  public static String STATUS = "status";
  public static String MESSAGE = "message";

  public static void setStatus(Map<String, Object> json, String status) {
    setStatus(json, status, "");
  }

  public static void setStatus(Map<String, Object> json, String status, String message) {
    json.put(STATUS, status);
    json.put(MESSAGE, message);
  }

  // Parses ID into Long for searching
  public static Long parseId(Object id) {
    Long l;
    try {
      l = (Long) id;
    } catch (ClassCastException cce) {
      l = (Long) ((Integer) id).longValue();
    }
    return l;
  }
}
