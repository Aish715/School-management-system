import axios from 'axios';

// The base URL of your Spring Boot backend
const API_BASE_URL = 'http://localhost:8080';

// Axios instance for public authentication routes (/auth/**)
const authApiClient = axios.create({
    baseURL: `${API_BASE_URL}/auth`
});

// Axios instance for protected API routes (/api/**)
const protectedApiClient = axios.create({
    baseURL: `${API_BASE_URL}/api`
});

// --- Axios Interceptor ---
// Automatically adds the JWT token (from localStorage) to the
// Authorization header for every request made with protectedApiClient.
protectedApiClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('authToken');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`; // Standard JWT format
        }
        return config;
    },
    (error) => {
        // Optionally handle errors globally here (e.g., redirect on 401 Unauthorized)
        return Promise.reject(error);
    }
);


// --- Authentication Functions ---
export const sendOtp = (mobile, role) => {
    const params = new URLSearchParams();
    params.append('mobile', mobile);
    params.append('role', role);
    return authApiClient.post(`/send-otp`, params);
};

export const verifyOtp = (mobile, code) => {
    const params = new URLSearchParams();
    params.append('mobile', mobile);
    params.append('code', code);
    return authApiClient.post(`/verify-otp`, params);
};


// --- Protected Student API Functions ---
export const getStudents = () => protectedApiClient.get('/students'); // Get all students (Teacher/Admin)
export const addStudent = (studentData) => protectedApiClient.post('/students', studentData); // Add student (Teacher/Admin)
export const updateStudent = (id, studentData) => protectedApiClient.put(`/students/${id}`, studentData); // Update student (Teacher/Admin)
export const deleteStudent = (id) => protectedApiClient.delete(`/students/${id}`); // Delete student (Teacher/Admin)
export const getStudentProfile = () => protectedApiClient.get('/students/me'); // Get logged-in student's profile (Student)


// --- Attendance API Functions ---
export const getAttendanceByDate = (date) => protectedApiClient.get(`/attendance/date/${date}`); // Get records for a date (Teacher)
export const saveAttendance = (attendanceList) => protectedApiClient.post('/attendance', attendanceList); // Save attendance (Teacher)
export const getMyAttendance = () => protectedApiClient.get('/attendance/student/me'); // Get logged-in student's history (Student)


// --- Protected Teacher API Functions (for Admins) ---
export const getTeachers = () => protectedApiClient.get('/teachers'); // Get all teachers (Admin)
export const addTeacher = (teacherData) => protectedApiClient.post('/teachers', teacherData); // Add teacher (Admin)
export const updateTeacher = (id, teacherData) => protectedApiClient.put(`/teachers/${id}`, teacherData); // Update teacher (Admin)
export const deleteTeacher = (id) => protectedApiClient.delete(`/teachers/${id}`); // Delete teacher (Admin)


// --- Protected Class API Functions (for Admins) ---
export const getClasses = () => protectedApiClient.get('/classes'); // Get all classes (Admin)
export const addClass = (classData) => protectedApiClient.post('/classes', classData); // Add class (Admin)
export const updateClass = (id, classData) => protectedApiClient.put(`/classes/${id}`, classData); // Update class (Admin)
export const deleteClass = (id) => protectedApiClient.delete(`/classes/${id}`); // Delete class (Admin)


// --- Protected Subject API Functions (for Admins) ---
export const getSubjects = () => protectedApiClient.get('/subjects'); // Get all subjects (Admin)
export const addSubject = (subjectData) => protectedApiClient.post('/subjects', subjectData); // Add subject (Admin)
export const updateSubject = (id, subjectData) => protectedApiClient.put(`/subjects/${id}`, subjectData); // Update subject (Admin)
export const deleteSubject = (id) => protectedApiClient.delete(`/subjects/${id}`); // Delete subject (Admin)
