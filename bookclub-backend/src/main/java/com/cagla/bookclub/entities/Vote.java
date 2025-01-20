package com.cagla.bookclub.entities;

import jakarta.persistence.Entity;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Table(uniqueConstraints = {
	    @UniqueConstraint(columnNames = {"user_id", "book_id"})
	})
@Entity
@Getter
@Setter
public class Vote {
	@Id
    @GeneratedValue
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne
    @JoinColumn(name = "book_id", nullable = false)
    private Book book;
}
