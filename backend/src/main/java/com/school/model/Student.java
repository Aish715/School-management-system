package com.school.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@Document(collection = "students")
public class Student {
    @Id
    private String id;
    private String name;
    private int grade;
    private String rollNumber;
    private String mobile;

    // --- NEW FIELDS ---
    private String section;
    private String profilePictureUrl;
}