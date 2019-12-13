package bakingmama.models;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface HistoryRepository  extends JpaRepository<History, Long> {
  List<History> findByStudentId(Long studentId);
}
