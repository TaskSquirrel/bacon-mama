package bakingmama.persistence;

import bakingmama.models.StepRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.Map;

@Component
public class StepPersistence {
  @Autowired
  StepRepository stepRepository;

  public Map<String, Object> editStep(Map<String, Object> map) {

  }
}
