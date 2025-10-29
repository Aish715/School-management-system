import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUserRole } from '../services/auth';
import {
    AppBar,
    Toolbar,
    Typography,
    Button,
    Drawer,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Box,
    CssBaseline
} from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import PeopleIcon from '@mui/icons-material/People'; // Student icon
import SupervisorAccountIcon from '@mui/icons-material/SupervisorAccount'; // Teacher/Admin icon
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import SchoolIcon from '@mui/icons-material/School'; // Class icon
import MenuBookIcon from '@mui/icons-material/MenuBook'; // Subject icon

// Import ALL components the dashboard might display
import StudentList from './StudentList';
import StudentProfile from './StudentProfile';
import TakeAttendance from './TakeAttendance';
import MyAttendance from './MyAttendance';
import TeacherList from './TeacherList';
import ClassList from './ClassList';
import SubjectList from './SubjectList'; // <-- Import the new SubjectList component

const drawerWidth = 240;

function Dashboard() {
    const navigate = useNavigate();
    const [activeComponent, setActiveComponent] = useState('home'); // Tracks which page to show
    const [userRole, setUserRole] = useState(null); // Stores the logged-in user's role

    // Check the user's role when the dashboard first loads
    useEffect(() => {
        const role = getUserRole(); // Get role from JWT in localStorage
        if (role) {
            setUserRole(role);
        } else {
            // If no valid role, redirect to login
            navigate('/login');
        }
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem('authToken'); // Clear the token
        navigate('/login'); // Redirect to login page
    };

    // Dynamically build the sidebar menu based on the user's role
    const drawer = (
        <div>
            <Toolbar /> {/* Spacer to push content below the AppBar */}
            <List>
                {/* Home link - visible to everyone */}
                <ListItem disablePadding>
                    <ListItemButton onClick={() => setActiveComponent('home')}>
                        <ListItemIcon><HomeIcon /></ListItemIcon>
                        <ListItemText primary="Home" />
                    </ListItemButton>
                </ListItem>

                {/* --- TEACHER-ONLY LINKS --- */}
                {userRole === 'teacher' && (
                    <>
                        <ListItem disablePadding>
                            <ListItemButton onClick={() => setActiveComponent('students')}>
                                <ListItemIcon><PeopleIcon /></ListItemIcon>
                                <ListItemText primary="Students" />
                            </ListItemButton>
                        </ListItem>
                        <ListItem disablePadding>
                            <ListItemButton onClick={() => setActiveComponent('attendance')}>
                                <ListItemIcon><AssignmentTurnedInIcon /></ListItemIcon>
                                <ListItemText primary="Attendance" />
                            </ListItemButton>
                        </ListItem>
                    </>
                )}

                {/* --- STUDENT-ONLY LINK --- */}
                {userRole === 'student' && (
                     <ListItem disablePadding>
                        <ListItemButton onClick={() => setActiveComponent('my-attendance')}>
                            <ListItemIcon><AssignmentTurnedInIcon /></ListItemIcon>
                            <ListItemText primary="My Attendance" />
                        </ListItemButton>
                    </ListItem>
                )}

                {/* --- ADMIN-ONLY LINKS --- */}
                {userRole === 'admin' && (
                    <>
                        <ListItem disablePadding>
                            <ListItemButton onClick={() => setActiveComponent('manage-teachers')}>
                                <ListItemIcon><SupervisorAccountIcon /></ListItemIcon>
                                <ListItemText primary="Manage Teachers" />
                            </ListItemButton>
                        </ListItem>
                        <ListItem disablePadding>
                            <ListItemButton onClick={() => setActiveComponent('manage-classes')}>
                                <ListItemIcon><SchoolIcon /></ListItemIcon>
                                <ListItemText primary="Manage Classes" />
                            </ListItemButton>
                        </ListItem>
                        {/* --- NEW LINK for Subjects --- */}
                        <ListItem disablePadding>
                            <ListItemButton onClick={() => setActiveComponent('manage-subjects')}>
                                <ListItemIcon><MenuBookIcon /></ListItemIcon>
                                <ListItemText primary="Manage Subjects" />
                            </ListItemButton>
                        </ListItem>
                    </>
                )}
            </List>
        </div>
    );

    // Function to decide which main component to render based on role and selection
    const renderContent = () => {
        // --- STUDENT VIEW ---
        if (userRole === 'student') {
            switch (activeComponent) {
                case 'my-attendance': return <MyAttendance />;
                case 'home': default: return <StudentProfile />;
            }
        }
        // --- TEACHER VIEW ---
        if (userRole === 'teacher') {
            switch (activeComponent) {
                case 'students': return <StudentList />;
                case 'attendance': return <TakeAttendance />;
                case 'home': default: return <Typography paragraph>Welcome, Teacher. Please select an option from the sidebar.</Typography>;
            }
        }
        // --- ADMIN VIEW ---
        if (userRole === 'admin') {
            switch (activeComponent) {
                case 'manage-teachers': return <TeacherList />;
                case 'manage-classes': return <ClassList />;
                case 'manage-subjects': return <SubjectList />; // <-- Render SubjectList when selected
                case 'home': default: return <Typography paragraph>Welcome, Admin. Please select an option from the sidebar.</Typography>;
            }
        }
        // Return null or a loading indicator if the role isn't determined yet
        return null;
    };

    // Main layout structure (AppBar, Drawer, Content Area)
    return (
        <Box sx={{ display: 'flex' }}>
             <CssBaseline /> {/* Ensures consistent baseline styling */}
            {/* Top Navigation Bar */}
            <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
                <Toolbar>
                    <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
                        School Dashboard
                    </Typography>
                    <Button color="inherit" onClick={handleLogout}>Logout</Button>
                </Toolbar>
            </AppBar>
            {/* Sidebar */}
            <Drawer
                variant="permanent" // Always visible
                sx={{
                    width: drawerWidth,
                    flexShrink: 0,
                    [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box' },
                }}
            >
                {drawer}
            </Drawer>
            {/* Main Content Area */}
            <Box
                component="main"
                sx={{ flexGrow: 1, p: 3, width: { sm: `calc(100% - ${drawerWidth}px)` } }}
            >
                <Toolbar /> {/* Spacer to push content below the AppBar */}
                {renderContent()} {/* Renders the selected component */}
            </Box>
        </Box>
    );
}

export default Dashboard;

