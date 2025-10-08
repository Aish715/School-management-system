package com.school.repository;

import com.school.model.OTP;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.Optional;

public interface OTPRepository extends MongoRepository<OTP, String> {
    Optional<OTP> findByMobileAndCode(String mobile, String code);
}
