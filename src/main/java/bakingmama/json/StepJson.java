package bakingmama.json;

import bakingmama.models.Item;
import bakingmama.models.Step;
import bakingmama.persistence.StepPersistence;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.List;
import java.util.Map;

public class StepJson extends BaseJson {
  @Autowired
  StepPersistence sp;

  public StepJson(Map<String, Object> json) { super(json); }
  public StepJson(Map<String, Object> json, boolean filter) { super(json, "step"); }
  public StepJson(Object json) { super(json); }

  public Integer getSequence() { return (Integer) this.json.get("sequence"); }

  public String getVerb() { return (String) this.json.get("verb"); }

  public IngredientJson getResultJson() {
    return new IngredientJson(this.json.get("result"));
  }

  public List<Map<String, Object>> getIngredients() { return this.castListJson(this.json.get("dependencies")); }

  @Override
  public Step toModel() {
    return sp.findStep(this.json);
  }
}
