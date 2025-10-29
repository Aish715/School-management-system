import React, { useState, useEffect } from 'react';
import { addStudent, getClasses } from '../services/api'; // Import getClasses
import {
    Button,
    TextField,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    CircularProgress,
    Alert,
    Select, // For dropdown
    MenuItem, // For dropdown options
    InputLabel, // For dropdown label
    FormControl // Wrapper for dropdown
} from '@mui/material';

function AddStudent({ open, onClose, onStudentAdded }) {
    // State for student fields
    const [name, setName] = useState('');
    const [grade, setGrade] = useState('');
    const [rollNumber, setRollNumber] = useState('');
    const [mobile, setMobile] = useState('');
    const [section, setSection] = useState('');
    const [profilePictureUrl, setProfilePictureUrl] = useState('');
    const [schoolClassId, setSchoolClassId] = useState(''); // New state for selected class ID

    // State for class dropdown
    const [allClasses, setAllClasses] = useState([]); // Holds fetched class list
    const [fetchLoading, setFetchLoading] = useState(false); // Loading for class list

    // General loading/error
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Fetch classes when the modal opens
    useEffect(() => {
        if (open) {
            fetchClasses();
        }
        // Clear form fields when modal opens (after potential close without save)
        return () => {
             handleClose(false); // Call handleClose without triggering parent onClose
        }
    }, [open]);

    // Fetches the list of classes for the dropdown
    const fetchClasses = async () => {
        setFetchLoading(true);
        setError(''); // Clear previous errors
        try {
            const response = await getClasses();
            // Sort classes for the dropdown
            const sortedClasses = response.data.sort((a, b) => {
                if (a.grade !== b.grade) return a.grade - b.grade;
                return a.section.localeCompare(b.section);
            });
            setAllClasses(sortedClasses);
        } catch (err) {
            console.error("Failed to fetch classes", err);
            setError("Could not load class list.");
        } finally {
            setFetchLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        const selectedClass = allClasses.find(cls => cls.id === schoolClassId);
        const className = selectedClass ? `${selectedClass.grade}-${selectedClass.section}` : '';

        // Include new class fields in the payload
        const studentData = {
            name,
            grade: parseInt(grade),
            rollNumber,
            mobile,
            section: section.toUpperCase(), // Ensure section is uppercase
            profilePictureUrl,
            schoolClassId,
            schoolClassName: className
        };

        try {
            const response = await addStudent(studentData);
            onStudentAdded(response.data); // Notify parent component
            handleClose(true); // Close and trigger parent onClose
        } catch (err) {
            setError('Failed to add student. Please check details and ensure mobile number is unique if required.');
            console.error("Add Student Error:", err);
        } finally {
            setLoading(false);
        }
    };

    // Reset all fields on close
    const handleClose = (triggerParentClose = true) => {
        setName('');
        setGrade('');
        setRollNumber('');
        setMobile('');
        setSection('');
        setProfilePictureUrl('');
        setSchoolClassId('');
        setError('');
        setAllClasses([]); // Clear class list too
        if (triggerParentClose) {
            onClose(); // Call the parent's handler
        }
    };

    return (
        <Dialog open={open} onClose={() => handleClose(true)} fullWidth maxWidth="sm">
            <DialogTitle>Add New Student</DialogTitle>
            <form onSubmit={handleSubmit}>
                <DialogContent>
                    {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
                    {/* Standard student fields */}
                    <TextField autoFocus margin="dense" label="Full Name" type="text" fullWidth variant="outlined" value={name} onChange={(e) => setName(e.target.value)} required />
                    <TextField margin="dense" label="Grade" type="number" fullWidth variant="outlined" value={grade} onChange={(e) => setGrade(e.target.value)} required />
                    <TextField margin="dense" label="Section" type="text" fullWidth variant="outlined" value={section} onChange={(e) => setSection(e.target.value.toUpperCase())} inputProps={{ maxLength: 1 }}/>
                    <TextField margin="dense" label="Roll Number" type="text" fullWidth variant="outlined" value={rollNumber} onChange={(e) => setRollNumber(e.target.value)} required />
                    <TextField margin="dense" label="Mobile (10 digits)" type="tel" fullWidth variant="outlined" value={mobile} onChange={(e) => setMobile(e.target.value)} required pattern="[0-9]{10}" title="Must be a 10-digit mobile number" />
                    <TextField margin="dense" label="Profile Picture URL" type="url" fullWidth variant="outlined" value={profilePictureUrl} onChange={(e) => setProfilePictureUrl(e.target.value)} />

                    {/* --- Class Assignment Dropdown --- */}
                    <FormControl fullWidth margin="dense" sx={{ mt: 1 }}>
                        <InputLabel id="class-select-label-add">Assign Class</InputLabel>
                        <Select
                            labelId="class-select-label-add"
                            value={schoolClassId}
                            label="Assign Class"
                            onChange={(e) => setSchoolClassId(e.target.value)}
                            disabled={fetchLoading} // Disable while loading classes
                        >
                            <MenuItem value=""><em>Unassigned</em></MenuItem>
                            {/* Show loading or class options */}
                            {fetchLoading ? (
                                <MenuItem disabled><CircularProgress size={20} /></MenuItem>
                            ) : (
                                allClasses.map((cls) => (
                                    <MenuItem key={cls.id} value={cls.id}>
                                        Class {cls.grade}-{cls.section} (Teacher: {cls.classTeacherName})
                                    </MenuItem>
                                ))
                            )}
                        </Select>
                    </FormControl>

                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 2 }}>
                    <Button onClick={() => handleClose(true)} disabled={loading}>Cancel</Button>
                    <Button type="submit" variant="contained" disabled={loading || fetchLoading}>
                        {loading ? <CircularProgress size={24} /> : 'Save Student'}
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
}

export default AddStudent;

