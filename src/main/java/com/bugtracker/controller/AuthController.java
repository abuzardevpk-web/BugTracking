package com.bugtracker.controller;

import com.bugtracker.entity.User;
import com.bugtracker.entity.Role;
import com.bugtracker.repository.UserRepository;
import com.bugtracker.security.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    @PostMapping("/register")
    public String register(@RequestBody User user) {

        // Use the role provided in the request, or default to DEVELOPER
        if (user.getRole() == null) {
            user.setRole(Role.DEVELOPER);
        }

        user.setPassword(passwordEncoder.encode(user.getPassword()));
        userRepository.save(user);

        return "User registered successfully";
    }

    @PostMapping("/login")
    public org.springframework.http.ResponseEntity<?> login(@RequestBody User request) {
        try {
            User user = userRepository.findByEmail(request.getEmail())
                    .orElse(null);

            if (user == null || !passwordEncoder.matches(request.getPassword(), user.getPassword())) {
                return org.springframework.http.ResponseEntity.status(401).body("Invalid email or password");
            }

            String token = jwtService.generateToken(user.getEmail());
            return org.springframework.http.ResponseEntity.ok(new java.util.HashMap<String, Object>() {
                {
                    put("token", token);
                    put("email", user.getEmail());
                    put("name", user.getName());
                    put("id", user.getId());
                    put("role", user.getRole() != null ? user.getRole().name() : null);
                }
            });
        } catch (Exception e) {
            return org.springframework.http.ResponseEntity.status(500).body("Login error: " + e.getMessage());
        }
    }
}
