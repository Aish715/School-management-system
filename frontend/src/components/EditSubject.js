import React, { useState, useEffect } from 'react';
import { updateSubject } from '../services/api';
import {
    Button, TextField, Dialog, DialogActions, DialogContent, DialogTitle, CircularProgress, Alert
} from '@mui/material';

function EditSubject({ open, onClose, onSubjectUpdated, subject }) {
    const [name, setName] = useState('');
    const [code, setCode] = useState('');
    const [description, setDescription] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (subject) {
            setName(subject.name || '');
            setCode(subject.code || '');
            setDescription(subject.description || '');
        }
    }, [subject]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        const subjectData = { name, code, description };
        try {
            const response = await updateSubject(subject.id, subjectData);
            onSubjectUpdated(response.data);
            handleClose();
        } catch (err) {
            setError('Failed to update subject.');
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => { setError(''); onClose(); };
    if (!open || !subject) return null;

    return (
        <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
            <DialogTitle>Edit Subject Details</DialogTitle>
            <form onSubmit={handleSubmit}>
                <DialogContent>
                    {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
                    <TextField autoFocus margin="dense" label="Subject Name" type="text" fullWidth variant="outlined" value={name} onChange={(e) => setName(e.target.value)} required />
                    <TextField margin="dense" label="Subject Code (Optional)" type="text" fullWidth variant="outlined" value={code} onChange={(e) => setCode(e.target.value.toUpperCase())} />
                    <TextField margin="dense" label="Description (Optional)" type="text" fullWidth variant="outlined" value={description} onChange={(e) => setDescription(e.target.value)} multiline rows={3} />
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

export default EditSubject;