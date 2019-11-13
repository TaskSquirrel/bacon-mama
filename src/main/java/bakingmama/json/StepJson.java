package bakingmama.json;

import bakingmama.models.Step;
import bakingmama.persistence.StepPersistence;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.Map;

public class StepJson extends BaseJson {
  @Autowired
  StepPersistence sp;

  public StepJson(Map<String, Object> json) { super(json); }
  public StepJson(Map<String, Object> json, boolean filter) { super(json, "step"); }
  public StepJson(Object json) { super(json); }

  public Integer getSequence() { return (Integer) this.json.get("sequence"); }

  @Override
  public Step toModel() {
    return sp.findStep(this.json);
  }
}
