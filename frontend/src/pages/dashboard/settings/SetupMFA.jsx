import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const SetupMFA = () => {
  const [qrCode, setQrCode] = useState('');
  const [secret, setSecret] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [message, setMessage] = useState('');
  const [step, setStep] = useState(1);
  const [mfaEnabled, setMfaEnabled] = useState(false);
  const [userId, setUserId] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const token = localStorage.getItem('adminToken');
        if (!token) {
          navigate('/');
          return;
        }

        const payload = JSON.parse(atob(token.split('.')[1]));
        const uid = payload.id;
        setUserId(uid);

        try {
          const response = await axios.get(
            `${import.meta.env.VITE_API_URL}/api/admin-auth/mfa-status/${uid}`,
            { headers: { Authorization: `Bearer ${token}` } }
          );
          setMfaEnabled(response.data.mfaEnabled || false);
        } catch (error) {
          console.error('Error fetching MFA status:', error);
        }
      } catch (error) {
        console.error('Error fetching user info:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserInfo();
  }, [navigate]);

  const handleSetupMFA = async () => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/admin-auth/setup-mfa`,
        { userId },
        { headers: { Authorization: `Bearer ${localStorage.getItem('adminToken')}`, 'Content-Type': 'application/json' } }
      );

      setQrCode(response.data.qrCode);
      setSecret(response.data.secret);
      setStep(2);

      if (response.data.alreadySetup) {
        if (response.data.mfaEnabled) {
          setMessage('⚠️ MFA is already enabled. Scan this QR code if you need to set it up on a new device.');
          setMfaEnabled(true);
        } else {
          setMessage('⚠️ MFA setup in progress. Complete verification to enable MFA.');
        }
      } else {
        setMessage('');
      }
    } catch (error) {
      console.error('❌ Full error object:', error);
      console.error('❌ Error response:', error.response?.data);
      setMessage('Failed to setup MFA. Please try again.');
    }
  };

  const handleVerifyMFA = async () => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/admin-auth/verify-mfa-setup`,
        { userId, token: verificationCode },
        { headers: { Authorization: `Bearer ${localStorage.getItem('adminToken')}`, 'Content-Type': 'application/json' } }
      );

      setMessage('✅ MFA enabled successfully! Your account is now more secure. This QR code is permanent - save it securely.');
      setMfaEnabled(true);
      setStep(1);
      setQrCode('');
      setSecret('');
      setVerificationCode('');
    } catch (error) {
      setMessage('❌ Invalid verification code. Please try again.');
      console.error('MFA verification error:', error);
    }
  };

  const handleDisableMFA = async () => {
    if (!window.confirm('Are you sure you want to disable MFA? This will make your account less secure and DELETE your MFA secret.')) return;

    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/admin-auth/disable-mfa`,
        { userId },
        { headers: { Authorization: `Bearer ${localStorage.getItem('adminToken')}`, 'Content-Type': 'application/json' } }
      );

      setMessage('MFA disabled successfully. You will need to set up a NEW QR code if you enable it again.');
      setMfaEnabled(false);
    } catch (error) {
      setMessage('Failed to disable MFA.');
      console.error('MFA disable error:', error);
    }
  };

  if (loading) {
    return (
      <div className="container mt-[100px] text-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600 text-lg">Loading MFA settings...</p>
      </div>
    );
  }

  return (
    <div className="container mt-[100px]">
      <div className="max-w-8xl mx-auto bg-white p-6 md:p-8 rounded-lg shadow-md">
        <div className="mb-6 text-center">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
            Two-Factor Authentication
          </h1>
          <p className="text-gray-600 text-sm md:text-base">
            Add an extra layer of security to your admin account with MFA.
          </p>
        </div>

        <div className={`mb-6 p-4 rounded-lg ${mfaEnabled ? 'bg-green-50 border border-green-200' : 'bg-yellow-50 border border-yellow-200'}`}>
          <div className="flex items-center">
            <span className="text-2xl mr-3">{mfaEnabled ? '🔒' : '⚠️'}</span>
            <div>
              <p className="font-semibold">
                {mfaEnabled ? 'MFA is Enabled' : 'MFA is Disabled'}
              </p>
              <p className="text-sm text-gray-600">
                {mfaEnabled ? 'Your account is protected with two-factor authentication' : 'Your account is not using two-factor authentication'}
              </p>
            </div>
          </div>
        </div>

        {/* Step 1 */}
        {step === 1 && !mfaEnabled && (
          <div>
            <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-semibold text-blue-900 mb-2">What is MFA?</h3>
              <p className="text-sm text-blue-800">
                Multi-Factor Authentication adds an extra security step when logging in.
                You'll need both your password and a code from your phone.
              </p>
            </div>
            <div className="flex justify-center">
              <button
                onClick={handleSetupMFA}
                className="w-auto text-white py-3 px-4 rounded-full bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-800 hover:to-blue-600 transition-colors font-regular"
              >
                Enable Two-Factor Authentication
              </button>
            </div>
          </div>
        )}

        {/* Step 2 */}
        {step === 2 && (
          <div>
            <div className="mb-6">
              <h3 className="font-semibold text-lg mb-4">Step 1: Scan QR Code</h3>
              <p className="text-gray-600 mb-4">
                Open Google Authenticator, Microsoft Authenticator, or any TOTP app and scan this QR code:
              </p>
              {qrCode && (
                <div className="flex justify-center mb-4">
                  <div className="border-2 border-gray-300 p-4 rounded-lg">
                    <img src={qrCode} alt="QR Code" className="w-64 h-64" />
                  </div>
                </div>
              )}

              <div className="bg-gray-50 border border-gray-300 rounded-lg p-4">
                <p className="text-sm text-gray-600 mb-2">Can't scan? Enter this code manually:</p>
                <code className="bg-white px-3 py-2 rounded border border-gray-300 text-sm font-mono block break-all">
                  {secret}
                </code>
              </div>

              <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p className="text-sm text-yellow-800">
                  ⚠️ <strong>Important:</strong> This QR code is permanent. Save a screenshot or the secret key securely. You'll use the same code even if you set up MFA on multiple devices.
                </p>
              </div>
            </div>

            <div className="mb-6">
              <h3 className="font-semibold text-lg mb-4">Step 2: Enter Verification Code</h3>
              <p className="text-gray-600 mb-4">
                Enter the 6-digit code from your authenticator app:
              </p>
              <input
                type="text"
                maxLength="6"
                placeholder="000000"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, ''))}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-center text-2xl tracking-widest focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setStep(1);
                  setQrCode('');
                  setSecret('');
                  setVerificationCode('');
                  setMessage('');
                }}
                className="flex-1 bg-gray-200 text-gray-700 py-3 px-4 rounded-full hover:bg-gray-300 transition-colors font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={handleVerifyMFA}
                disabled={verificationCode.length !== 6}
                className="flex-1 bg-green-600 text-white py-3 px-4 rounded-full hover:bg-green-700 transition-colors font-semibold disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                Verify & Enable
              </button>
            </div>
          </div>
        )}

        {/* Enabled MFA */}
        {mfaEnabled && (
          <div>
            <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4">
              <p className="text-green-800 mb-2">
                ✅ Your account is protected with two-factor authentication.
                You'll need to enter a code from your authenticator app each time you log in.
              </p>
              <p className="text-green-700 text-sm">
                Your MFA secret is permanent. You can use the same QR code on multiple devices.
              </p>
            </div>

            <button
              onClick={handleDisableMFA}
              className="w-full bg-red-600 text-white py-3 px-4 rounded-lg hover:bg-red-700 transition-colors font-semibold"
            >
              Disable Two-Factor Authentication
            </button>
          </div>
        )}

        {/* Message */}
        {message && (
          <div className={`mt-6 p-4 rounded-lg ${message.includes('success') || message.includes('✅')
              ? 'bg-green-50 border border-green-200 text-green-800'
              : message.includes('⚠️')
                ? 'bg-yellow-50 border border-yellow-200 text-yellow-800'
                : 'bg-red-50 border border-red-200 text-red-800'
            }`}>
            {message}
          </div>
        )}

        <div className="mt-6 bg-white rounded-lg shadow-md p-6">
          <h3 className="font-semibold text-lg mb-3">Need Help?</h3>
          <ul className="space-y-2 text-sm text-gray-600">
            <li>• Download Google Authenticator (iOS/Android) or Microsoft Authenticator</li>
            <li>• Make sure your phone's time is set to automatic</li>
            <li>• Your MFA secret never changes - it's permanent for your account</li>
            <li>• You can use the same QR code on multiple devices</li>
            <li>• Contact support if you lose access to your authenticator app</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default SetupMFA;
