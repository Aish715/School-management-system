package com.school.controller;

import com.school.model.Student;
import com.school.repository.StudentRepository;
import com.school.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/students")
@CrossOrigin(origins = "http://localhost:3000")
public class StudentController {

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private UserRepository userRepository; // Injected to potentially cross-reference user data in the future if needed

    /**
     * --- NEW ENDPOINT ---
     * Fetches the profile of the currently authenticated student.
     * It uses the security context to identify the user, ensuring a student can only see their own data.
     */
    @GetMapping("/me")
    public ResponseEntity<Student> getMyProfile() {
        // Step 1: Get the username (which is the mobile number) of the logged-in user.
        // This information is securely extracted from the JWT by our JwtRequestFilter.
        String mobile = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        // Step 2: Use the mobile number to find the corresponding student record.
        Optional<Student> studentOptional = studentRepository.findByMobile(mobile);

        // Step 3: Return the student data if found, otherwise return a 404 Not Found error.
        return studentOptional.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * READ all students (For Teacher role).
     */
    @GetMapping
    public ResponseEntity<List<Student>> getAllStudents() {
        List<Student> students = studentRepository.findAll();
        return ResponseEntity.ok(students);
    }

    /**
     * CREATE a new student (For Teacher role).
     */
    @PostMapping
    public ResponseEntity<Student> addStudent(@RequestBody Student student) {
        // You might want to add a mobile number to the student record when creating it
        // based on the associated user account.
        Student savedStudent = studentRepository.save(student);
        return ResponseEntity.ok(savedStudent);
    }

    /**
     * UPDATE an existing student (For Teacher role).
     */
    @PutMapping("/{id}")
    public ResponseEntity<Student> updateStudent(@PathVariable String id, @RequestBody Student studentDetails) {
        return studentRepository.findById(id)
                .map(student -> {
                    student.setName(studentDetails.getName());
                    student.setGrade(studentDetails.getGrade());
                    student.setRollNumber(studentDetails.getRollNumber());
                    student.setMobile(studentDetails.getMobile()); // Ensure mobile can be updated
                    Student updatedStudent = studentRepository.save(student);
                    return ResponseEntity.ok(updatedStudent);
                }).orElse(ResponseEntity.notFound().build());
    }

    /**
     * DELETE a student (For Teacher role).
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteStudent(@PathVariable String id) {
        return studentRepository.findById(id)
                .map(student -> {
                    studentRepository.delete(student);
                    return ResponseEntity.ok().build();
                }).orElse(ResponseEntity.notFound().build());
    }
}

