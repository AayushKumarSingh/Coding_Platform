package com.platform.codingplatform.Controller;

import com.platform.codingplatform.model.User;
import com.platform.codingplatform.Service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthService authService;

    @PostMapping("/signup")
    public String signup(@RequestParam String username, @RequestParam String password) {
        authService.register(username, password);
        return "User registered successfully!";
    }

    @PostMapping("/login")
    public String login(@RequestParam String username, @RequestParam String password) {
        return authService.login(username, password) ? "Login successful!" : "Invalid credentials";
    }
}