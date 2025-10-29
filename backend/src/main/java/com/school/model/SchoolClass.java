package com.school.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@Document(collection = "classes") // Store in a 'classes' collection
public class SchoolClass {
    @Id
    private String id;
    private int grade;          // e.g., 10
    private String section;     // e.g., "A", "B"
    private String classTeacherId; // ID of the teacher assigned (from 'teachers' collection)
    private String classTeacherName; // Name for easier display
}
