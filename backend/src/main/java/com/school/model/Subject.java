package com.school.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@Document(collection = "subjects") // Store in a 'subjects' collection
public class Subject {
    @Id
    private String id;
    private String name;        // e.g., "Mathematics", "Physics", "English Literature"
    private String code;        // Optional: A unique subject code, e.g., "MATH101", "PHY202"
    private String description; // Optional: A brief description of the subject
}