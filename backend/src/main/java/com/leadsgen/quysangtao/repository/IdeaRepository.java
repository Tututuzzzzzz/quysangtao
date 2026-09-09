package com.leadsgen.quysangtao.repository;

import com.leadsgen.quysangtao.entity.Idea;
import com.leadsgen.quysangtao.entity.IdeaStatus;
import com.leadsgen.quysangtao.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;

@Repository
public interface IdeaRepository extends JpaRepository<Idea, Long> {

    List<Idea> findByAuthorOrderByCreatedAtDesc(User author);

    List<Idea> findByStatus(IdeaStatus status);

    List<Idea> findAllByOrderByCreatedAtDesc();

    long countByStatus(IdeaStatus status);

    @Query("SELECT SUM(i.estimatedSavings) FROM Idea i WHERE i.status = 'IMPLEMENTED'")
    BigDecimal calculateTotalImplementedSavings();

    @Query("SELECT i.department, COUNT(i), SUM(CASE WHEN i.status = 'IMPLEMENTED' THEN 1 ELSE 0 END), COALESCE(SUM(i.estimatedSavings), 0) " +
           "FROM Idea i GROUP BY i.department")
    List<Object[]> getDepartmentStats();

    @Query("SELECT i.author, COUNT(i), SUM(CASE WHEN i.status = 'IMPLEMENTED' THEN 1 ELSE 0 END), COALESCE(SUM(i.score), 0), COALESCE(SUM(i.estimatedSavings), 0) " +
           "FROM Idea i GROUP BY i.author ORDER BY SUM(CASE WHEN i.status = 'IMPLEMENTED' THEN 1 ELSE 0 END) DESC, COALESCE(SUM(i.score), 0) DESC")
    List<Object[]> getUserLeaderboard();
}
