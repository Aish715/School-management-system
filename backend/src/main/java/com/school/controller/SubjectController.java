package com.school.controller;

import com.school.model.Subject;
import com.school.repository.SubjectRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/subjects")
@CrossOrigin(origins = "http://localhost:3000")
@PreAuthorize("hasAuthority('ROLE_ADMIN')") // Only Admins can manage subjects
public class SubjectController {

    @Autowired
    private SubjectRepository subjectRepository;

    // GET all subjects
    @GetMapping
    public ResponseEntity<List<Subject>> getAllSubjects() {
        List<Subject> subjects = subjectRepository.findAll();
        // Consider sorting alphabetically by name
        subjects.sort((s1, s2) -> s1.getName().compareToIgnoreCase(s2.getName()));
        return ResponseEntity.ok(subjects);
    }

    // POST a new subject
    @PostMapping
    public ResponseEntity<Subject> addSubject(@RequestBody Subject subject) {
        // Add validation later (e.g., check if code is unique if used)
        Subject savedSubject = subjectRepository.save(subject);
        return ResponseEntity.ok(savedSubject);
    }

    // PUT (Update) an existing subject
    @PutMapping("/{id}")
    public ResponseEntity<Subject> updateSubject(@PathVariable String id, @RequestBody Subject subjectDetails) {
        return subjectRepository.findById(id)
                .map(subject -> {
                    subject.setName(subjectDetails.getName());
                    subject.setCode(subjectDetails.getCode());
                    subject.setDescription(subjectDetails.getDescription());
                    Subject updatedSubject = subjectRepository.save(subject);
                    return ResponseEntity.ok(updatedSubject);
                }).orElse(ResponseEntity.notFound().build());
    }

    // DELETE a subject
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteSubject(@PathVariable String id) {
        return subjectRepository.findById(id)
                .map(subject -> {
                    subjectRepository.delete(subject);
                    return ResponseEntity.ok().build();
                }).orElse(ResponseEntity.notFound().build());
    }
}