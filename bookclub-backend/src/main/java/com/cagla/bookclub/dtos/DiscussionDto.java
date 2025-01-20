package com.cagla.bookclub.dtos;

import java.util.List;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class DiscussionDto {
    private Long id;
    private String bookTitle;
    private String bookAuthor;
    private String bookDescription;
    private String bookImageUrl;
    private List<CommentDto> comments;
}

