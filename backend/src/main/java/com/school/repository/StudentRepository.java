package com.school.repository;

import com.school.model.Student;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.Optional;

public interface StudentRepository extends MongoRepository<Student, String> {

    /**
     * Finds a student record by their mobile number.
     * Spring Data MongoDB automatically implements this method based on its name.
     *
     * @param mobile The mobile number to search for.
     * @return An Optional containing the student if found, or an empty Optional if not.
     */
    Optional<Student> findByMobile(String mobile);
}

