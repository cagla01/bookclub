package com.cagla.bookclub.repositories;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.cagla.bookclub.entities.Book;
import com.cagla.bookclub.entities.Discussion;

@Repository
public interface DiscussionRepository extends JpaRepository<Discussion, Long> {
    Discussion findByBook(Book book);
    boolean existsByBookId(Long bookId);
    
    @Query("SELECT d FROM Discussion d LEFT JOIN FETCH d.comments")
    List<Discussion> findAllWithComments();
    
    @EntityGraph(attributePaths = "comments")
    Optional<Discussion> findById(Long id);
}
