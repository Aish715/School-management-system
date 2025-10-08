import React, { useState, useEffect } from 'react';
import { getStudentProfile } from '../services/api';
import {
    Paper,
    CircularProgress,
    Typography,
    Box,
    List,
    ListItem,
    ListItemText,
    ListItemIcon,
    Divider,
    Avatar // Import Avatar for the profile picture
} from '@mui/material';
import ClassIcon from '@mui/icons-material/Class';
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber';
import PhoneIcon from '@mui/icons-material/Phone';
import BookmarkIcon from '@mui/icons-material/Bookmark'; // Icon for Section

function StudentProfile() {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                // Call the API to get the logged-in student's own profile
                const response = await getStudentProfile();
                setProfile(response.data);
            } catch (err) {
                setError('Could not fetch your profile data. Please try again later.');
                console.error("API Error:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, []); // The empty array ensures this runs only once when the component loads

    // Display a loading spinner while data is being fetched
    if (loading) {
        return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}><CircularProgress /></Box>;
    }

    // Display an error message if the API call failed
    if (error) {
        return <Typography color="error" variant="h6" sx={{ mt: 4, textAlign: 'center' }}>{error}</Typography>;
    }

    // Display a message if no profile data was returned from the backend
    if (!profile) {
        return <Typography variant="h6" sx={{ mt: 4, textAlign: 'center' }}>No profile information found.</Typography>;
    }
    
    // Helper function to get initials from a name for the Avatar fallback
    const getInitials = (name) => {
        if (!name) return '';
        const nameParts = name.split(' ');
        if (nameParts.length > 1) {
            return `${nameParts[0][0]}${nameParts[1][0]}`.toUpperCase();
        }
        return name[0].toUpperCase();
    };

    return (
        <Paper sx={{ p: { xs: 2, md: 4 }, maxWidth: 700, margin: 'auto', mt: 4, boxShadow: 3 }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
                {/* --- PROFILE PICTURE BLOCK --- */}
                <Avatar
                    alt={profile.name}
                    src={profile.profilePictureUrl}
                    sx={{ width: 120, height: 120, mb: 2, fontSize: '3rem', bgcolor: 'primary.main' }}
                >
                    {/* This will show the student's initials if the image URL is invalid or missing */}
                    {getInitials(profile.name)}
                </Avatar>
                
                {/* --- NAME AND GRADE (CLASS) --- */}
                <Typography variant="h4" component="h1" gutterBottom>
                    {profile.name}
                </Typography>
                <Typography variant="h6" color="text.secondary">
                    Class {profile.grade}
                </Typography>
            </Box>
            
            <Divider />

            {/* --- DETAILED INFORMATION LIST --- */}
            <List sx={{ mt: 2 }}>
                <ListItem>
                    <ListItemIcon><BookmarkIcon /></ListItemIcon>
                    <ListItemText primary="Section" secondary={profile.section || 'N/A'} />
                </ListItem>
                <Divider component="li" />
                <ListItem>
                    <ListItemIcon><ConfirmationNumberIcon /></ListItemIcon>
                    <ListItemText primary="Roll Number" secondary={profile.rollNumber} />
                </ListItem>
                <Divider component="li" />
                <ListItem>
                    <ListItemIcon><PhoneIcon /></ListItemIcon>
                    <ListItemText primary="Registered Mobile" secondary={profile.mobile} />
                </ListItem>
            </List>
        </Paper>
    );
}

export default StudentProfile;

