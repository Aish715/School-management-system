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
    Avatar
} from '@mui/material';
// Icons for profile details
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber';
import PhoneIcon from '@mui/icons-material/Phone';
import ClassIcon from '@mui/icons-material/Class'; // Using this for the Class display

function StudentProfile() {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await getStudentProfile();
                setProfile(response.data);
            } catch (err) {
                setError('Could not fetch your profile data.');
                console.error("API Error:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, []); // Empty array ensures this runs only once

    // Helper to get initials from name for Avatar fallback
    const getInitials = (name) => {
        if (!name) return '';
        const nameParts = name.split(' ');
        if (nameParts.length > 1) {
            return `${nameParts[0][0]}${nameParts[1][0]}`.toUpperCase();
        }
        return name[0].toUpperCase();
    };

    if (loading) {
        return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}><CircularProgress /></Box>;
    }

    if (error) {
        return <Typography color="error" variant="h6" sx={{ mt: 4, textAlign: 'center' }}>{error}</Typography>;
    }

    if (!profile) {
        return <Typography variant="h6" sx={{ mt: 4, textAlign: 'center' }}>No profile information found.</Typography>;
    }

    // Determine the class display string
    const classDisplay = profile.schoolClassName
        ? `Class ${profile.schoolClassName}` // e.g., "Class 10-A"
        : `Grade ${profile.grade}`;         // Fallback e.g., "Grade 10"

    return (
        <Paper sx={{ p: { xs: 2, md: 4 }, maxWidth: 700, margin: 'auto', mt: 4, boxShadow: 3 }}>
            {/* Top section with Avatar and Name/Class */}
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
                <Avatar
                    alt={profile.name}
                    src={profile.profilePictureUrl}
                    sx={{ width: 120, height: 120, mb: 2, fontSize: '3rem', bgcolor: 'secondary.main' }}
                >
                    {getInitials(profile.name)}
                </Avatar>
                <Typography variant="h4" component="h1" gutterBottom>
                    {profile.name}
                </Typography>
                {/* --- UPDATED: Display Class Name or Grade --- */}
                <Typography variant="h6" color="text.secondary">
                    {classDisplay}
                </Typography>
            </Box>

            <Divider />

            {/* Detailed Information List */}
            <List sx={{ mt: 2 }}>
                {/* Roll Number */}
                <ListItem>
                    <ListItemIcon><ConfirmationNumberIcon /></ListItemIcon>
                    <ListItemText primary="Roll Number" secondary={profile.rollNumber || 'N/A'} />
                </ListItem>
                <Divider component="li" />
                {/* Registered Mobile */}
                <ListItem>
                    <ListItemIcon><PhoneIcon /></ListItemIcon>
                    <ListItemText primary="Registered Mobile" secondary={profile.mobile || 'N/A'} />
                </ListItem>
                 {/* Optional: Display Grade and Section separately if needed */}
                 {/*
                 <Divider component="li" />
                 <ListItem>
                    <ListItemIcon><ClassIcon /></ListItemIcon>
                    <ListItemText primary="Grade" secondary={profile.grade || 'N/A'} />
                 </ListItem>
                 <Divider component="li" />
                 <ListItem>
                    <ListItemIcon><BookmarkIcon /></ListItemIcon>
                    <ListItemText primary="Section" secondary={profile.section || 'N/A'} />
                 </ListItem>
                 */}
            </List>
        </Paper>
    );
}

export default StudentProfile;

