package com.school.service;

import com.school.model.OTP;
import com.school.repository.OTPRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.Random;

@Service
public class OTPService {

    @Autowired
    private OTPRepository otpRepository;

    public String generateOTP(String mobile) {
        String code = String.format("%06d", new Random().nextInt(999999));

        OTP otp = new OTP();
        otp.setMobile(mobile);
        otp.setCode(code);
        otp.setExpiryTime(LocalDateTime.now().plusMinutes(5));
        otpRepository.save(otp);

        // This prints the OTP to your console so you know what to type
        System.out.println("************************************************************");
        System.out.println("OTP for " + mobile + " is: " + code);
        System.out.println("************************************************************");

        return code;
    }

    /**
     * Verifies the provided OTP against the database record.
     * Includes detailed logging to help diagnose issues.
     */
    public boolean verifyOTP(String mobile, String code) {
        System.out.println("--- OTPService: Searching database for mobile: " + mobile + " and code: " + code);

        // Step 1: Find the OTP in the database
        Optional<OTP> otpOptional = otpRepository.findByMobileAndCode(mobile, code);

        // Step 2: Check if an OTP was found at all
        if (otpOptional.isEmpty()) {
            System.out.println("--- OTPService: RESULT: No matching OTP found in the database. Verification failed.");
            return false;
        }

        System.out.println("--- OTPService: Found a matching OTP in the database. Now checking expiry time.");
        OTP otp = otpOptional.get();

        // Step 3: Check if the found OTP has expired
        boolean isExpired = otp.getExpiryTime().isBefore(LocalDateTime.now());

        if (isExpired) {
            System.out.println("--- OTPService: RESULT: OTP has expired. Verification failed.");
            // Optional: Clean up expired OTPs from the database
            // otpRepository.delete(otp);
            return false;
        }

        System.out.println("--- OTPService: RESULT: OTP is valid and not expired. Verification successful.");
        // Optional: Delete the OTP after successful verification so it can't be reused
        // otpRepository.delete(otp);
        return true;
    }
}

