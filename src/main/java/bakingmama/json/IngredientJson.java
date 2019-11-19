package bakingmama.json;

import bakingmama.models.Item;
import bakingmama.persistence.StepPersistence;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.Map;

public class IngredientJson extends BaseJson {
  @Autowired
  StepPersistence sp;

  public IngredientJson(Map<String, Object> json) { super(json); }
  public IngredientJson(Object json) { super(json); }

  public Item getItem() {
    Item resultItem = null;
    Object itemJson = this.json.get("item");
    if (itemJson != null && this.castJson(itemJson).containsKey("id")) {
      resultItem = sp.findItem(this.castJson(itemJson).get("id"));
    }
    return resultItem;
  }

  public Double getAmount() { return (Double) this.json.get("amount"); }

  public String getUnit() { return (String) this.json.get("unit"); }
}