import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Email = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState({ text: '', type: '' });

    const handleEmailSubmit = async (e) => {
        e.preventDefault(); // Prevent form submission

        try {
            const response = await axios.post(
                'http://localhost:5001/check-email',
                { email }
            );

            if (response.status === 200 && response.data.success) {
                setMessage({
                    text: 'Please check your email to reset your password.',
                    type: 'success',
                });
                console.log('Navigating to PasswordChange with email:', email);

                navigate('/password-change', { state: { email } });
            }
        } catch (error) {
            setMessage({
                text:
                    error.response?.data.message ||
                    'An error occurred while checking the email.',
                type: 'error',
            });
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-auth-bg bg-cover bg-center tracking-wider">
            <div className="w-11/12 sm:w-5/12 md:w-3/12 text-sm glass">
                <div className="w-full text-center my-3">
                    <h2 className="text-2xl text-black font-medium text-xl">
                        Forgot your Password?
                    </h2>

                    {/* The form */}
                    <form onSubmit={handleEmailSubmit} className="my-2">
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

                        {/* Submit Button */}
                        <div className="mx-5 my-7 py-2">
                            <button
                                type="submit"
                                data-testid="steve"
                                className="bg-black w-full h-[35px] text-white rounded-md border border-transparent hover:border-white transition duration-300"
                            >
                                Reset Password
                            </button>
                        </div>
                    </form>

                    {/* Feedback message with conditional styling */}
                    {message.text && (
                        <div
                            className={`mt-4 text-center ${message.type === 'error' ? 'text-red-600' : 'text-green-600'}`}
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

                    {/* Navigation link */}
                    <div className="mx-5 my-5 py-2 flex items-center justify-center cursor-pointer">
                        <p className="text-sm">
                            Don't have an account?{' '}
                            <span
                                data-testid="sign"
                                className="text-blue-600 cursor-pointer hover:underline"
                                onClick={() => navigate('/Signup')}
                            >
                                Sign Up
                            </span>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Email;
