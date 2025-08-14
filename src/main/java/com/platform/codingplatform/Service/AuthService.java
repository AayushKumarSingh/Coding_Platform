package com.platform.codingplatform.Service;

import com.platform.codingplatform.model.User;
import com.platform.codingplatform.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    private BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();

    public User register(String username, String password) {
        String encodedPassword = encoder.encode(password);
        User user = User.builder().username(username).password(encodedPassword).build();
        return userRepository.save(user);
    }

    public boolean login(String username, String password) {
        return userRepository.findByUsername(username)
                .map(user -> encoder.matches(password, user.getPassword()))
                .orElse(false);
    }
}
