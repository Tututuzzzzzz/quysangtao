package com.leadsgen.quysangtao.repository;

import com.leadsgen.quysangtao.entity.Feedback;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FeedbackRepository extends JpaRepository<Feedback, Long> {
    List<Feedback> findByIdeaIdOrderByCreatedAtAsc(Long ideaId);
    void deleteByIdeaId(Long ideaId);
}
