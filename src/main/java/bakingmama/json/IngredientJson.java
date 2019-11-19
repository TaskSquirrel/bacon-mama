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
    Object itemObj = this.json.get("item");
    if (itemObj != null) {
      Map<String, Object> itemJson = this.castJson(itemObj);
      Long itemID = this.parseId(itemJson.get("id"));
      resultItem = sp.findItem(itemID);
    }
    return resultItem;
  }

  public Double getAmount() {
    Double d;
    Object amount = this.json.get("amount");
    try {
      d = (Double) amount;
    } catch (Exception e) {
      Integer i = (Integer) amount;
      d = i.doubleValue();
    }

    return d;
  }

  public String getUnit() { return (String) this.json.get("unit"); }
}