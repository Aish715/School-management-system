import React, { useState, useEffect } from 'react';
import { getStudents, deleteStudent } from '../services/api';
import AddStudent from './AddStudent';
import EditStudent from './EditStudent'; // The EditStudent component now handles class assignment
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    CircularProgress,
    Typography,
    Box,
    Button,
    IconButton,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

function StudentList() {
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [isAddModalOpen, setAddModalOpen] = useState(false);
    const [isEditModalOpen, setEditModalOpen] = useState(false);
    const [isDeleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
    const [selectedStudent, setSelectedStudent] = useState(null);

    // Fetch student list on component mount
    useEffect(() => {
        fetchStudents();
    }, []);

    const fetchStudents = async () => {
        try {
            setLoading(true);
            const response = await getStudents();
            setStudents(response.data);
            setError(''); // Clear any previous errors
        } catch (err) {
            setError('Failed to fetch students.');
            console.error("Fetch Students Error:", err);
        } finally {
            setLoading(false);
        }
    };

    // --- Handlers for opening modals ---
    const handleOpenEditModal = (student) => {
        setSelectedStudent(student);
        setEditModalOpen(true);
    };

    const handleOpenDeleteConfirm = (student) => {
        setSelectedStudent(student);
        setDeleteConfirmOpen(true);
    };

    // --- Handler for confirming deletion ---
    const handleConfirmDelete = async () => {
        if (!selectedStudent) return;
        try {
            await deleteStudent(selectedStudent.id);
            // Update UI immediately by removing the student from the list
            setStudents(students.filter(s => s.id !== selectedStudent.id));
            setDeleteConfirmOpen(false);
            setSelectedStudent(null);
        } catch (err) {
            setError('Failed to delete student.');
            console.error("Delete Student Error:", err);
            // Keep the modal open if delete fails? Or add error display in modal?
            // For now, just log error and close modal.
            setDeleteConfirmOpen(false);
            setSelectedStudent(null);
        }
    };

    // --- Callbacks for updating the list after Add/Edit ---
    const handleStudentAdded = (newStudent) => {
        setStudents([...students, newStudent]); // Add new student to the end of the list
    };

    const handleStudentUpdated = (updatedStudent) => {
        // Find the student in the list and replace them with the updated data
        setStudents(students.map(s => s.id === updatedStudent.id ? updatedStudent : s));
    };

    // --- Render loading state ---
    if (loading) {
        return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}><CircularProgress /></Box>;
    }

    // --- Render error state ---
    if (error) {
        return <Typography color="error" sx={{ mt: 4, textAlign: 'center' }}>{error}</Typography>;
    }

    // --- Render main component ---
    return (
        <Paper sx={{ width: '100%', overflow: 'hidden' }}>
            {/* Header with Title and Add Button */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 2 }}>
                <Typography variant="h5">Student Roster</Typography>
                <Button variant="contained" startIcon={<AddIcon />} onClick={() => setAddModalOpen(true)}>
                    Add Student
                </Button>
            </Box>

            {/* Student Table */}
            <TableContainer>
                <Table stickyHeader aria-label="student table">
                    <TableHead>
                        <TableRow>
                            <TableCell sx={{ fontWeight: 'bold' }}>Name</TableCell>
                            {/* --- CHANGED: Show Class Name instead of just Grade --- */}
                            <TableCell sx={{ fontWeight: 'bold' }}>Class</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>Roll Number</TableCell>
                            <TableCell align="right" sx={{ fontWeight: 'bold' }}>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {students.map((student) => (
                            <TableRow hover key={student.id}>
                                <TableCell>{student.name}</TableCell>
                                {/* --- CHANGED: Display schoolClassName or fallback --- */}
                                <TableCell>{student.schoolClassName || `Grade ${student.grade}` || 'N/A'}</TableCell>
                                <TableCell>{student.rollNumber}</TableCell>
                                <TableCell align="right">
                                    {/* Action Buttons */}
                                    <IconButton color="primary" size="small" onClick={() => handleOpenEditModal(student)}><EditIcon /></IconButton>
                                    <IconButton color="error" size="small" onClick={() => handleOpenDeleteConfirm(student)}><DeleteIcon /></IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* --- Modals for Add/Edit/Delete --- */}
            <AddStudent
                open={isAddModalOpen}
                onClose={() => setAddModalOpen(false)}
                onStudentAdded={handleStudentAdded}
            />

            <EditStudent
                open={isEditModalOpen}
                onClose={() => setEditModalOpen(false)}
                onStudentUpdated={handleStudentUpdated}
                student={selectedStudent} // Pass the selected student to the Edit form
            />

            <Dialog open={isDeleteConfirmOpen} onClose={() => setDeleteConfirmOpen(false)}>
                <DialogTitle>Confirm Delete</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to delete the student "{selectedStudent?.name}"? This action cannot be undone.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDeleteConfirmOpen(false)}>Cancel</Button>
                    <Button onClick={handleConfirmDelete} color="error">Delete</Button>
                </DialogActions>
            </Dialog>
        </Paper>
    );
}

export default StudentList;

