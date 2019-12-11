package bakingmama.util;

import java.util.HashMap;
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

  public static Map<String, Object> returnSuccess() {
    Map<String, Object> map = new HashMap<>();
    map.put(STATUS, SUCCESS);
    return map;
  }

  public static Map<String, Object> returnError(String message) {
    Map<String, Object> errorMap = new HashMap<>();
    errorMap.put(STATUS, ERROR);
    errorMap.put(MESSAGE, message);
    return errorMap;
  }

  // Parses ID into Long for searching
  public static Long parseId(Object id) {
    if (id instanceof String) {
      id = Integer.parseInt((String) id);
    }

    Long l;
    try {
      l = (Long) id;
    } catch (ClassCastException cce) {
      l = (Long) ((Integer) id).longValue();
    }
    return l;
  }

  public static Map<String, Object> castMap(Object map) {
    return (Map<String, Object>) map;
  }

}
