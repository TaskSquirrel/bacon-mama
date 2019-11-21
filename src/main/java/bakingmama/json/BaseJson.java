package bakingmama.json;

import java.util.List;
import java.util.Map;

public class BaseJson {

  Map<String, Object> json;

  BaseJson(Map<String, Object> json) { this.json = json; }
  BaseJson(Map<String, Object> json, String filter) { this.json = this.castJson(json.get(filter)); }
  BaseJson(Object json) { this.json = this.castJson(json); }

  Map<String, Object> castJson(Object json) {
    return (Map<String, Object>) json;
  }
  List<Map<String, Object>> castListJson(Object listMap) { return (List<Map<String, Object>>) listMap; }

  public Long getId() { return this.parseId(this.json.get("id")); }

  Long parseId(Object id) {
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

  public Object toModel() {
    throw new UnsupportedOperationException("toModel() is not implemented for class!");
  }

  public boolean isNull() { return this.json == null; }
}
