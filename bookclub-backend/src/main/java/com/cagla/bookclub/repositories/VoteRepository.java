package com.cagla.bookclub.repositories;

import java.util.List;
import java.util.Optional;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import com.cagla.bookclub.entities.Book;
import com.cagla.bookclub.entities.User;
import com.cagla.bookclub.entities.Vote;

@Repository
public interface VoteRepository extends CrudRepository<Vote, Long> {
    Vote findByUserAndBook(User user, Book book);
    List<Vote> findByUser(User user);
    int countByBook(Book book);
}

