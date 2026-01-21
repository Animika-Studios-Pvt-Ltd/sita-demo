import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AdminLogin = () => {
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [mfaRequired, setMfaRequired] = useState(false);
  const [tempToken, setTempToken] = useState('');
  const { register, handleSubmit, formState: { errors }, reset } = useForm();
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (token) {
      navigate('/dashboard', { replace: true });
    }
  }, [navigate]);

  const onSubmit = async (formData) => {
    setLoading(true);
    setMessage('');

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/admin-auth/admin`,
        {
          username: formData.username,
          password: formData.password,
        },
        { headers: { 'Content-Type': 'application/json' } }
      );

      if (response.data.mfaRequired) {
        setMfaRequired(true);
        setTempToken(response.data.tempToken);
        setMessage('Please enter your 6-digit MFA code');
        reset();
      } else if (response.data.token) {
        localStorage.setItem('adminToken', response.data.token);
        navigate('/dashboard', { replace: true });
      }
    } catch (error) {
      setMessage(error.response?.data?.message || 'Invalid username or password');
    } finally {
      setLoading(false);
    }
  };

  const onMFASubmit = async (formData) => {
    setLoading(true);
    setMessage('');
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/admin-auth/verify-mfa-login`,
        {
          tempToken: tempToken,
          mfaCode: formData.mfaCode,
        },
        { headers: { 'Content-Type': 'application/json' } }
      );
      if (response.data.token) {
        localStorage.setItem('adminToken', response.data.token);
        navigate('/dashboard', { replace: true });
      }
    } catch (error) {
      setMessage(error.response?.data?.message || 'Invalid MFA code');
    } finally {
      setLoading(false);
    }
  };
  const handleBackToLogin = () => {
    setMfaRequired(false);
    setTempToken('');
    setMessage('');
    reset();
    navigate('/', { replace: true });
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 px-4">
      <div className="w-full max-w-md">
        <div className="bg-white shadow-2xl rounded-lg px-8 pt-8 pb-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              {mfaRequired ? 'Two-Factor Authentication' : 'Admin Portal'}
            </h1>
            <p className="text-gray-600 text-sm">
              {mfaRequired ? 'Enter your 6-digit code' : 'Sign in to access the dashboard'}
            </p>
          </div>
          {!mfaRequired ? (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div>
                <label htmlFor="username" className="block text-sm font-semibold text-gray-700 mb-2">
                  Username
                </label>
                <input
                  {...register('username', { required: 'Username is required' })}
                  id="username"
                  type="text"
                  placeholder="Enter your username"
                  className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={loading}
                  autoComplete="username"
                />
                {errors.username && <p className="text-red-500 text-xs mt-1">{errors.username.message}</p>}
              </div>
              <div>
                <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
                  Password
                </label>
                <input
                  {...register('password', { required: 'Password is required' })}
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={loading}
                  autoComplete="current-password"
                />
                {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
              </div>

              {message && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                  {message}
                </div>
              )}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 rounded-lg font-semibold text-white bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400"
              >
                {loading ? 'Signing in...' : 'Sign In'}
              </button>
            </form>
          ) : (
            <form onSubmit={handleSubmit(onMFASubmit)} className="space-y-6">
              <div>
                <label htmlFor="mfaCode" className="block text-sm font-semibold text-gray-700 mb-2">
                  Authentication Code
                </label>
                <input
                  {...register('mfaCode', {
                    required: 'MFA code is required',
                    pattern: {
                      value: /^[0-9]{6}$/,
                      message: 'Code must be 6 digits',
                    },
                  })}
                  id="mfaCode"
                  type="text"
                  maxLength="6"
                  placeholder="000000"
                  className="w-full px-4 py-3 border rounded-lg text-center text-2xl tracking-widest focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={loading}
                  autoFocus
                  autoComplete="off"
                />
                {errors.mfaCode && <p className="text-red-500 text-xs mt-1">{errors.mfaCode.message}</p>}
              </div>
              {message && (
                <div className={`border px-4 py-3 rounded-lg text-sm ${message.includes('Invalid')
                    ? 'bg-red-50 border-red-200 text-red-700'
                    : 'bg-blue-50 border-blue-200 text-blue-700'
                  }`}>
                  {message}
                </div>
              )}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 rounded-lg font-semibold text-white bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400"
              >
                {loading ? 'Verifying...' : 'Verify Code'}
              </button>
              <button
                type="button"
                onClick={handleBackToLogin}
                className="w-full text-sm text-gray-600 hover:text-gray-800 hover:underline"
              >
                ← Back to login
              </button>
            </form>
          )}
          <div className="mt-6 text-center">
            <p className="text-xs text-gray-500">© 2026 Sita. All Rights Reserved.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
