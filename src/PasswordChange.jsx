import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

const PasswordChange = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { email: passedEmail } = location.state || {};
    const [email, setEmail] = useState(passedEmail || '');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState({ text: '', type: '' });
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        const checkAuthentication = async () => {
            const token = localStorage.getItem('token');
            if (token) {
                try {
                    const response = await axios.get(
                        'http://localhost:5001/profile',
                        {
                            headers: { Authorization: `Bearer ${token}` },
                        }
                    );
                    setEmail(response.data.email);
                    setIsAuthenticated(true);
                } catch (error) {
                    console.error(
                        'Error fetching authenticated user profile:',
                        error
                    );
                }
            }
        };

        if (!passedEmail) {
            checkAuthentication();
        }
    }, [passedEmail]);

    const handlePasswordChange = async (e) => {
        e.preventDefault();

        if (newPassword !== confirmPassword) {
            setMessage({
                text: 'Passwords do not match. Please try again.',
                type: 'error',
            });
            return;
        }

        try {
            const endpoint = isAuthenticated
                ? 'http://localhost:5001/change-password'
                : 'http://localhost:5001/reset-password';

            const payload = isAuthenticated
                ? { password: newPassword }
                : { email, password: newPassword };

            const headers = isAuthenticated
                ? { Authorization: `Bearer ${localStorage.getItem('token')}` }
                : {};

            const response = await axios.post(endpoint, payload, { headers });

            if (response.status === 200 && response.data.success) {
                setMessage({
                    text: 'Password changed successfully!',
                    type: 'success',
                });

                setTimeout(() => {
                    navigate(isAuthenticated ? '/your-profile' : '/Login');
                }, 2000);
            }
        } catch (error) {
            setMessage({
                text:
                    error.response?.data.message ||
                    'An error occurred while updating the password.',
                type: 'error',
            });
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-auth-bg bg-cover bg-center tracking-wider">
            <div className="w-11/12 sm:w-5/12 md:w-3/12 text-sm glass">
                <div className="w-full text-center my-3">
                    <h2 className="text-2xl text-black font-medium text-xl">
                        {isAuthenticated ? 'Change Password' : 'Reset Password'}
                    </h2>
                    <form onSubmit={handlePasswordChange} className="my-2">
                        {!isAuthenticated && (
                            <div className="flex border-b-black border-b-2 mx-5 my-7 py-1">
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-11/12 bg-transparent outline-none placeholder-black"
                                    placeholder="example@example.com"
                                    required
                                />
                                <div className="flex items-center justify-center">
                                    <i className="fa-solid fa-envelope text-xl"></i>
                                </div>
                            </div>
                        )}
                        <div className="flex border-b-black border-b-2 mx-5 my-7 py-1">
                            <input
                                type="password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                className="w-11/12 bg-transparent outline-none placeholder-black"
                                placeholder="New Password"
                                required
                            />
                            <div className="flex items-center justify-center">
                                <i className="fa-solid fa-lock text-xl"></i>
                            </div>
                        </div>
                        <div className="flex border-b-black border-b-2 mx-5 my-7 py-1">
                            <input
                                type="password"
                                value={confirmPassword}
                                onChange={(e) =>
                                    setConfirmPassword(e.target.value)
                                }
                                className="w-11/12 bg-transparent outline-none placeholder-black"
                                placeholder="Confirm Password"
                                required
                            />
                            <div className="flex items-center justify-center">
                                <i className="fa-solid fa-lock text-xl"></i>
                            </div>
                        </div>
                        <div className="mx-5 my-7 py-2">
                            <button
                                type="submit"
                                className="bg-black w-full h-[35px] text-white rounded-md border border-transparent hover:border-white transition duration-300"
                            >
                                {isAuthenticated
                                    ? 'Change Password'
                                    : 'Reset Password'}
                            </button>
                        </div>
                    </form>
                    {message.text && (
                        <div
                            className={`mt-4 text-center ${
                                message.type === 'error'
                                    ? 'text-red-600'
                                    : 'text-green-600'
                            }`}
                        >
                            {message.type === 'error' ? '❌' : '✅'}
                            {message.text}
                        </div>
                    )}

                        {/* Navigation link */}
                        <div className="mx-5 my-5 py-2 flex items-center justify-center cursor-pointer">
                        <p className="text-sm">
                            Remembered your password?{' '}
                            <span
                                data-testid="log"
                                className="text-blue-600 cursor-pointer hover:underline"
                                onClick={() => navigate('/Login')}
                            >
                                Log In
                            </span>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PasswordChange;
