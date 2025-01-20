package com.cagla.bookclub.controllers;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/auth/messages")
@CrossOrigin(origins = "http://localhost:3000")
public class MessageController {

    @GetMapping("/welcome")
    public ResponseEntity<String> getWelcomeMessage() {
        return ResponseEntity.ok("Welcome to the application!");
    }
}