import React, { useState } from 'react';
import { addSubject } from '../services/api';
import {
    Button, TextField, Dialog, DialogActions, DialogContent, DialogTitle, CircularProgress, Alert
} from '@mui/material';

function AddSubject({ open, onClose, onSubjectAdded }) {
    const [name, setName] = useState('');
    const [code, setCode] = useState('');
    const [description, setDescription] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        const subjectData = { name, code, description };
        try {
            const response = await addSubject(subjectData);
            onSubjectAdded(response.data);
            handleClose();
        } catch (err) {
            setError('Failed to add subject.');
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        setName(''); setCode(''); setDescription(''); setError('');
        onClose();
    };

    return (
        <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
            <DialogTitle>Add New Subject</DialogTitle>
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
                        {loading ? <CircularProgress size={24} /> : 'Save Subject'}
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
}

export default AddSubject;