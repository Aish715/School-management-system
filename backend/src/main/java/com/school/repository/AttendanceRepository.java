package com.school.repository;

import com.school.model.Attendance;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.time.LocalDate;
import java.util.List;

public interface AttendanceRepository extends MongoRepository<Attendance, String> {
    // Finds all attendance records for a specific student
    List<Attendance> findByStudentId(String studentId);

    // Finds all attendance records for a specific date
    List<Attendance> findByDate(LocalDate date);
}
