package com.cagla.bookclub.controllers;

import com.cagla.bookclub.entities.User;
import com.cagla.bookclub.dtos.LoginUserDto;
import com.cagla.bookclub.dtos.RegisterUserDto;
import com.cagla.bookclub.responses.LoginResponse;
import com.cagla.bookclub.services.AuthenticationService;
import com.cagla.bookclub.services.JwtService;
import com.cagla.bookclub.services.UserService;

import java.util.Base64;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RequestMapping("/auth")
@RestController
@CrossOrigin
public class AuthenticationController {
    private final JwtService jwtService;
    
    private final AuthenticationService authenticationService;
    private final AuthenticationManager authenticationManager;
    private final UserService userService;

    public AuthenticationController(JwtService jwtService, AuthenticationService authenticationService, AuthenticationManager authenticationManager, UserService userService) {
    	this.jwtService = jwtService;
        this.authenticationService = authenticationService;
        this.authenticationManager = authenticationManager;
        this.userService = userService;
    }
    
    @PostMapping("/signup")
    public ResponseEntity<LoginResponse> registerUser(@RequestBody RegisterUserDto registerUserDto) {
        User registeredUser = authenticationService.registerUser(registerUserDto);
        String jwtToken = jwtService.generateToken(registeredUser);
        String refreshToken = jwtService.generateRefreshToken(registeredUser);

        LoginResponse loginResponse = new LoginResponse()
            .setToken(jwtToken)
            .setExpiresIn(jwtService.getExpirationTime())
            .setRefreshToken(refreshToken);

        return ResponseEntity.ok(loginResponse);
    }

    @GetMapping("/login")
    public ResponseEntity<LoginResponse> login(@RequestHeader("Authorization") String authHeader) {
        if (authHeader == null || !authHeader.startsWith("Basic ")) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);
        }

        String base64Credentials = authHeader.substring(6);
        String credentials = new String(Base64.getDecoder().decode(base64Credentials));
        String[] values = credentials.split(":", 2);

        String email = values[0];
        String password = values[1];

        try {
            UsernamePasswordAuthenticationToken authRequest =
                    new UsernamePasswordAuthenticationToken(email, password);
            Authentication auth = authenticationManager.authenticate(authRequest);

            if (auth.isAuthenticated()) {
                User user = (User) auth.getPrincipal();

                String accessToken = jwtService.generateToken(user);
                String refreshToken = jwtService.generateRefreshToken(user);

                LoginResponse loginResponse = new LoginResponse()
                    .setToken(accessToken)
                    .setExpiresIn(jwtService.getExpirationTime())
                    .setRefreshToken(refreshToken);

                return ResponseEntity.ok(loginResponse);
            } else {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);
        }
    }
    /*
    @PostMapping("/login")
    public ResponseEntity<LoginResponse> authenticate(@RequestBody LoginUserDto loginUserDto) {
        User authenticatedUser = authenticationService.authenticate(loginUserDto);

        String jwtToken = jwtService.generateToken(authenticatedUser);

        LoginResponse loginResponse = new LoginResponse().setToken(jwtToken).setExpiresIn(jwtService.getExpirationTime());

        return ResponseEntity.ok(loginResponse);
    }
    */
    
    @PostMapping("/admin/signup")
    public User registerAdmin(@RequestBody RegisterUserDto registerUserDto) {
        return authenticationService.registerAdmin(registerUserDto);
    }
    
    @GetMapping("/current-user")
    public ResponseEntity<UserDetails> getCurrentUser(@AuthenticationPrincipal UserDetails userDetails) {
        if (userDetails == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        return ResponseEntity.ok(userDetails);
    }
    
    @PostMapping("/refresh-token")
    public ResponseEntity<LoginResponse> refreshToken(@RequestBody Map<String, String> requestBody) {
        String refreshToken = requestBody.get("refreshToken");
        try {
            String username = jwtService.extractUsername(refreshToken);
            UserDetails userDetails = userService.findByEmail(username);

            if (jwtService.isRefreshTokenValid(refreshToken, userDetails)) {
                String newAccessToken = jwtService.generateToken(userDetails);

                LoginResponse response = new LoginResponse()
                    .setToken(newAccessToken)
                    .setExpiresIn(jwtService.getExpirationTime());
                return ResponseEntity.ok(response);
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);
        }
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);
    }


}