package com.cagla.bookclub.services;

import java.time.LocalDateTime;
import java.util.Collections;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.cagla.bookclub.entities.Book;
import com.cagla.bookclub.entities.Discussion;
import com.cagla.bookclub.entities.User;
import com.cagla.bookclub.entities.Vote;
import com.cagla.bookclub.repositories.BookRepository;
import com.cagla.bookclub.repositories.DiscussionRepository;
import com.cagla.bookclub.repositories.VoteRepository;

@Service
public class VoteService {
    private final VoteRepository voteRepository;
    private final BookRepository bookRepository;
    private final DiscussionRepository discussionRepository;

    public VoteService(VoteRepository voteRepository, BookRepository bookRepository, DiscussionRepository discussionRepository) {
        this.voteRepository = voteRepository;
        this.bookRepository = bookRepository;
        this.discussionRepository = discussionRepository;
    }

    public void castVote(User user, Long bookId) {
        Book book = bookRepository.findById(bookId)
                .orElseThrow(() -> new IllegalArgumentException("Book not found"));

        List<Vote> userVotes = voteRepository.findByUser(user);

        if (!userVotes.isEmpty()) {
            voteRepository.deleteAll(userVotes);
        }

        Vote vote = new Vote();
        vote.setUser(user);
        vote.setBook(book);
        voteRepository.save(vote);
    }

    public int getVoteCount(Long bookId) {
        Book book = bookRepository.findById(bookId)
                .orElseThrow(() -> new IllegalArgumentException("Book not found"));
        return voteRepository.countByBook(book);
    }

    public List<Book> getWinningBooks() {
        List<Book> books = StreamSupport.stream(bookRepository.findAll().spliterator(), false)
                                        .collect(Collectors.toList());

        int maxVotes = books.stream()
                            .mapToInt(voteRepository::countByBook)
                            .max()
                            .orElse(0);

        if (maxVotes == 0) {
            return Collections.emptyList(); 
        }

        return books.stream()
                    .filter(book -> voteRepository.countByBook(book) == maxVotes)
                    .collect(Collectors.toList());
    }

    public void createDiscussionForWinner() {
        List<Book> winningBooks = getWinningBooks();

        if (winningBooks.isEmpty()) {
            //System.out.println("No votes were cast. No discussion will be created.");
            return;
        }

        if (winningBooks.size() == 1) {
            Book winningBook = winningBooks.get(0);

            if (discussionRepository.existsByBookId(winningBook.getId())) {
                System.out.println("Discussion already exists for book: " + winningBook.getTitle());
                return;
            }

            createDiscussion(winningBook);
        } else {
            System.out.println("Tie detected between books. Selecting the first book alphabetically.");

            Book selectedBook = winningBooks.stream()
                                             .min(Comparator.comparing(Book::getTitle))
                                             .orElseThrow(() -> new IllegalStateException("Tie resolution failed"));

            if (discussionRepository.existsByBookId(selectedBook.getId())) {
                System.out.println("Discussion already exists for book: " + selectedBook.getTitle());
                return;
            }

            createDiscussion(selectedBook);
        }

        resetVotes();
    }

    private void createDiscussion(Book book) {
        Discussion discussion = new Discussion();
        discussion.setBook(book);
        discussionRepository.save(discussion);

        book.setStatus(Book.BookStatus.ARCHIVED);
        bookRepository.save(book);

        System.out.println("Discussion created for: " + book.getTitle());
    }

    @Scheduled(fixedRate = 60000)
    public void checkAndCreateDiscussionAfterDeadline() {
        if (deadlineHasPassed() && !discussionAlreadyExists()) {
            createDiscussionForWinner();
        } else {
            // System.out.println("No new discussion created as conditions are not met.");
        }
    }

    public boolean deadlineHasPassed() {
        Iterable<Book> books = bookRepository.findAll();
        LocalDateTime now = LocalDateTime.now();

        return StreamSupport.stream(books.spliterator(), false)
                .allMatch(book -> book.getVotingDeadline() != null && now.isAfter(book.getVotingDeadline()));
    }

    private boolean discussionAlreadyExists() {
        Book winningBook = getWinningBooks().stream().findFirst().orElse(null);
        return winningBook != null && discussionRepository.existsByBookId(winningBook.getId());
    }

    public Vote getVoteByUser(User user) {
        List<Vote> votes = voteRepository.findByUser(user);
        return votes.isEmpty() ? null : votes.get(0);
    }

    private void resetVotes() {
        System.out.println("Resetting all votes...");
        voteRepository.deleteAll();
        System.out.println("All votes have been reset.");
    }
}

