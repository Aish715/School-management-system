import React, { useState, useEffect } from 'react';
import { getStudents, getAttendanceByDate, saveAttendance } from '../services/api';
import {
    Box,
    Typography,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Radio,
    RadioGroup,
    FormControlLabel,
    Button,
    CircularProgress,
    Alert
} from '@mui/material';
// Import Date Picker components
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs'; // Import dayjs for date handling

function TakeAttendance() {
    const [students, setStudents] = useState([]);
    const [attendance, setAttendance] = useState({}); // Stores { studentId: status }
    const [selectedDate, setSelectedDate] = useState(dayjs()); // Default to today's date
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(''); // State for success messages

    // This effect runs whenever 'selectedDate' changes
    useEffect(() => {
        // Load the student list and any existing attendance for the newly selected date
        loadDataForDate(selectedDate);
    }, [selectedDate]);

    // Function to load student list and existing attendance for a specific date
    const loadDataForDate = async (date) => {
        setLoading(true);
        setError('');
        setSuccess(''); // Clear previous messages
        try {
            const dateString = date.format('YYYY-MM-DD'); // Format date as YYYY-MM-DD for the API

            // Fetch students and existing attendance records for the date concurrently
            const [studentsRes, attendanceRes] = await Promise.all([
                getStudents(), // Gets the full list of students
                getAttendanceByDate(dateString) // Gets attendance records specifically for this date
            ]);

            setStudents(studentsRes.data); // Store the list of students

            // Convert the fetched attendance records into a map (studentId -> status) for quick lookup
            const attendanceMap = attendanceRes.data.reduce((acc, record) => {
                acc[record.studentId] = record.status;
                return acc;
            }, {});

            // Initialize the 'attendance' state object for the UI
            const initialAttendance = {};
            studentsRes.data.forEach(student => {
                // For each student, check if an attendance record already exists for this date.
                // If yes, use that status. If no, default to 'Present'.
                initialAttendance[student.id] = attendanceMap[student.id] || 'Present';
            });
            setAttendance(initialAttendance); // Set the state to pre-fill the radio buttons

        } catch (err) {
            setError('Failed to load student or attendance data.');
            console.error("API Error:", err);
        } finally {
            setLoading(false); // Stop the loading indicator
        }
    };

    // Called when a teacher clicks a radio button for a student
    const handleStatusChange = (studentId, status) => {
        // Update the 'attendance' state object with the new status for the specific student
        setAttendance(prev => ({ ...prev, [studentId]: status }));
    };

    // Called when the "Save Attendance" button is clicked
    const handleSubmit = async () => {
        setLoading(true);
        setError('');
        setSuccess('');
        try {
            // Convert the 'attendance' state object into an array suitable for the backend API
            const attendanceList = Object.keys(attendance).map(studentId => ({
                studentId: studentId,
                // Include studentName as required by the backend Attendance model
                studentName: students.find(s => s.id === studentId)?.name || 'Unknown',
                date: selectedDate.format('YYYY-MM-DD'),
                status: attendance[studentId]
            }));

            // Send the data to the backend
            await saveAttendance(attendanceList);
            setSuccess('Attendance saved successfully!'); // Show success message
            // Optionally, you could reload the data here to confirm, but usually not needed
            // loadDataForDate(selectedDate);
        } catch (err) {
            setError('Failed to save attendance. Please try again.');
            console.error("API Error:", err);
        } finally {
            setLoading(false); // Stop the loading indicator
        }
    };

    return (
        // DatePicker needs to be wrapped in LocalizationProvider
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Paper sx={{ p: 3, width: '100%' }}>
                {/* Header section with Title and DatePicker */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                    <Typography variant="h5">Take Attendance</Typography>
                    <DatePicker
                        label="Select Date"
                        value={selectedDate}
                        onChange={(newDate) => setSelectedDate(newDate || dayjs())} // Update state when date changes
                    />
                </Box>

                {/* Display Error or Success messages */}
                {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
                {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

                {/* Show loading spinner or the attendance table */}
                {loading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', my: 3 }}><CircularProgress /></Box>
                 ) : (
                    <TableContainer>
                        <Table stickyHeader>
                            <TableHead>
                                <TableRow>
                                    <TableCell sx={{ fontWeight: 'bold' }}>Student Name</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold', minWidth: 300 }}>Status</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {/* Map through the students list and create a row for each */}
                                {students.map(student => (
                                    <TableRow hover key={student.id}>
                                        <TableCell>{student.name}</TableCell>
                                        <TableCell>
                                            {/* Radio buttons for Present/Absent/Late */}
                                            <RadioGroup
                                                row
                                                // The value is controlled by the 'attendance' state object
                                                value={attendance[student.id] || 'Present'}
                                                // When changed, call handleStatusChange
                                                onChange={(e) => handleStatusChange(student.id, e.target.value)}
                                            >
                                                <FormControlLabel value="Present" control={<Radio size="small" />} label="Present" />
                                                <FormControlLabel value="Absent" control={<Radio size="small" />} label="Absent" />
                                                <FormControlLabel value="Late" control={<Radio size="small" />} label="Late" />
                                            </RadioGroup>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                )}

                {/* Save Button */}
                <Button variant="contained" onClick={handleSubmit} sx={{ mt: 3 }} disabled={loading}>
                    {loading ? <CircularProgress size={24} /> : 'Save Attendance'}
                </Button>
            </Paper>
        </LocalizationProvider>
    );
}

export default TakeAttendance;

