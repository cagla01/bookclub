package com.cagla.bookclub.repositories;

import com.cagla.bookclub.entities.Book;


import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface BookRepository extends CrudRepository<Book, Long> {
	Book findFirstByVotingDeadlineBefore(LocalDateTime deadline);
	Iterable<Book> findByStatus(Book.BookStatus status);
	boolean existsByTitleAndAuthor(String title, String author);
}
