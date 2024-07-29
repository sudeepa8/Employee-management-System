import React, { useState } from 'react';
import axios from 'axios';

const PasswordResetForm = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const response = await axios.post('http://localhost:8084/auth/forgot-password', { email });
            setMessage(response.data.message || 'Password reset email sent.');
        } catch (error) {
            setMessage(error.response ? error.response.data.message : 'An error occurred.');
        }
    };

    return (
        <div className="auth-container">
            <h1>Password Reset</h1>
            <form onSubmit={handleSubmit}>
                <div className="form-group3">
                    <label>Email:</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <button type="submit11">Reset Password</button>
            </form>
            {message && <p>{message}</p>}
        </div>
    );
};

export default PasswordResetForm;
