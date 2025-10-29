package com.school.repository;

import com.school.model.Teacher;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.Optional;

public interface TeacherRepository extends MongoRepository<Teacher, String> {
    Optional<Teacher> findByMobile(String mobile);
}
