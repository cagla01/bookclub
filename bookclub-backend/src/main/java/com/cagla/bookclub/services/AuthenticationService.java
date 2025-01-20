package com.cagla.bookclub.services;

import com.cagla.bookclub.dtos.LoginUserDto;
import com.cagla.bookclub.dtos.RegisterUserDto;
import com.cagla.bookclub.entities.Role;
import com.cagla.bookclub.entities.User;
import com.cagla.bookclub.repositories.UserRepository;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthenticationService {
    private final UserRepository userRepository;
    
    private final PasswordEncoder passwordEncoder;
    
    private final AuthenticationManager authenticationManager;

    public AuthenticationService(
        UserRepository userRepository,
        AuthenticationManager authenticationManager,
        PasswordEncoder passwordEncoder
    ) {
        this.authenticationManager = authenticationManager;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public User registerUser(RegisterUserDto registerUserDto) {
        User user = new User();
        user.setFullName(registerUserDto.getFullName())
            .setEmail(registerUserDto.getEmail())
            .setPassword(passwordEncoder.encode(registerUserDto.getPassword()))
            .setRole(Role.USER);

        return userRepository.save(user);
    }

    public User registerAdmin(RegisterUserDto registerUserDto) {
        User user = new User();
        user.setFullName(registerUserDto.getFullName())
            .setEmail(registerUserDto.getEmail())
            .setPassword(passwordEncoder.encode(registerUserDto.getPassword()))
            .setRole(Role.ADMIN);

        return userRepository.save(user);
    }

    public User authenticate(LoginUserDto input) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        input.getEmail(),
                        input.getPassword()
                )
        );

        return userRepository.findByEmail(input.getEmail())
                .orElseThrow();
    }
}