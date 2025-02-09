package com.cagla.bookclub.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.cagla.bookclub.entities.Comment;

@Repository
public interface CommentRepository extends JpaRepository<Comment, Long> {
}