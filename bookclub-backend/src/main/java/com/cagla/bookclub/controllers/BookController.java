package com.cagla.bookclub.controllers;

import com.cagla.bookclub.dtos.BookDto;
import com.cagla.bookclub.entities.Book;
import com.cagla.bookclub.entities.User;
import com.cagla.bookclub.services.BookService;

import lombok.AllArgsConstructor;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.Optional;
import java.util.stream.StreamSupport;

@RestController
@RequestMapping("/api/books")
@AllArgsConstructor
public class BookController {
    private final BookService bookService;

    @GetMapping
    public Iterable<Book> getAllBooks() {
        return bookService.getAllBooks();
    }
    
    @GetMapping("/available")
    public Iterable<Book> getAvailableBooks() {
        return bookService.getBooksByStatus(Book.BookStatus.AVAILABLE);
    }
    
    @GetMapping("/{id}")
    public Book getBookById(@PathVariable Long id) {
        return bookService.getBookById(id);
    }

    @PostMapping
    public ResponseEntity<?> createBook(
        @RequestBody BookDto bookDto,
        @AuthenticationPrincipal User user
    ) {
        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User must be logged in to add a book!");
        }

        try {
            String bookTitle = bookDto.getTitle();
            String bookAuthor = bookDto.getAuthor();
            String imageUrl = bookService.fetchBookCoverFromGoogleBooks(bookTitle, bookAuthor);

            if (imageUrl == null) {
                imageUrl = "https://example.com/default-image.jpg";
            }

            Book createdBook = bookService.createBook(bookDto, user, imageUrl);
            return ResponseEntity.ok(createdBook);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }


    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteBook(@PathVariable Long id, @AuthenticationPrincipal User user) {
        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User must be logged in to delete a book!");
        }

        try {
            bookService.deleteBook(id, user);
            return ResponseEntity.ok("Book deleted successfully!");
        } catch (IllegalStateException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(e.getMessage());
        }
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<?> updateBook(
        @PathVariable Long id,
        @RequestBody BookDto bookDto,
        @AuthenticationPrincipal User user
    ) {
        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User must be logged in to update a book!");
        }

        try {
            String updatedImageUrl = bookService.fetchBookCoverFromGoogleBooks(bookDto.getTitle(), bookDto.getAuthor());

            if (updatedImageUrl == null) {
                updatedImageUrl = "https://example.com/default-image.jpg";
            }

            Book updatedBook = bookService.updateBook(id, bookDto, user, updatedImageUrl);
            return ResponseEntity.ok(updatedBook);
        } catch (IllegalStateException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(e.getMessage());
        }
    }

    
    @PatchMapping("/admin/set-deadline")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> setGlobalVotingDeadline(@RequestBody Map<String, Object> payload) {
        if (payload.containsKey("deadline")) {
            String deadlineStr = (String) payload.get("deadline");
            LocalDateTime deadline = LocalDateTime.parse(deadlineStr);
            bookService.setGlobalVotingDeadline(deadline);
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.badRequest().build();
    }

    
    @GetMapping("/deadline/{id}")
    public ResponseEntity<LocalDateTime> getBookDeadline(@PathVariable Long id) {
        Book book = bookService.getBookById(id);
        if (book.getVotingDeadline() == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
        return ResponseEntity.ok(book.getVotingDeadline());
    }
    
    @GetMapping("/global-deadline")
    public ResponseEntity<LocalDateTime> getGlobalVotingDeadline() {
        Iterable<Book> books = bookService.getAllBooks();
        Optional<Book> anyBookWithDeadline = StreamSupport.stream(books.spliterator(), false)
                .filter(book -> book.getVotingDeadline() != null)
                .findFirst();

        if (anyBookWithDeadline.isPresent()) {
            return ResponseEntity.ok(anyBookWithDeadline.get().getVotingDeadline());
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }
}
