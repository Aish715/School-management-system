package com.school.controller;

import com.school.model.Teacher;
import com.school.repository.TeacherRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/teachers")
@CrossOrigin(origins = "http://localhost:3000")
@PreAuthorize("hasAuthority('ROLE_ADMIN')") // Only Admins can access
public class TeacherController {

    @Autowired
    private TeacherRepository teacherRepository;

    // GET all teachers
    @GetMapping
    public ResponseEntity<List<Teacher>> getAllTeachers() {
        List<Teacher> teachers = teacherRepository.findAll();
        return ResponseEntity.ok(teachers);
    }

    // POST a new teacher
    @PostMapping
    public ResponseEntity<Teacher> addTeacher(@RequestBody Teacher teacher) {
        // Ensure assignedSubjects is initialized if null, though frontend should handle this
        if (teacher.getAssignedSubjects() == null) {
            teacher.setAssignedSubjects(new java.util.ArrayList<>());
        }
        Teacher savedTeacher = teacherRepository.save(teacher);
        return ResponseEntity.ok(savedTeacher);
    }

    // PUT (Update) an existing teacher
    @PutMapping("/{id}")
    public ResponseEntity<Teacher> updateTeacher(@PathVariable String id, @RequestBody Teacher teacherDetails) {
        return teacherRepository.findById(id)
                .map(teacher -> {
                    // Update all standard fields
                    teacher.setName(teacherDetails.getName());
                    teacher.setSubject(teacherDetails.getSubject()); // Keep primary subject
                    teacher.setQualification(teacherDetails.getQualification());
                    teacher.setMobile(teacherDetails.getMobile());

                    // --- THIS IS THE KEY CHANGE ---
                    // Update the list of assigned subjects
                    teacher.setAssignedSubjects(teacherDetails.getAssignedSubjects());

                    Teacher updatedTeacher = teacherRepository.save(teacher);
                    return ResponseEntity.ok(updatedTeacher);
                }).orElse(ResponseEntity.notFound().build());
    }

    // DELETE a teacher
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteTeacher(@PathVariable String id) {
        return teacherRepository.findById(id)
                .map(teacher -> {
                    teacherRepository.delete(teacher);
                    return ResponseEntity.ok().build();
                }).orElse(ResponseEntity.notFound().build());
    }
}