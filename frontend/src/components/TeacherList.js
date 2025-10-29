import React, { useState, useEffect } from 'react';
import { getTeachers, deleteTeacher } from '../services/api';
import AddTeacher from './AddTeacher';
import EditTeacher from './EditTeacher'; // EditTeacher now handles assignedSubjects
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
    DialogTitle,
    Chip // Import Chip to display subjects nicely
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

function TeacherList() {
    const [teachers, setTeachers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [isAddModalOpen, setAddModalOpen] = useState(false);
    const [isEditModalOpen, setEditModalOpen] = useState(false);
    const [isDeleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
    const [selectedTeacher, setSelectedTeacher] = useState(null);

    useEffect(() => { fetchTeachers(); }, []);

    const fetchTeachers = async () => {
        try {
            setLoading(true);
            const response = await getTeachers();
            setTeachers(response.data);
            setError('');
        } catch (err) {
            setError('Failed to fetch teachers.');
            console.error("Fetch Teachers Error:", err);
        } finally {
            setLoading(false);
        }
    };

    // --- Handlers remain the same ---
    const handleOpenEditModal = (teacher) => { setSelectedTeacher(teacher); setEditModalOpen(true); };
    const handleOpenDeleteConfirm = (teacher) => { setSelectedTeacher(teacher); setDeleteConfirmOpen(true); };
    const handleConfirmDelete = async () => {
         if (!selectedTeacher) return;
        try {
            await deleteTeacher(selectedTeacher.id);
            setTeachers(teachers.filter(t => t.id !== selectedTeacher.id));
            setDeleteConfirmOpen(false); setSelectedTeacher(null);
        } catch (err) {
            setError('Failed to delete teacher.');
             // Keep modal open on error? Show error in modal?
            console.error("Delete Teacher Error:", err);
        }
    };
    const handleTeacherAdded = (newTeacher) => { setTeachers([...teachers, newTeacher]); };
    const handleTeacherUpdated = (updatedTeacher) => { setTeachers(teachers.map(t => t.id === updatedTeacher.id ? updatedTeacher : t)); };


    if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}><CircularProgress /></Box>;
    if (error) return <Typography color="error" sx={{ mt: 4, textAlign: 'center' }}>{error}</Typography>;

    return (
        <Paper sx={{ width: '100%', overflow: 'hidden' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 2 }}>
                <Typography variant="h5">Manage Teachers</Typography>
                <Button variant="contained" startIcon={<AddIcon />} onClick={() => setAddModalOpen(true)}>Add Teacher</Button>
            </Box>
            <TableContainer>
                <Table stickyHeader>
                    <TableHead>
                        <TableRow>
                            <TableCell sx={{ fontWeight: 'bold' }}>Name</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>Primary Subject</TableCell>
                            {/* --- NEW COLUMN --- */}
                            <TableCell sx={{ fontWeight: 'bold' }}>Assigned Subjects</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>Qualification</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>Mobile</TableCell>
                            <TableCell align="right" sx={{ fontWeight: 'bold' }}>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {teachers.map((teacher) => (
                            <TableRow hover key={teacher.id}>
                                <TableCell>{teacher.name}</TableCell>
                                <TableCell>{teacher.subject || 'N/A'}</TableCell>
                                {/* --- NEW CELL to display subjects --- */}
                                <TableCell>
                                    {/* Check if assignedSubjects exists and is an array */}
                                    {Array.isArray(teacher.assignedSubjects) && teacher.assignedSubjects.length > 0 ? (
                                        // Map through the array and display each subject as a Chip
                                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                            {teacher.assignedSubjects.map((subName) => (
                                                <Chip key={subName} label={subName} size="small" />
                                            ))}
                                        </Box>
                                    ) : (
                                        <Typography variant="body2" color="textSecondary">None</Typography> // Display 'None' if empty
                                    )}
                                </TableCell>
                                <TableCell>{teacher.qualification}</TableCell>
                                <TableCell>{teacher.mobile}</TableCell>
                                <TableCell align="right">
                                    <IconButton size="small" color="primary" onClick={() => handleOpenEditModal(teacher)}><EditIcon /></IconButton>
                                    <IconButton size="small" color="error" onClick={() => handleOpenDeleteConfirm(teacher)}><DeleteIcon /></IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* --- Modals remain the same --- */}
            <AddTeacher open={isAddModalOpen} onClose={() => setAddModalOpen(false)} onTeacherAdded={handleTeacherAdded} />
            <EditTeacher open={isEditModalOpen} onClose={() => setEditModalOpen(false)} onTeacherUpdated={handleTeacherUpdated} teacher={selectedTeacher} />
            <Dialog open={isDeleteConfirmOpen} onClose={() => setDeleteConfirmOpen(false)}>
                 <DialogTitle>Confirm Delete</DialogTitle>
                <DialogContent>
                    <DialogContentText>Are you sure you want to delete {selectedTeacher?.name}?</DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDeleteConfirmOpen(false)}>Cancel</Button>
                    <Button onClick={handleConfirmDelete} color="error">Delete</Button>
                </DialogActions>
            </Dialog>
        </Paper>
    );
}

export default TeacherList;