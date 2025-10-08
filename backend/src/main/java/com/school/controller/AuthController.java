package com.school.controller;

import com.school.model.User;
import com.school.repository.UserRepository;
import com.school.service.OTPService;
import com.school.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = "http://localhost:3000")
public class AuthController {

    @Autowired
    private OTPService otpService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JwtUtil jwtUtil;

    // --- UPDATED ENDPOINT ---
    @PostMapping("/send-otp")
    public ResponseEntity<String> sendOtp(@RequestParam String mobile, @RequestParam String role) {
        // Step 1: Find the user by mobile number
        Optional<User> userOptional = userRepository.findByMobile(mobile);

        // Step 2: Check if user exists AND if their role matches the one selected on the frontend
        if (userOptional.isPresent() && userOptional.get().getRole().equalsIgnoreCase(role)) {
            // If both checks pass, generate and send the OTP
            otpService.generateOTP(mobile);
            return ResponseEntity.ok("OTP sent (check backend console).");
        } else {
            // If user doesn't exist or roles don't match, return an error.
            // We use a generic message for security.
            return ResponseEntity.badRequest().body("Invalid mobile number for the selected role.");
        }
    }

    @PostMapping("/verify-otp")
    public ResponseEntity<String> verifyOtp(@RequestParam String mobile, @RequestParam String code) {
        // This endpoint remains the same
        String trimmedMobile = mobile.trim();
        String trimmedCode = code.trim();

        if (otpService.verifyOTP(trimmedMobile, trimmedCode)) {
            User user = userRepository.findByMobile(trimmedMobile).orElseThrow();
            String token = jwtUtil.generateToken(user.getMobile(), user.getRole());
            return ResponseEntity.ok(token);
        } else {
            return ResponseEntity.badRequest().body("Invalid or expired OTP.");
        }
    }
}

