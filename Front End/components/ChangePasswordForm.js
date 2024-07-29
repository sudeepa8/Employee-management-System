import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const ChangePasswordForm = () => {
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');
    const { token } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        const validateToken = async () => {
            try {
                const response = await axios.get(`http://localhost:8084/auth/reset-password?token=${token}`);
                if (response.status !== 200) {
                    setMessage('Invalid or expired token.');
                }
            } catch (error) {
                setMessage('Invalid or expired token.');
            }
        };

        validateToken();
    }, [token]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (newPassword !== confirmPassword) {
            setMessage('Passwords do not match');
            return;
        }

        try {
            const response = await axios.post('http://localhost:8084/auth/save-password', {
                token,
                newPassword,
            });

            if (response.status === 200) {
                setMessage('Password reset successfully.');
                setTimeout(() => {
                    navigate('/login'); // Redirect to login page after a short delay
                }, 2000);
            } else {
                setMessage('Failed to reset password.');
            }
        } catch (error) {
            setMessage('Error: ' + (error.response ? error.response.data : 'An error occurred.'));
        }
    };

    return (
        <div className="auth-container">
            <h2>Reset Password</h2>
            {message && <p>{message}</p>}
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="newPassword">New Password:</label>
                    <input
                        type="password"
                        id="newPassword"
                        className="form-control"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="confirmPassword">Confirm Password:</label>
                    <input
                        type="password"
                        id="confirmPassword"
                        className="form-control"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                    />
                </div>
                <button type="submit" className="btn btn-primary">
                    Reset Password
                </button>
            </form>
        </div>
    );
};

export default ChangePasswordForm;
