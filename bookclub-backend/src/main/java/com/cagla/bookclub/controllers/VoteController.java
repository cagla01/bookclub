package com.cagla.bookclub.controllers;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.cagla.bookclub.entities.User;
import com.cagla.bookclub.entities.Vote;
import com.cagla.bookclub.services.UserService;
import com.cagla.bookclub.services.VoteService;

@RestController
@RequestMapping("/votes")
public class VoteController {
	
	private final UserService userService;
    private final VoteService voteService;

    public VoteController(UserService userService, VoteService voteService) {
        this.userService = userService;
        this.voteService = voteService;
    }

	
	@PostMapping("/{id}")
	public ResponseEntity<Void> castVote(
	        @PathVariable Long id,
	        @AuthenticationPrincipal UserDetails userDetails
	) {
	    if (userDetails == null) {
	        return ResponseEntity.status(401).build();
	    }
	    User user = userService.findByEmail(userDetails.getUsername());
	    voteService.castVote(user, id);
	    return ResponseEntity.ok().build();
	}
	
	@GetMapping("/user")
    public ResponseEntity<?> getUserVote(@AuthenticationPrincipal UserDetails userDetails) {
        if (userDetails == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User not authenticated.");
        }

        User user = userService.findByEmail(userDetails.getUsername());
        Vote userVote = voteService.getVoteByUser(user);
        if (userVote == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("No active vote.");
        }

        return ResponseEntity.ok(userVote.getBook());
    }
}
