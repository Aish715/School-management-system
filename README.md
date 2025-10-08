School Management System
A full-stack web application designed to streamline school operations, built with a modern and powerful technology stack. This system provides distinct, role-based portals for students and teachers, featuring secure authentication and a clean, responsive user interface.

✨ Features Implemented
The application currently includes the following core features:

Authentication & Security
Role-Based Login: Separate login flows for "Student" and "Teacher" roles.

OTP Authentication: A secure login system based on One-Time Passwords (currently displayed in the backend console for development).

Role Validation: The backend verifies that a user's phone number matches the role they selected before sending an OTP.

JWT Session Management: Uses JSON Web Tokens to secure API endpoints and manage user sessions after login.

Protected API Routes: All data-related API endpoints (/api/*) are protected and require a valid JWT.

Teacher Portal
Full CRUD for Students: Teachers have complete Create, Read, Update, and Delete functionality for managing student records.

Interactive Student Roster: A clean, sortable table displays a list of all students.

Modern UI Modals: Pop-up dialogs are used for adding new students and editing existing ones for a seamless user experience.

Safe Deletion: A confirmation dialog prevents accidental deletion of student records.

Student Portal
Personalized Dashboard: When a student logs in, they are greeted with their own profile.

"My Profile" View: Displays the student's own details, including:

Profile Picture

Name

Class (Grade) & Section

Roll Number

Registered Mobile Number

User Interface & Experience
Dynamic Login Screen: An engaging login page with a dark theme and a background of colorful, animated, floating equations.

Role-Aware Dashboard: The UI adapts based on the user's role. Students see a simplified view and cannot access teacher-specific features like "Student Management."

Material-UI Components: Built with a professional and responsive design using the Material-UI component library.

🛠️ Tech Stack
This project is divided into two main parts: a backend server and a frontend client.

Category

Technology

Backend

Java 17, Spring Boot, Spring Security, MongoDB, Maven, JJWT

Frontend

React, Material-UI, Axios, jwt-decode, CSS

Database

MongoDB

📂 Project Structure
The repository is organized into two main folders:

/backend: Contains the Spring Boot application (Java code).

/frontend: Contains the React application (JavaScript/JSX code).

🚀 Getting Started
Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

Prerequisites
Make sure you have the following software installed on your machine:

Java (JDK): Version 17 or higher.

Maven: For managing backend dependencies.

Node.js & npm: For managing frontend dependencies.

MongoDB: A running instance of the MongoDB database. MongoDB Compass is recommended for easier database management.

⚙️ Installation & Setup
1. Backend Server
# Navigate to the backend directory
cd backend

# (Optional) Clean and build the project with Maven
mvn clean install

# Run the Spring Boot application
mvn spring-boot:run

The backend server will start on http://localhost:8080.

2. Frontend Client
# Open a new terminal and navigate to the frontend directory
cd frontend

# Install all the required npm packages
npm install

# Run the React development server
npm start
