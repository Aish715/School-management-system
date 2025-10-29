import React, { useState, useEffect } from 'react';
import { getSubjects, deleteSubject } from '../services/api';
import AddSubject from './AddSubject';
import EditSubject from './EditSubject';
import {
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, CircularProgress,
    Typography, Box, Button, IconButton, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import MenuBookIcon from '@mui/icons-material/MenuBook'; // Icon for subjects

function SubjectList() {
    const [subjects, setSubjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [isAddModalOpen, setAddModalOpen] = useState(false);
    const [isEditModalOpen, setEditModalOpen] = useState(false);
    const [isDeleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
    const [selectedSubject, setSelectedSubject] = useState(null);

    useEffect(() => { fetchSubjects(); }, []);

    const fetchSubjects = async () => {
        try {
            setLoading(true);
            const response = await getSubjects();
            setSubjects(response.data); // Already sorted by backend
        } catch (err) { setError('Failed to fetch subjects.'); }
        finally { setLoading(false); }
    };

    const handleOpenEditModal = (sub) => { setSelectedSubject(sub); setEditModalOpen(true); };
    const handleOpenDeleteConfirm = (sub) => { setSelectedSubject(sub); setDeleteConfirmOpen(true); };

    const handleConfirmDelete = async () => {
        try {
            await deleteSubject(selectedSubject.id);
            setSubjects(subjects.filter(s => s.id !== selectedSubject.id));
            setDeleteConfirmOpen(false); setSelectedSubject(null);
        } catch (err) { setError('Failed to delete subject.'); }
    };

    const handleSubjectAdded = (newSubject) => {
         setSubjects([...subjects, newSubject].sort((a,b) => a.name.localeCompare(b.name))); // Keep sorted
    };
    const handleSubjectUpdated = (updatedSubject) => {
        setSubjects(subjects.map(s => s.id === updatedSubject.id ? updatedSubject : s).sort((a,b) => a.name.localeCompare(b.name))); // Keep sorted
    };

    if (loading) return <CircularProgress />;
    if (error) return <Typography color="error">{error}</Typography>;

    return (
        <Paper sx={{ width: '100%', overflow: 'hidden' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 2 }}>
                <Typography variant="h5">Manage Subjects</Typography>
                <Button variant="contained" startIcon={<AddIcon />} onClick={() => setAddModalOpen(true)}>Add Subject</Button>
            </Box>
            <TableContainer>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Name</TableCell>
                            <TableCell>Code</TableCell>
                            <TableCell>Description</TableCell>
                            <TableCell align="right">Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {subjects.map((sub) => (
                            <TableRow hover key={sub.id}>
                                <TableCell>{sub.name}</TableCell>
                                <TableCell>{sub.code || 'N/A'}</TableCell>
                                <TableCell>{sub.description || 'N/A'}</TableCell>
                                <TableCell align="right">
                                    <IconButton color="primary" onClick={() => handleOpenEditModal(sub)}><EditIcon /></IconButton>
                                    <IconButton color="error" onClick={() => handleOpenDeleteConfirm(sub)}><DeleteIcon /></IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <AddSubject open={isAddModalOpen} onClose={() => setAddModalOpen(false)} onSubjectAdded={handleSubjectAdded} />
            <EditSubject open={isEditModalOpen} onClose={() => setEditModalOpen(false)} onSubjectUpdated={handleSubjectUpdated} subject={selectedSubject} />
            <Dialog open={isDeleteConfirmOpen} onClose={() => setDeleteConfirmOpen(false)}>
                <DialogTitle>Confirm Delete</DialogTitle>
                <DialogContent>
                    <DialogContentText>Are you sure you want to delete the subject "{selectedSubject?.name}"?</DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDeleteConfirmOpen(false)}>Cancel</Button>
                    <Button onClick={handleConfirmDelete} color="error">Delete</Button>
                </DialogActions>
            </Dialog>
        </Paper>
    );
}

export default SubjectList;