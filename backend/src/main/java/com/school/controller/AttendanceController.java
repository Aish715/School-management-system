package com.school.controller;

import com.school.model.Attendance;
import com.school.model.Student;
import com.school.repository.AttendanceRepository;
import com.school.repository.StudentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/attendance")
@CrossOrigin(origins = "http://localhost:3000")
public class AttendanceController {

    @Autowired
    private AttendanceRepository attendanceRepository;
    
    @Autowired
    private StudentRepository studentRepository;

    // Endpoint for a teacher to submit attendance for multiple students
    @PostMapping
    public ResponseEntity<?> saveAttendance(@RequestBody List<Attendance> attendanceList) {
        // In a real app, you'd add more validation here
        attendanceRepository.saveAll(attendanceList);
        return ResponseEntity.ok().build();
    }
    
    // Endpoint to get attendance for a specific date (for teachers)
    @GetMapping("/date/{date}")
    public ResponseEntity<List<Attendance>> getAttendanceByDate(@PathVariable String date) {
        LocalDate localDate = LocalDate.parse(date);
        List<Attendance> attendanceRecords = attendanceRepository.findByDate(localDate);
        return ResponseEntity.ok(attendanceRecords);
    }

    // Endpoint for a logged-in student to get their own attendance
    @GetMapping("/student/me")
    public ResponseEntity<List<Attendance>> getMyAttendance() {
        String mobile = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        
        // Find the student by mobile number to get their ID
        Optional<Student> studentOptional = studentRepository.findByMobile(mobile);
        
        if (studentOptional.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        
        String studentId = studentOptional.get().getId();
        List<Attendance> myAttendance = attendanceRepository.findByStudentId(studentId);
        return ResponseEntity.ok(myAttendance);
    }
}
