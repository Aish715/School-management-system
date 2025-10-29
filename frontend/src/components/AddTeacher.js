import React, { useState } from 'react';
import { addTeacher } from '../services/api';
import {
    Button, TextField, Dialog, DialogActions, DialogContent, DialogTitle, CircularProgress, Alert
} from '@mui/material';

function AddTeacher({ open, onClose, onTeacherAdded }) {
    const [name, setName] = useState('');
    const [subject, setSubject] = useState('');
    const [qualification, setQualification] = useState('');
    const [mobile, setMobile] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        const teacherData = { name, subject, qualification, mobile };
        try {
            const response = await addTeacher(teacherData);
            onTeacherAdded(response.data);
            handleClose();
        } catch (err) {
            setError('Failed to add teacher.');
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        setName(''); setSubject(''); setQualification(''); setMobile(''); setError('');
        onClose();
    };

    return (
        <Dialog open={open} onClose={handleClose}>
            <DialogTitle>Add New Teacher</DialogTitle>
            <form onSubmit={handleSubmit}>
                <DialogContent>
                    {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
                    <TextField autoFocus margin="dense" label="Full Name" type="text" fullWidth variant="outlined" value={name} onChange={(e) => setName(e.target.value)} required />
                    <TextField margin="dense" label="Subject" type="text" fullWidth variant="outlined" value={subject} onChange={(e) => setSubject(e.target.value)} required />
                    <TextField margin="dense" label="Qualification" type="text" fullWidth variant="outlined" value={qualification} onChange={(e) => setQualification(e.target.value)} required />
                    <TextField margin="dense" label="Mobile (10 digits, link to user)" type="tel" fullWidth variant="outlined" value={mobile} onChange={(e) => setMobile(e.target.value)} required pattern="[0-9]{10}" title="Must be a 10-digit mobile number" />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} disabled={loading}>Cancel</Button>
                    <Button type="submit" variant="contained" disabled={loading}>
                        {loading ? <CircularProgress size={24} /> : 'Save Teacher'}
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
}

export default AddTeacher;
