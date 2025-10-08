import React, { useState, useEffect } from 'react';
import { updateStudent } from '../services/api';
import {
    Button,
    TextField,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    CircularProgress,
    Alert
} from '@mui/material';

function EditStudent({ open, onClose, onStudentUpdated, student }) {
    const [name, setName] = useState('');
    const [grade, setGrade] = useState('');
    const [rollNumber, setRollNumber] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // When the 'student' prop changes (i.e., when the user clicks Edit),
    // pre-fill the form with that student's data.
    useEffect(() => {
        if (student) {
            setName(student.name);
            setGrade(student.grade);
            setRollNumber(student.rollNumber);
        }
    }, [student]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        const studentData = {
            name,
            grade: parseInt(grade),
            rollNumber
        };

        try {
            const response = await updateStudent(student.id, studentData);
            onStudentUpdated(response.data); // Pass updated student to parent
            handleClose();
        } catch (err) {
            setError('Failed to update student. Please try again.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        setError('');
        onClose();
    };
    
    // Don't render anything if the dialog is closed or there's no student data
    if (!open || !student) return null;

    return (
        <Dialog open={open} onClose={handleClose}>
            <DialogTitle>Edit Student Details</DialogTitle>
            <form onSubmit={handleSubmit}>
                <DialogContent>
                    {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Full Name"
                        type="text"
                        fullWidth
                        variant="outlined"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                    <TextField
                        margin="dense"
                        label="Grade"
                        type="number"
                        fullWidth
                        variant="outlined"
                        value={grade}
                        onChange={(e) => setGrade(e.target.value)}
                        required
                    />
                    <TextField
                        margin="dense"
                        label="Roll Number"
                        type="text"
                        fullWidth
                        variant="outlined"
                        value={rollNumber}
                        onChange={(e) => setRollNumber(e.target.value)}
                        required
                    />
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

export default EditStudent;
