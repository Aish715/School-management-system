package com.school.repository;

import com.school.model.SchoolClass;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface SchoolClassRepository extends MongoRepository<SchoolClass, String> {
    // Custom query to find classes by grade (optional, but useful)
    List<SchoolClass> findByGrade(int grade);
}
