package com.cagla.bookclub.repositories;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import com.cagla.bookclub.entities.Event;

@Repository
public interface EventRepository extends CrudRepository<Event, Long> {

}
