package com.school.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDate;

@Data
@Document(collection = "attendance")
public class Attendance {
    @Id
    private String id;
    private String studentId;
    private String studentName; // For easier display on the frontend
    private LocalDate date;
    private String status; // e.g., "Present", "Absent", "Late"
}