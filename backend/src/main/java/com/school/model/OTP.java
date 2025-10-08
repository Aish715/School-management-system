package com.school.model;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "otps")
public class OTP {
    @Id
    private String id;
    private String mobile;
    private String code;
    private LocalDateTime expiryTime;
}
