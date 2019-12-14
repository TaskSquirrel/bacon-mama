package bakingmama.models;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.Set;

@Repository
public interface ItemRepository extends JpaRepository<Item, Long> {
  List<Item> findByCreator(User creator);

  List<Item> findByItemNameContaining(String itemName);
}
