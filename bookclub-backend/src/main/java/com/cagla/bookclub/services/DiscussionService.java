package com.cagla.bookclub.services;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.cagla.bookclub.dtos.CommentDto;
import com.cagla.bookclub.dtos.DiscussionDto;
import com.cagla.bookclub.entities.Book;
import com.cagla.bookclub.entities.Comment;
import com.cagla.bookclub.entities.Discussion;
import com.cagla.bookclub.repositories.DiscussionRepository;

@Service
public class DiscussionService {
	
	private final DiscussionRepository discussionRepository;
	
	public DiscussionService(DiscussionRepository discussionRepository) {
		this.discussionRepository = discussionRepository;
	}
	
	public Discussion getDiscussionById(Long id) {
        return discussionRepository.findById(id)
            .orElseThrow(() -> new IllegalArgumentException("Discussion not found with id: " + id));
    }
	
	@Transactional
    public List<DiscussionDto> getAllDiscussions() {
        List<Discussion> discussions = discussionRepository.findAll();
        return discussions.stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }
	
	
	public DiscussionDto convertToDto(Discussion discussion) {
        DiscussionDto dto = new DiscussionDto();
        dto.setId(discussion.getId());
        Book book = discussion.getBook(); 
        dto.setBookTitle(book.getTitle());
        dto.setBookAuthor(book.getAuthor());
        dto.setBookDescription(book.getDescription());
        dto.setBookImageUrl(book.getImageUrl());
        dto.setComments(discussion.getComments().stream()
                                    .map(this::convertCommentToDto)
                                    .collect(Collectors.toList()));
        return dto;
    }


	public CommentDto convertCommentToDto(Comment comment) {
	    return new CommentDto(
	        comment.getId(),
	        comment.getContent(),
	        comment.getUser().getUsername(), 
	        comment.getUser().getFullName()                      
	    );
	}
}
