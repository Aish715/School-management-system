import React from 'react';
import { updateStudent, getClasses } from '../services/api';
import { getUserRole } from '../services/auth'; // Import function to check user role
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

function EditStudent({ open, onClose, onStudentUpdated, student }) {
    // State for student fields - initialized directly from props or defaults
    const [name, setName] = React.useState('');
    const [grade, setGrade] = React.useState('');
    const [rollNumber, setRollNumber] = React.useState('');
    const [mobile, setMobile] = React.useState('');
    const [section, setSection] = React.useState('');
    const [profilePictureUrl, setProfilePictureUrl] = React.useState('');
    const [schoolClassId, setSchoolClassId] = React.useState('');

    // State for class dropdown
    const [allClasses, setAllClasses] = React.useState([]);
    const [fetchLoading, setFetchLoading] = React.useState(false); // Loading for class list

    // State for logged-in user's role
    const [userRole, setUserRole] = React.useState(null);

    // General loading/error for the form submission
    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState('');

    // Effect to get user role, pre-fill form, and fetch classes when the modal opens
    React.useEffect(() => {
        // Only run logic if the modal is open AND student data is provided
        if (open && student) {
            const role = getUserRole(); // Determine the logged-in user's role
            setUserRole(role);

            // Fetch the list of classes ONLY if the user is an admin or a teacher
            if (role === 'admin' || role === 'teacher') {
                fetchClasses();
            }

            // Pre-fill the form fields with the data of the student being edited
            setName(student.name || '');
            setGrade(student.grade || '');
            setRollNumber(student.rollNumber || '');
            setMobile(student.mobile || '');
            setSection(student.section || '');
            setProfilePictureUrl(student.profilePictureUrl || '');
            setSchoolClassId(student.schoolClassId || ''); // Pre-select the student's current class
        } else {
             // Reset role when modal closes or if there's no student data initially
             setUserRole(null);
             setAllClasses([]); // Clear class list when closing
        }
    }, [open, student]); // Re-run this effect if 'open' or 'student' props change

    // Fetches the list of classes from the backend API
    const fetchClasses = async () => {
        setFetchLoading(true); // Show loading indicator for the dropdown
        setError(''); // Clear previous errors
        try {
            const response = await getClasses(); // Call the API
            // Sort the classes by grade, then by section for a consistent order
            const sortedClasses = response.data.sort((a, b) => {
                if (a.grade !== b.grade) return a.grade - b.grade;
                return a.section.localeCompare(b.section);
            });
            setAllClasses(sortedClasses); // Store the fetched classes in state
        } catch (err) {
            console.error("Failed to fetch classes for dropdown", err);
            setError("Could not load the list of available classes."); // Display error in the form
        } finally {
            setFetchLoading(false); // Hide loading indicator for the dropdown
        }
    };

    // Handles the form submission when "Save Changes" is clicked
    const handleSubmit = async (e) => {
        e.preventDefault(); // Prevent default browser form submission
        setLoading(true); // Show loading indicator on the save button
        setError(''); // Clear previous errors

        let className = student.schoolClassName || ''; // Start with existing class name
        // Determine the class name based on selection, but only if user is admin/teacher
        if (userRole === 'admin' || userRole === 'teacher') {
            const selectedClass = allClasses.find(cls => cls.id === schoolClassId);
            // Format as "Grade-Section" (e.g., "10-A") or empty if unassigned
            className = selectedClass ? `${selectedClass.grade}-${selectedClass.section}` : '';
        }

        // Prepare the data object to send to the backend API
        const studentData = {
            name,
            grade: parseInt(grade), // Ensure grade is stored as a number
            rollNumber,
            mobile,
            section: section.toUpperCase(), // Ensure section is uppercase
            profilePictureUrl,
            // Conditionally include class fields only if the user is admin or teacher
            ...( (userRole === 'admin' || userRole === 'teacher') &&
               { schoolClassId: schoolClassId, schoolClassName: className }
             )
        };

        try {
            // Call the API function to update the student
            const response = await updateStudent(student.id, studentData);
            onStudentUpdated(response.data); // Notify the parent component (StudentList) about the update
            handleClose(); // Close the modal on successful update
        } catch (err) {
            setError('Failed to update student. Please check the details and try again.');
            console.error("Update Student Error:", err);
        } finally {
            setLoading(false); // Hide loading indicator on the save button
        }
    };

    // Closes the dialog and resets the error state
    const handleClose = () => {
        setError('');
        // Let useEffect handle resetting fields based on 'open' prop
        onClose(); // Call the parent component's close handler
    };

    // Do not render the component if it's not open or if student data is missing
    if (!open || !student) {
        return null;
    }

    return (
        // Material-UI Dialog component for the modal
        <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
            <DialogTitle>Edit Student Details</DialogTitle>
            <form onSubmit={handleSubmit}>
                <DialogContent>
                    {/* Display any submission errors */}
                    {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

                    {/* Standard student input fields */}
                    <TextField autoFocus margin="dense" label="Full Name" type="text" fullWidth variant="outlined" value={name} onChange={(e) => setName(e.target.value)} required />
                    <TextField margin="dense" label="Grade" type="number" fullWidth variant="outlined" value={grade} onChange={(e) => setGrade(e.target.value)} required />
                    <TextField margin="dense" label="Section" type="text" fullWidth variant="outlined" value={section} onChange={(e) => setSection(e.target.value.toUpperCase())} inputProps={{ maxLength: 1 }}/>
                    <TextField margin="dense" label="Roll Number" type="text" fullWidth variant="outlined" value={rollNumber} onChange={(e) => setRollNumber(e.target.value)} required />
                    <TextField margin="dense" label="Mobile" type="tel" fullWidth variant="outlined" value={mobile} onChange={(e) => setMobile(e.target.value)} required pattern="[0-9]{10}" title="Must be a 10-digit mobile number" />
                    <TextField margin="dense" label="Profile Picture URL" type="url" fullWidth variant="outlined" value={profilePictureUrl} onChange={(e) => setProfilePictureUrl(e.target.value)} />

                    {/* --- Class Assignment Dropdown - Rendered ONLY for Admin or Teacher --- */}
                    {(userRole === 'admin' || userRole === 'teacher') && (
                        <FormControl fullWidth margin="dense" sx={{ mt: 1 }}>
                            <InputLabel id="class-select-label-edit">Assign Class</InputLabel>
                            <Select
                                labelId="class-select-label-edit"
                                value={schoolClassId} // Controlled by state
                                label="Assign Class"
                                onChange={(e) => setSchoolClassId(e.target.value)} // Update state on selection
                                disabled={fetchLoading} // Disable while loading the class list
                            >
                                {/* Default option if no class is assigned */}
                                <MenuItem value=""><em>Unassigned</em></MenuItem>
                                {/* Show loading indicator or map through the fetched classes */}
                                {fetchLoading ? (
                                    <MenuItem disabled><CircularProgress size={20} /></MenuItem>
                                ) : (
                                    allClasses.map((cls) => (
                                        <MenuItem key={cls.id} value={cls.id}>
                                            {/* Display class details clearly in the dropdown */}
                                            Class {cls.grade}-{cls.section} (Teacher: {cls.classTeacherName})
                                        </MenuItem>
                                    ))
                                )}
                            </Select>
                        </FormControl>
                    )}

                </DialogContent>
                {/* Dialog action buttons (Cancel, Save) */}
                <DialogActions sx={{ px: 3, pb: 2 }}>
                    <Button onClick={handleClose} disabled={loading}>Cancel</Button>
                    <Button type="submit" variant="contained" disabled={loading || fetchLoading}>
                        {/* Show loading spinner if submitting form OR loading classes */}
                        {loading ? <CircularProgress size={24} /> : 'Save Changes'}
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
}

export default EditStudent;

