import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { sendOtp, verifyOtp } from '../services/api';

// --- Material-UI Imports ---
import {
    Button,
    TextField,
    Container,
    Typography,
    Box,
    Alert,
    CircularProgress,
    IconButton
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

// --- Import the CSS file for styling ---
import './Login.css';

function Login() {
    const [userType, setUserType] = useState(null);
    const [mobile, setMobile] = useState('');
    const [otp, setOtp] = useState('');
    const [showOtpInput, setShowOtpInput] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [feedback, setFeedback] = useState(null);
    const navigate = useNavigate();

    // UPDATED: This function now sends the userType to the API
    const handleSendOtp = async (e) => {
        e.preventDefault();
        setFeedback(null);
        setIsLoading(true);
        try {
            // Pass both the mobile number and the selected userType
            await sendOtp(mobile, userType);
            setFeedback({ type: 'success', text: 'OTP sent! Please check your backend console.' });
            setShowOtpInput(true);
        } catch (error) {
            // The backend will now send a specific error if the role doesn't match
            setFeedback({ type: 'error', text: error.response?.data || 'Error sending OTP.' });
        } finally {
            setIsLoading(false);
        }
    };

    const handleVerifyOtp = async (e) => {
        e.preventDefault();
        setFeedback(null);
        setIsLoading(true);
        try {
            const response = await verifyOtp(mobile, otp);
            const appToken = response.data;
            localStorage.setItem('authToken', appToken);
            setFeedback({ type: 'success', text: 'Login Successful! Redirecting...' });
            setTimeout(() => navigate('/dashboard'), 1000);
        } catch (error) {
            setFeedback({ type: 'error', text: error.response?.data || 'Invalid OTP.' });
        } finally {
            setIsLoading(false);
        }
    };

    const renderLoginForm = () => (
        <Box sx={{ width: '100%' }}>
            <IconButton onClick={() => { setUserType(null); setShowOtpInput(false); setMobile(''); setFeedback(null); }} sx={{ alignSelf: 'flex-start', color: '#fff', backgroundColor: 'rgba(255,255,255,0.1)', mb: 2 }}>
                <ArrowBackIcon />
            </IconButton>
            <Typography component="h2" variant="h6" sx={{ color: '#fff', mb: 2, textTransform: 'capitalize' }}>
                {userType} Login
            </Typography>
            <Box component="form" onSubmit={!showOtpInput ? handleSendOtp : handleVerifyOtp} sx={{ mt: 1, width: '100%' }}>
                {!showOtpInput ? (
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        label="Mobile Number"
                        value={mobile}
                        onChange={(e) => setMobile(e.target.value)}
                        disabled={isLoading}
                        InputLabelProps={{ style: { color: '#fff' } }}
                        sx={{ input: { color: '#fff' }, '.MuiOutlinedInput-root': { '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.3)' } } }}
                    />
                ) : (
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        label="Enter OTP from Console"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        disabled={isLoading}
                        InputLabelProps={{ style: { color: '#fff' } }}
                        sx={{ input: { color: '#fff' }, '.MuiOutlinedInput-root': { '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.3)' } } }}
                    />
                )}
                <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }} disabled={isLoading}>
                    {isLoading ? <CircularProgress size={24} sx={{ color: '#fff' }} /> : (!showOtpInput ? 'Send OTP' : 'Verify & Login')}
                </Button>
                {feedback && <Alert severity={feedback.type} sx={{ width: '100%', mt: 2 }}>{feedback.text}</Alert>}
            </Box>
        </Box>
    );

    const renderRoleSelection = () => (
        <>
            <Typography component="h1" variant="h5" sx={{ color: '#fff', mb: 1 }}>
                Welcome!
            </Typography>
            <Typography component="h2" variant="subtitle1" sx={{ color: 'rgba(255, 255, 255, 0.7)', mb: 4 }}>
                Please select your role to continue
            </Typography>
            <Box sx={{ width: '100%' }}>
                <Button fullWidth variant="outlined" onClick={() => setUserType('student')} className="role-button" sx={{ mb: 2, py: 2 }}>
                    I am a Student
                </Button>
                <Button fullWidth variant="outlined" onClick={() => setUserType('teacher')} className="role-button" sx={{ py: 2 }}>
                    I am a Teacher
                </Button>
            </Box>
        </>
    );

    return (
        <div className="login-page-container">
            <div className="floating-equations-bg">
                { /* ... All 45 of your equation spans go here ... */ }
                <span>{'E = mc²'}</span>
                <span>{'∫ f(x)dx'}</span>
                <span>{'a² + b² = c²'}</span>
                <span>{'H₂O'}</span>
                <span>{'∑ i = n(n+1)/2'}</span>
                <span>{'F = ma'}</span>
                <span>{'C₆H₁₂O₆'}</span>
                <span>{'∇ ⋅ B = 0'}</span>
                <span>{'eⁱπ + 1 = 0'}</span>
                <span>{'KE = 1/2mv²'}</span>
                <span>{'λ = h/p'}</span>
                <span>{'PV = nRT'}</span>
                <span>{'sin²θ + cos²θ = 1'}</span>
                <span>{'pH = -log[H+]'}</span>
                <span>{'∂Ψ/∂t'}</span>
                <span>{'x = [-b ± √(b²-4ac)]/2a'}</span>
                <span>{'∮ V = IR'}</span>
                <span>{'S = kₙ ln Ω'}</span>
                <span>{'∬ F ⋅ dS = ∫ (∇ ⋅ F) dV'}</span>
                <span>{'d/dx (eˣ) = eˣ'}</span>
                <span>{'ΔG = ΔH - TΔS'}</span>
                <span>{'v = fλ'}</span>
                <span>{'F = G(m₁m₂/r²)'}</span>
                <span>{'E = hf'}</span>
                <span>{'√(-1) = i'}</span>
                <span>{'lim x→0 (sinx/x) = 1'}</span>
                <span>{'V = (4/3)πr³'}</span>
                <span>{'A = πr²'}</span>
                <span>{'p + ρgh + 1/2ρv² = const.'}</span>
                <span>{'Fe₂O₃ + 2Al → Al₂O₃ + 2Fe'}</span>
                <span>{'HCl + NaOH → NaCl + H₂O'}</span>
                <span>{'∇ x E = -∂B/∂t'}</span>
                <span>{'tanθ = sinθ/cosθ'}</span>
                <span>{'P₁V₁ = P₂V₂'}</span>
                <span>{'(x-h)² + (y-k)² = r²'}</span>
                <span>{'aₙ(logₐx) = x'}</span>
                <span>{'c = 299,792,458 m/s'}</span>
                <span>{'CH₄ + 2O₂ → CO₂ + 2H₂O'}</span>
                <span>{'E = V/d'}</span>
                <span>{'Q = mcΔT'}</span>
                <span>{'τ = rFsinθ'}</span>
                <span>{'I = ΔQ/Δt'}</span>
                <span>{'f(x) = ax²+bx+c'}</span>
                <span>{'y = mx + b'}</span>
                <span>{'d/dx(lnx) = 1/x'}</span>
            </div>
            <Container component="main" maxWidth="xs">
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        backgroundColor: 'rgba(10, 25, 41, 0.8)',
                        backdropFilter: 'blur(4px)',
                        padding: { xs: 2, sm: 4 },
                        borderRadius: 2,
                        boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
                        border: '1px solid rgba(255, 255, 255, 0.18)',
                        color: '#fff',
                        textAlign: 'center'
                    }}
                >
                    {!userType ? renderRoleSelection() : renderLoginForm()}
                </Box>
            </Container>
        </div>
    );
}

export default Login;

