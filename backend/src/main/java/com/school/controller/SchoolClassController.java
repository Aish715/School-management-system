package com.school.controller;

import com.school.model.SchoolClass;
import com.school.repository.SchoolClassRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/classes")
@CrossOrigin(origins = "http://localhost:3000")
// REMOVED: @PreAuthorize("hasAuthority('ROLE_ADMIN')") - We'll apply it per method now
public class SchoolClassController {

    @Autowired
    private SchoolClassRepository schoolClassRepository;

    // GET all classes - NOW ACCESSIBLE BY ADMINS AND TEACHERS
    @GetMapping
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'ROLE_TEACHER')") // Allow both roles
    public ResponseEntity<List<SchoolClass>> getAllClasses() {
        List<SchoolClass> classes = schoolClassRepository.findAll();
        // Consider sorting by grade and section here if needed
        classes.sort((a, b) -> {
            if (a.getGrade() != b.getGrade()) return a.getGrade() - b.getGrade();
            return a.getSection().compareToIgnoreCase(b.getSection());
        });
        return ResponseEntity.ok(classes);
    }

    // POST a new class - REMAINS ADMIN ONLY
    @PostMapping
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<SchoolClass> addClass(@RequestBody SchoolClass schoolClass) {
        SchoolClass savedClass = schoolClassRepository.save(schoolClass);
        return ResponseEntity.ok(savedClass);
    }

    // PUT (Update) an existing class - REMAINS ADMIN ONLY
    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<SchoolClass> updateClass(@PathVariable String id, @RequestBody SchoolClass classDetails) {
        return schoolClassRepository.findById(id)
                .map(schoolClass -> {
                    schoolClass.setGrade(classDetails.getGrade());
                    schoolClass.setSection(classDetails.getSection());
                    schoolClass.setClassTeacherId(classDetails.getClassTeacherId());
                    schoolClass.setClassTeacherName(classDetails.getClassTeacherName());
                    SchoolClass updatedClass = schoolClassRepository.save(schoolClass);
                    return ResponseEntity.ok(updatedClass);
                }).orElse(ResponseEntity.notFound().build());
    }

    // DELETE a class - REMAINS ADMIN ONLY
    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<?> deleteClass(@PathVariable String id) {
        return schoolClassRepository.findById(id)
                .map(schoolClass -> {
                    schoolClassRepository.delete(schoolClass);
                    return ResponseEntity.ok().build();
                }).orElse(ResponseEntity.notFound().build());
    }
}

