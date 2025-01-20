package com.cagla.bookclub.services;

import com.cagla.bookclub.dtos.BookDto;
import com.cagla.bookclub.entities.Book;
import com.cagla.bookclub.entities.Book.BookStatus;
import com.cagla.bookclub.entities.User;
import com.cagla.bookclub.repositories.BookRepository;

import java.time.LocalDateTime;

import org.json.JSONObject;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class BookService {
    private final BookRepository bookRepository;
    private LocalDateTime globalVotingDeadline;
    private final RestTemplate restTemplate;

    public BookService(BookRepository bookRepository, RestTemplate restTemplate) {
        this.bookRepository = bookRepository;
        this.restTemplate = restTemplate;
    }

    public Book createBook(BookDto bookDto, User user, String imageUrl) {
    	if (bookRepository.existsByTitleAndAuthor(bookDto.getTitle(), bookDto.getAuthor())) {
            throw new IllegalArgumentException("A book with the same title and author already exists.");
        }
    	
        Book book = new Book();
        book.setTitle(bookDto.getTitle());
        book.setAuthor(bookDto.getAuthor());
        book.setDescription(bookDto.getDescription());
        book.setImageUrl(imageUrl);
        book.setCreatedBy(user);
        book.setStatus(BookStatus.AVAILABLE);
        if (globalVotingDeadline != null) {
            book.setVotingDeadline(globalVotingDeadline);
        }

        return bookRepository.save(book);
    }

    public Iterable<Book> getAllBooks() {
        return bookRepository.findAll();
    }

    public void deleteBook(Long id, User user) {
        Book book = bookRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Book with ID " + id + " not found"));

        if (!book.getCreatedBy().getId().equals(user.getId()) &&
            !user.getAuthorities().stream().anyMatch(auth -> auth.getAuthority().equals("ROLE_ADMIN"))) {
            throw new IllegalStateException("You are not authorized to delete this book!");
        }

        bookRepository.deleteById(id);
    }
    
    public Book updateBook(Long id, BookDto bookDto, User user, String updatedImageUrl) {
        Book book = bookRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Book with ID " + id + " not found"));

        if (!book.getCreatedBy().getId().equals(user.getId()) &&
            !user.getAuthorities().stream().anyMatch(auth -> auth.getAuthority().equals("ROLE_ADMIN"))) {
            throw new IllegalStateException("You are not authorized to update this book!");
        }

        book.setTitle(bookDto.getTitle());
        book.setAuthor(bookDto.getAuthor());
        book.setDescription(bookDto.getDescription());
        book.setImageUrl(updatedImageUrl);

        return bookRepository.save(book);
    }

    
    public Book getBookById(Long id) {
        return bookRepository.findById(id)
            .orElseThrow(() -> new IllegalArgumentException("Book not found with id: " + id));
    }
    
    public Iterable<Book> getBooksByStatus(Book.BookStatus status) {
        return bookRepository.findByStatus(status);
    }
    
    public void setVotingDeadline(Long bookId, LocalDateTime deadline) {
        Book book = bookRepository.findById(bookId)
                .orElseThrow(() -> new IllegalArgumentException("Book not found"));
        book.setVotingDeadline(deadline);
        bookRepository.save(book);
    }

    public void setGlobalVotingDeadline(LocalDateTime deadline) {
    	this.globalVotingDeadline = deadline;
        Iterable<Book> books = bookRepository.findAll();
        for (Book book : books) {
            book.setVotingDeadline(deadline);
        }
        bookRepository.saveAll(books);
    }


    public LocalDateTime getBookVotingDeadline(Long bookId) {
        Book book = bookRepository.findById(bookId)
            .orElseThrow(() -> new IllegalArgumentException("Book not found with id: " + bookId));
        return book.getVotingDeadline();
    }
    
    public LocalDateTime getGlobalVotingDeadline() {
        return globalVotingDeadline;
    }
    
    public String fetchBookCoverFromGoogleBooks(String title, String author) {
        String googleBooksApiUrl = "https://www.googleapis.com/books/v1/volumes?q=intitle:" + title + "+inauthor:" + author + "&key=AIzaSyBsbTHJSs4JEKLR7Lne2K7UHz3KHxxP4Rc";

        try {
            ResponseEntity<String> response = restTemplate.getForEntity(googleBooksApiUrl, String.class);

            if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
                JSONObject jsonResponse = new JSONObject(response.getBody());
                if (jsonResponse.has("items")) {
                    JSONObject firstBook = jsonResponse.getJSONArray("items").getJSONObject(0);
                    JSONObject volumeInfo = firstBook.getJSONObject("volumeInfo");

                    if (volumeInfo.has("imageLinks")) {
                        return volumeInfo.getJSONObject("imageLinks").getString("thumbnail");
                    }
                }
            }
        } catch (Exception e) {
            System.err.println("Error fetching book cover: " + e.getMessage());
        }

        return null;
    }
}
