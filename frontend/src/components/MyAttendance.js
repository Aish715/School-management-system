import React, { useState, useEffect } from 'react';
import { getMyAttendance } from '../services/api';
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
    CircularProgress,
    Alert
} from '@mui/material';

function MyAttendance() {
    const [attendanceRecords, setAttendanceRecords] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchMyAttendance = async () => {
            try {
                // Call the API endpoint to get the logged-in student's attendance
                const response = await getMyAttendance();
                // Sort the received records by date, showing the most recent first
                const sortedRecords = response.data.sort((a, b) => new Date(b.date) - new Date(a.date));
                setAttendanceRecords(sortedRecords);
            } catch (err) {
                setError('Failed to load your attendance history.');
                console.error("API Error:", err); // Log the actual error for debugging
            } finally {
                setLoading(false); // Stop showing the loading indicator
            }
        };
        fetchMyAttendance();
    }, []); // Empty dependency array ensures this runs only once when the component mounts

    // Show loading spinner while data is being fetched
    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}>
                <CircularProgress />
            </Box>
        );
    }

    // Show error message if the API call failed
    if (error) {
        return <Alert severity="error" sx={{ mt: 3 }}>{error}</Alert>;
    }

    return (
        <Paper sx={{ p: 3, width: '100%' }}>
            <Typography variant="h5" gutterBottom>My Attendance History</Typography>
            <TableContainer>
                <Table stickyHeader> {/* Makes header stick while scrolling */}
                    <TableHead>
                        <TableRow>
                            <TableCell sx={{ fontWeight: 'bold' }}>Date</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {/* Show a message if there are no records */}
                        {attendanceRecords.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={2} align="center">No attendance records found.</TableCell>
                            </TableRow>
                        ) : (
                            // Map through the attendance records and display each one
                            attendanceRecords.map(record => (
                                <TableRow hover key={record.id}>
                                    <TableCell>{record.date}</TableCell>
                                    <TableCell>{record.status}</TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
        </Paper>
    );
}

export default MyAttendance;

