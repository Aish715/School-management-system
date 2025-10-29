package com.school.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Data // Lombok annotation to automatically generate getters, setters, toString, etc.
@Document(collection = "students") // Maps this class to the 'students' collection in MongoDB
public class Student {
    @Id // Marks this field as the primary identifier in MongoDB
    private String id;

    private String name;
    private int grade; // The numerical grade level (e.g., 9, 10, 11, 12)
    private String rollNumber;
    private String mobile; // The student's 10-digit mobile number, used for linking to the 'users' collection
    private String section; // The section within the grade (e.g., "A", "B")
    private String profilePictureUrl; // URL to the student's profile picture

    // --- NEW FIELDS to link Student to a SchoolClass ---
    private String schoolClassId;     // The MongoDB _id of the assigned class from the 'classes' collection
    private String schoolClassName; // A display-friendly name for the class (e.g., "10-A", "9-B")
}

