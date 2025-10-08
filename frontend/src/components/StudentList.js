import React, { useState, useEffect } from 'react';
import { getStudents, deleteStudent } from '../services/api';
import AddStudent from './AddStudent';
import EditStudent from './EditStudent'; // Import the new Edit component
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
    IconButton, // For icon buttons
    Dialog,     // For confirmation dialog
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

    // State for managing all the pop-up modals
    const [isAddModalOpen, setAddModalOpen] = useState(false);
    const [isEditModalOpen, setEditModalOpen] = useState(false);
    const [isDeleteConfirmOpen, setDeleteConfirmOpen] = useState(false);

    // State to keep track of which student is currently being edited or deleted
    const [selectedStudent, setSelectedStudent] = useState(null);

    useEffect(() => {
        fetchStudents();
    }, []);

    const fetchStudents = async () => {
        try {
            setLoading(true);
            const response = await getStudents();
            setStudents(response.data);
        } catch (err) {
            setError('Failed to fetch students.');
        } finally {
            setLoading(false);
        }
    };

    // --- Handlers for Opening Modals ---

    const handleOpenEditModal = (student) => {
        setSelectedStudent(student); // Store the student to be edited
        setEditModalOpen(true);      // Open the edit modal
    };

    const handleOpenDeleteConfirm = (student) => {
        setSelectedStudent(student);   // Store the student to be deleted
        setDeleteConfirmOpen(true);    // Open the confirmation dialog
    };

    // --- Handlers for API Actions ---

    const handleConfirmDelete = async () => {
        if (!selectedStudent) return;
        try {
            await deleteStudent(selectedStudent.id);
            // Remove the deleted student from the list in real-time for a smooth UX
            setStudents(students.filter(s => s.id !== selectedStudent.id));
            setDeleteConfirmOpen(false); // Close the confirmation dialog
            setSelectedStudent(null);    // Clear the selection
        } catch (err) {
            setError('Failed to delete student.');
        }
    };

    // --- Callback functions for real-time UI updates ---

    const handleStudentAdded = (newStudent) => {
        setStudents([...students, newStudent]);
    };

    const handleStudentUpdated = (updatedStudent) => {
        // Find the student in the list and replace it with the updated version
        setStudents(students.map(s => s.id === updatedStudent.id ? updatedStudent : s));
    };

    if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}><CircularProgress /></Box>;
    if (error) return <Typography color="error" sx={{ mt: 4 }}>{error}</Typography>;

    return (
        <Paper sx={{ width: '100%', overflow: 'hidden' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 2 }}>
                <Typography variant="h5">Student Roster</Typography>
                <Button variant="contained" startIcon={<AddIcon />} onClick={() => setAddModalOpen(true)}>
                    Add Student
                </Button>
            </Box>
            <TableContainer>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell sx={{ fontWeight: 'bold' }}>Name</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>Grade</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>Roll Number</TableCell>
                            <TableCell align="right" sx={{ fontWeight: 'bold' }}>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {students.map((student) => (
                            <TableRow hover key={student.id}>
                                <TableCell>{student.name}</TableCell>
                                <TableCell>{student.grade}</TableCell>
                                <TableCell>{student.rollNumber}</TableCell>
                                <TableCell align="right">
                                    {/* --- NEW: Edit and Delete Buttons --- */}
                                    <IconButton color="primary" onClick={() => handleOpenEditModal(student)}>
                                        <EditIcon />
                                    </IconButton>
                                    <IconButton color="error" onClick={() => handleOpenDeleteConfirm(student)}>
                                        <DeleteIcon />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* --- DIALOGS / MODALS --- */}
            <AddStudent open={isAddModalOpen} onClose={() => setAddModalOpen(false)} onStudentAdded={handleStudentAdded} />
            
            <EditStudent open={isEditModalOpen} onClose={() => setEditModalOpen(false)} onStudentUpdated={handleStudentUpdated} student={selectedStudent} />

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

