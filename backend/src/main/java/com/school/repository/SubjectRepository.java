package com.school.repository;

import com.school.model.Subject;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.Optional;

public interface SubjectRepository extends MongoRepository<Subject, String> {
    // Optional: Find subject by code if you implement unique codes
    Optional<Subject> findByCode(String code);
}