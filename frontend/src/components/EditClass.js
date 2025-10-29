import React, { useState, useEffect } from 'react';
import { updateClass, getTeachers } from '../services/api';
import {
    Button, TextField, Dialog, DialogActions, DialogContent, DialogTitle, CircularProgress, Alert,
    Select, MenuItem, InputLabel, FormControl
} from '@mui/material';

function EditClass({ open, onClose, onClassUpdated, schoolClass }) {
    const [grade, setGrade] = useState('');
    const [section, setSection] = useState('');
    const [classTeacherId, setClassTeacherId] = useState('');
    const [teachers, setTeachers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (schoolClass) {
            setGrade(schoolClass.grade);
            setSection(schoolClass.section);
            setClassTeacherId(schoolClass.classTeacherId || ''); // Handle case where teacher might be unassigned
            fetchTeachers(); // Fetch teachers for the dropdown
        }
    }, [schoolClass]);

    const fetchTeachers = async () => {
        try {
            const response = await getTeachers();
            setTeachers(response.data);
        } catch (err) {
            console.error("Failed to fetch teachers", err);
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
            section: section.toUpperCase(),
            classTeacherId,
            classTeacherName: selectedTeacher ? selectedTeacher.name : 'Unassigned'
        };
        try {
            const response = await updateClass(schoolClass.id, classData);
            onClassUpdated(response.data);
            handleClose();
        } catch (err) {
            setError('Failed to update class.');
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => { setError(''); onClose(); };
    if (!open || !schoolClass) return null;

    return (
        <Dialog open={open} onClose={handleClose}>
            <DialogTitle>Edit Class Details</DialogTitle>
            <form onSubmit={handleSubmit}>
                <DialogContent>
                    {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
                    <TextField autoFocus margin="dense" label="Grade" type="number" fullWidth variant="outlined" value={grade} onChange={(e) => setGrade(e.target.value)} required />
                    <TextField margin="dense" label="Section (e.g., A, B)" type="text" fullWidth variant="outlined" value={section} onChange={(e) => setSection(e.target.value)} required inputProps={{ maxLength: 1 }}/>
                     <FormControl fullWidth margin="dense" required>
                        <InputLabel id="edit-teacher-select-label">Class Teacher</InputLabel>
                        <Select
                            labelId="edit-teacher-select-label"
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
                        {loading ? <CircularProgress size={24} /> : 'Save Changes'}
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
}

export default EditClass;
