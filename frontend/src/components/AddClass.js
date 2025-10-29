import React, { useState, useEffect } from 'react';
import { addClass, getTeachers } from '../services/api'; // Need getTeachers to populate dropdown
import {
    Button, TextField, Dialog, DialogActions, DialogContent, DialogTitle, CircularProgress, Alert,
    Select, MenuItem, InputLabel, FormControl // For Teacher dropdown
} from '@mui/material';

function AddClass({ open, onClose, onClassAdded }) {
    const [grade, setGrade] = useState('');
    const [section, setSection] = useState('');
    const [classTeacherId, setClassTeacherId] = useState('');
    const [teachers, setTeachers] = useState([]); // To store list of available teachers
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Fetch teachers when the modal opens
    useEffect(() => {
        if (open) {
            fetchTeachers();
        }
    }, [open]);

    const fetchTeachers = async () => {
        try {
            const response = await getTeachers();
            setTeachers(response.data);
        } catch (err) {
            console.error("Failed to fetch teachers for dropdown", err);
            setError("Could not load teacher list.");
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        const selectedTeacher = teachers.find(t => t.id === classTeacherId);
        const classData = {
            grade: parseInt(grade),
            section: section.toUpperCase(), // Standardize section to uppercase
            classTeacherId,
            classTeacherName: selectedTeacher ? selectedTeacher.name : 'Unassigned'
        };
        try {
            const response = await addClass(classData);
            onClassAdded(response.data);
            handleClose();
        } catch (err) {
            setError('Failed to add class.');
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        setGrade(''); setSection(''); setClassTeacherId(''); setError('');
        onClose();
    };

    return (
        <Dialog open={open} onClose={handleClose}>
            <DialogTitle>Add New Class</DialogTitle>
            <form onSubmit={handleSubmit}>
                <DialogContent>
                    {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
                    <TextField autoFocus margin="dense" label="Grade" type="number" fullWidth variant="outlined" value={grade} onChange={(e) => setGrade(e.target.value)} required />
                    <TextField margin="dense" label="Section (e.g., A, B)" type="text" fullWidth variant="outlined" value={section} onChange={(e) => setSection(e.target.value)} required inputProps={{ maxLength: 1 }} />
                    <FormControl fullWidth margin="dense" required>
                        <InputLabel id="teacher-select-label">Class Teacher</InputLabel>
                        <Select
                            labelId="teacher-select-label"
                            value={classTeacherId}
                            label="Class Teacher"
                            onChange={(e) => setClassTeacherId(e.target.value)}
                        >
                            <MenuItem value=""><em>Select a Teacher</em></MenuItem>
                            {teachers.map((teacher) => (
                                <MenuItem key={teacher.id} value={teacher.id}>
                                    {teacher.name} ({teacher.subject})
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} disabled={loading}>Cancel</Button>
                    <Button type="submit" variant="contained" disabled={loading}>
                        {loading ? <CircularProgress size={24} /> : 'Save Class'}
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
}

export default AddClass;
