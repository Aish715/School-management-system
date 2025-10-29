package com.school.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List; // Import List

@Data
@Document(collection = "teachers")
public class Teacher {
    @Id
    private String id;
    private String name;
    private String subject; // Keep this as the primary subject if needed
    private String qualification;
    private String mobile; // Link to the user account

    // --- NEW FIELD ---
    // Stores a list of subject names the teacher is assigned to teach.
    private List<String> assignedSubjects; 
}