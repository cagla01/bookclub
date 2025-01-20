package com.cagla.bookclub.controllers;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.hibernate.Hibernate;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.cagla.bookclub.dtos.CommentDto;
import com.cagla.bookclub.dtos.DiscussionDto;
import com.cagla.bookclub.entities.Comment;
import com.cagla.bookclub.entities.Discussion;
import com.cagla.bookclub.entities.User;
import com.cagla.bookclub.repositories.CommentRepository;
import com.cagla.bookclub.repositories.DiscussionRepository;
import com.cagla.bookclub.repositories.UserRepository;
import com.cagla.bookclub.services.DiscussionService;

@RestController
@RequestMapping("/api/discussions")
public class DiscussionController {
	private final DiscussionRepository discussionRepository;
    private final CommentRepository commentRepository;
    private final DiscussionService discussionService;
    private final UserRepository userRepository;

    public DiscussionController(DiscussionRepository discussionRepository, CommentRepository commentRepository, DiscussionService discussionService, UserRepository userRepository) {
        this.discussionRepository = discussionRepository;
        this.commentRepository = commentRepository;
        this.discussionService = discussionService;
        this.userRepository = userRepository;
    }

    @GetMapping
    public List<DiscussionDto> getAllDiscussions() {
        return discussionService.getAllDiscussions();
    }
    
    @GetMapping("/{discussionId}")
    @Transactional
    public DiscussionDto getDiscussionById(@PathVariable Long discussionId) {
        Discussion discussion = discussionRepository.findById(discussionId)
                .orElseThrow(() -> new RuntimeException("Discussion not found"));

        Hibernate.initialize(discussion.getComments());

        DiscussionDto discussionDto = new DiscussionDto();
        discussionDto.setId(discussion.getId());
        discussionDto.setBookTitle(discussion.getBook().getTitle());
        discussionDto.setBookAuthor(discussion.getBook().getAuthor());
        discussionDto.setBookDescription(discussion.getBook().getDescription());
        discussionDto.setBookImageUrl(discussion.getBook().getImageUrl());
        discussionDto.setComments(
            discussion.getComments().stream()
                      .map(comment -> {
                          return new CommentDto(
                              comment.getId(),
                              comment.getContent(),
                              comment.getUser().getEmail(),
                              comment.getUser().getFullName()
                          );
                      })
                      .collect(Collectors.toList())
        );

        return discussionDto;
    }
    
    @PostMapping("/{discussionId}/comments")
    public CommentDto addComment(@PathVariable Long discussionId, @RequestBody String content, @AuthenticationPrincipal User user) {
        Discussion discussion = discussionRepository.findById(discussionId)
                .orElseThrow(() -> new RuntimeException("Discussion not found"));
      
        Comment comment = new Comment();
        comment.setDiscussion(discussion);
        comment.setUser(user);
        comment.setContent(content);

        Comment savedComment = commentRepository.save(comment);

        return discussionService.convertCommentToDto(savedComment);
    }

    
    @PutMapping("/comments/{commentId}")
    public CommentDto updateComment(@PathVariable Long commentId, 
                                    @RequestBody Map<String, String> body, 
                                    @AuthenticationPrincipal User user) {
        String content = body.get("content");

        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new RuntimeException("Comment not found"));

        if (!comment.getUser().getId().equals(user.getId()) &&
            user.getAuthorities().stream().noneMatch(auth -> auth.getAuthority().equals("ROLE_ADMIN"))) {
            throw new IllegalStateException("You are not authorized to edit this comment!");
        }

        comment.setContent(content);
        Comment updatedComment = commentRepository.save(comment);

        return discussionService.convertCommentToDto(updatedComment);
    }

    @DeleteMapping("/comments/{commentId}")
    public ResponseEntity<Void> deleteComment(@PathVariable Long commentId, @AuthenticationPrincipal User user) {
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new RuntimeException("Comment not found"));

        if (!comment.getUser().getId().equals(user.getId()) &&
                user.getAuthorities().stream().noneMatch(auth -> auth.getAuthority().equals("ROLE_ADMIN"))) {
            throw new RuntimeException("You are not allowed to delete this comment");
        }

        commentRepository.delete(comment);
        return ResponseEntity.noContent().build();
    }
}
