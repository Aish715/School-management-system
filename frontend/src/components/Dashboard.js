import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUserRole } from '../services/auth'; // Import the new auth helper
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
import PeopleIcon from '@mui/icons-material/People';
import HomeIcon from '@mui/icons-material/Home';

// Import the component that will be conditionally rendered
import StudentList from './StudentList';

const drawerWidth = 240;

function Dashboard() {
    const navigate = useNavigate();
    const [activeComponent, setActiveComponent] = useState('home');
    const [userRole, setUserRole] = useState(null);

    // This effect runs once when the component is loaded
    useEffect(() => {
        // Get the user's role from the JWT stored in localStorage
        const role = getUserRole();
        if (role) {
            setUserRole(role);
        } else {
            // If there's no token or the token is invalid, the user is not logged in.
            // Redirect them to the login page for security.
            navigate('/login');
        }
    }, [navigate]); // The dependency array ensures this runs only once on mount

    const handleLogout = () => {
        localStorage.removeItem('authToken');
        navigate('/login');
    };

    // JSX for the sidebar (Drawer)
    const drawer = (
        <div>
            <Toolbar />
            <List>
                <ListItem disablePadding>
                    <ListItemButton onClick={() => setActiveComponent('home')}>
                        <ListItemIcon>
                            <HomeIcon />
                        </ListItemIcon>
                        <ListItemText primary="Home" />
                    </ListItemButton>
                </ListItem>

                {/* --- ROLE-BASED RENDERING --- */}
                {/* This is the key change: The "Students" link will only be rendered
                    in the sidebar if the logged-in user's role is 'teacher'. */}
                {userRole === 'teacher' && (
                    <ListItem disablePadding>
                        <ListItemButton onClick={() => setActiveComponent('students')}>
                            <ListItemIcon>
                                <PeopleIcon />
                            </ListItemIcon>
                            <ListItemText primary="Students" />
                        </ListItemButton>
                    </ListItem>
                )}
            </List>
        </div>
    );

    // A helper function to render the main content based on the active component
    const renderContent = () => {
        switch (activeComponent) {
            case 'students':
                // As a second layer of security, only show the StudentList
                // if the user is a teacher.
                return userRole === 'teacher' ? <StudentList /> : <Typography>Access Denied.</Typography>;
            case 'home':
            default:
                // Customize the welcome message based on the user's role
                return (
                    <Typography paragraph>
                        Welcome to the {userRole === 'teacher' ? 'Teacher' : 'Student'} Dashboard.
                        Please select an option from the sidebar.
                    </Typography>
                );
        }
    };

    return (
        <Box sx={{ display: 'flex' }}>
            <CssBaseline />
            <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
                <Toolbar>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        School Dashboard
                    </Typography>
                    <Button color="inherit" onClick={handleLogout}>
                        Logout
                    </Button>
                </Toolbar>
            </AppBar>
            <Drawer
                variant="permanent"
                sx={{
                    width: drawerWidth,
                    flexShrink: 0,
                    [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box' },
                }}
            >
                {drawer}
            </Drawer>
            <Box
                component="main"
                sx={{ flexGrow: 1, p: 3, width: { sm: `calc(100% - ${drawerWidth}px)` } }}
            >
                <Toolbar />
                {renderContent()}
            </Box>
        </Box>
    );
}

export default Dashboard;

