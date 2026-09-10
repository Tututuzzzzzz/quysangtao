package com.leadsgen.quysangtao.repository;

import com.leadsgen.quysangtao.entity.IdeaHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface IdeaHistoryRepository extends JpaRepository<IdeaHistory, Long> {
    List<IdeaHistory> findByIdeaIdOrderByCreatedAtAsc(Long ideaId);
    void deleteByIdeaId(Long ideaId);
}
