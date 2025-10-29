import React, { useState, useEffect } from 'react';
// Import the necessary API functions
import { updateTeacher, getSubjects } from '../services/api';
import {
    Button,
    TextField,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    CircularProgress,
    Alert,
    FormControl, // Form control wrapper
    InputLabel, // Label for the select input
    Select,     // The dropdown itself
    MenuItem,   // Options within the dropdown
    OutlinedInput, // Needed for the Select component's appearance
    Box,        // For layout
    Chip        // To display selected items nicely
} from '@mui/material';

// Style configuration for the multi-select dropdown
const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 250,
        },
    },
};

function EditTeacher({ open, onClose, onTeacherUpdated, teacher }) {
    // State for teacher fields
    const [name, setName] = useState('');
    const [subject, setSubject] = useState(''); // Primary subject (optional now)
    const [qualification, setQualification] = useState('');
    const [mobile, setMobile] = useState('');
    // --- NEW: State for assigned subjects (list of names) ---
    const [assignedSubjects, setAssignedSubjects] = useState([]);

    // State for the subject dropdown
    const [allSubjects, setAllSubjects] = useState([]); // Holds fetched subjects {id, name, code}

    // State for loading and errors
    const [loading, setLoading] = useState(false);
    const [fetchLoading, setFetchLoading] = useState(false); // Separate loading for fetching subjects
    const [error, setError] = useState('');

    // Pre-fill form and fetch subjects when the modal opens or teacher data changes
    useEffect(() => {
        if (open && teacher) {
            setName(teacher.name || '');
            setSubject(teacher.subject || '');
            setQualification(teacher.qualification || '');
            setMobile(teacher.mobile || '');
            // Initialize assignedSubjects from teacher data (ensure it's an array)
            setAssignedSubjects(Array.isArray(teacher.assignedSubjects) ? teacher.assignedSubjects : []);
            fetchSubjects(); // Fetch available subjects for the dropdown
        }
    }, [open, teacher]);

    // Fetches the list of all available subjects from the backend
    const fetchSubjects = async () => {
        setFetchLoading(true);
        try {
            const response = await getSubjects();
            setAllSubjects(response.data); // Store the list {id, name, code, ...}
        } catch (err) {
            console.error("Failed to fetch subjects", err);
            setError("Could not load subject list.");
        } finally {
            setFetchLoading(false);
        }
    };

    // Handles changes in the multi-select dropdown
    const handleSubjectChange = (event) => {
        const { target: { value } } = event;
        // value will be an array of selected subject names
        setAssignedSubjects(
            typeof value === 'string' ? value.split(',') : value,
        );
    };

    // Handles form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        // Prepare the data payload, including the list of assigned subject names
        const teacherData = {
            name,
            subject, // Keep primary subject if needed
            qualification,
            mobile,
            assignedSubjects // Send the array of selected subject names
        };

        try {
            const response = await updateTeacher(teacher.id, teacherData);
            onTeacherUpdated(response.data); // Notify parent component
            handleClose(); // Close modal on success
        } catch (err) {
            setError('Failed to update teacher.');
            console.error("Update Teacher Error:", err)
        } finally {
            setLoading(false);
        }
    };

    // Closes the dialog and resets error state
    const handleClose = () => {
        setError('');
        // No need to reset form fields here, useEffect handles pre-fill
        onClose();
    };

    // Don't render if closed or no teacher data
    if (!open || !teacher) return null;

    return (
        <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
            <DialogTitle>Edit Teacher Details</DialogTitle>
            <form onSubmit={handleSubmit}>
                <DialogContent>
                    {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

                    {/* Standard Teacher Fields */}
                    <TextField autoFocus margin="dense" label="Full Name" type="text" fullWidth variant="outlined" value={name} onChange={(e) => setName(e.target.value)} required />
                    <TextField margin="dense" label="Primary Subject" type="text" fullWidth variant="outlined" value={subject} onChange={(e) => setSubject(e.target.value)} />
                    <TextField margin="dense" label="Qualification" type="text" fullWidth variant="outlined" value={qualification} onChange={(e) => setQualification(e.target.value)} required />
                    <TextField margin="dense" label="Mobile (10 digits)" type="tel" fullWidth variant="outlined" value={mobile} onChange={(e) => setMobile(e.target.value)} required pattern="[0-9]{10}" title="Must be a 10-digit mobile number" />

                    {/* --- NEW: Multi-Select Subject Dropdown --- */}
                    <FormControl fullWidth margin="dense" sx={{ mt: 1 }}>
                        <InputLabel id="assigned-subjects-label">Assigned Subjects</InputLabel>
                        <Select
                            labelId="assigned-subjects-label"
                            multiple // Enable multiple selections
                            value={assignedSubjects} // Controlled by state
                            onChange={handleSubjectChange} // Update state on change
                            input={<OutlinedInput label="Assigned Subjects" />}
                            // Render selected items as Chips for better UI
                            renderValue={(selected) => (
                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                    {selected.map((value) => (
                                        // Find the subject object to display name, fallback to value if not found yet
                                        <Chip key={value} label={allSubjects.find(s => s.name === value)?.name || value} size="small" />
                                    ))}
                                </Box>
                            )}
                            MenuProps={MenuProps} // Style props for the dropdown menu
                            disabled={fetchLoading} // Disable while loading subjects
                        >
                            {/* Display loading indicator or list of subjects */}
                            {fetchLoading ? (
                                <MenuItem disabled><CircularProgress size={20} /></MenuItem>
                            ) : (
                                allSubjects.map((sub) => (
                                    <MenuItem key={sub.id} value={sub.name} >
                                        {sub.name} {sub.code ? `(${sub.code})` : ''}
                                    </MenuItem>
                                ))
                            )}
                        </Select>
                    </FormControl>

                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 2 }}>
                    <Button onClick={handleClose} disabled={loading}>Cancel</Button>
                    <Button type="submit" variant="contained" disabled={loading || fetchLoading}>
                        {loading ? <CircularProgress size={24} /> : 'Save Changes'}
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
}

export default EditTeacher;

