import React, { useState, useEffect } from 'react';
import { getClasses, deleteClass } from '../services/api';
import AddClass from './AddClass';
import EditClass from './EditClass';
import {
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, CircularProgress,
    Typography, Box, Button, IconButton, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SchoolIcon from '@mui/icons-material/School'; // Icon for classes

function ClassList() {
    const [classes, setClasses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [isAddModalOpen, setAddModalOpen] = useState(false);
    const [isEditModalOpen, setEditModalOpen] = useState(false);
    const [isDeleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
    const [selectedClass, setSelectedClass] = useState(null);

    useEffect(() => { fetchClasses(); }, []);

    const fetchClasses = async () => {
        try {
            setLoading(true);
            const response = await getClasses();
            // Sort classes by grade, then section
            const sortedClasses = response.data.sort((a, b) => {
                if (a.grade !== b.grade) return a.grade - b.grade;
                return a.section.localeCompare(b.section);
            });
            setClasses(sortedClasses);
        } catch (err) { setError('Failed to fetch classes.'); }
        finally { setLoading(false); }
    };

    const handleOpenEditModal = (cls) => { setSelectedClass(cls); setEditModalOpen(true); };
    const handleOpenDeleteConfirm = (cls) => { setSelectedClass(cls); setDeleteConfirmOpen(true); };

    const handleConfirmDelete = async () => {
        try {
            await deleteClass(selectedClass.id);
            setClasses(classes.filter(c => c.id !== selectedClass.id));
            setDeleteConfirmOpen(false); setSelectedClass(null);
        } catch (err) { setError('Failed to delete class.'); }
    };

    const handleClassAdded = (newClass) => {
         setClasses([...classes, newClass].sort((a, b) => { // Keep sorted
            if (a.grade !== b.grade) return a.grade - b.grade;
            return a.section.localeCompare(b.section);
         }));
    };
    const handleClassUpdated = (updatedClass) => {
        setClasses(classes.map(c => c.id === updatedClass.id ? updatedClass : c).sort((a, b) => { // Keep sorted
            if (a.grade !== b.grade) return a.grade - b.grade;
            return a.section.localeCompare(b.section);
         }));
    };

    if (loading) return <CircularProgress />;
    if (error) return <Typography color="error">{error}</Typography>;

    return (
        <Paper sx={{ width: '100%', overflow: 'hidden' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 2 }}>
                <Typography variant="h5">Manage Classes</Typography>
                <Button variant="contained" startIcon={<AddIcon />} onClick={() => setAddModalOpen(true)}>Add Class</Button>
            </Box>
            <TableContainer>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Grade</TableCell>
                            <TableCell>Section</TableCell>
                            <TableCell>Class Teacher</TableCell>
                            <TableCell align="right">Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {classes.map((cls) => (
                            <TableRow hover key={cls.id}>
                                <TableCell>{cls.grade}</TableCell>
                                <TableCell>{cls.section}</TableCell>
                                <TableCell>{cls.classTeacherName || 'N/A'}</TableCell>
                                <TableCell align="right">
                                    <IconButton color="primary" onClick={() => handleOpenEditModal(cls)}><EditIcon /></IconButton>
                                    <IconButton color="error" onClick={() => handleOpenDeleteConfirm(cls)}><DeleteIcon /></IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <AddClass open={isAddModalOpen} onClose={() => setAddModalOpen(false)} onClassAdded={handleClassAdded} />
            <EditClass open={isEditModalOpen} onClose={() => setEditModalOpen(false)} onClassUpdated={handleClassUpdated} schoolClass={selectedClass} />
            <Dialog open={isDeleteConfirmOpen} onClose={() => setDeleteConfirmOpen(false)}>
                <DialogTitle>Confirm Delete</DialogTitle>
                <DialogContent>
                    <DialogContentText>Are you sure you want to delete Class {selectedClass?.grade}{selectedClass?.section}?</DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDeleteConfirmOpen(false)}>Cancel</Button>
                    <Button onClick={handleConfirmDelete} color="error">Delete</Button>
                </DialogActions>
            </Dialog>
        </Paper>
    );
}

export default ClassList;
