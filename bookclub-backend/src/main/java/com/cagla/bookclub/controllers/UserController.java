package com.cagla.bookclub.controllers;

import com.cagla.bookclub.entities.User;
import com.cagla.bookclub.services.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RequestMapping("/users")
@RestController
@CrossOrigin
public class UserController {
    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/me")
    //@CrossOrigin(origins = "http://localhost:3000", allowedHeaders = "*")
    public ResponseEntity<User> authenticatedUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        User currentUser = (User) authentication.getPrincipal();

        return ResponseEntity.ok(currentUser);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/admin/all")
    public ResponseEntity<Iterable<User>> allUsers() {
        return ResponseEntity.ok(userService.allUsers());
    }
    
    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/admin/{userId}/lock")
    public ResponseEntity<String> lockUser(@PathVariable Long userId) {
        userService.lockUser(userId);
        return ResponseEntity.ok("User account locked successfully.");
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/admin/{userId}/unlock")
    public ResponseEntity<String> unlockUser(@PathVariable Long userId) {
        userService.unlockUser(userId);
        return ResponseEntity.ok("User account unlocked successfully.");
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/admin/{userId}/enable")
    public ResponseEntity<String> enableUser(@PathVariable Long userId) {
        userService.enableUser(userId);
        return ResponseEntity.ok("User account enabled successfully.");
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/admin/{userId}/disable")
    public ResponseEntity<String> disableUser(@PathVariable Long userId) {
        userService.disableUser(userId);
        return ResponseEntity.ok("User account disabled successfully.");
    }

}