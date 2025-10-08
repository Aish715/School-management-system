import React, { useState } from 'react';
import { addStudent } from '../services/api';
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

// This component receives three "props" (instructions) from its parent:
// - open: A true/false value that tells the dialog if it should be visible.
// - onClose: A function to call when the dialog should be closed (e.g., when "Cancel" is clicked).
// - onStudentAdded: A function to call after a new student is successfully saved.
function AddStudent({ open, onClose, onStudentAdded }) {
    const [name, setName] = useState('');
    const [grade, setGrade] = useState('');
    const [rollNumber, setRollNumber] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        const studentData = {
            name,
            grade: parseInt(grade), // HTML inputs are strings, so we convert grade to a number
            rollNumber
        };

        try {
            // Call the API function to save the student
            const response = await addStudent(studentData);
            // If successful, call the function passed from the parent to update the list
            onStudentAdded(response.data);
            handleClose(); // Close the dialog
        } catch (err) {
            setError('Failed to add student. Please try again.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        // Reset all form fields and errors before closing
        setName('');
        setGrade('');
        setRollNumber('');
        setError('');
        onClose(); // Tell the parent component to close the dialog
    };

    return (
        <Dialog open={open} onClose={handleClose}>
            <DialogTitle>Add New Student</DialogTitle>
            <form onSubmit={handleSubmit}>
                <DialogContent>
                    {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
                    <TextField
                        autoFocus
                        margin="dense"
                        id="name"
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
                        id="grade"
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
                        id="rollNumber"
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
                        {loading ? <CircularProgress size={24} /> : 'Save Student'}
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
}

export default AddStudent;