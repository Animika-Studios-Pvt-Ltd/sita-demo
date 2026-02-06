import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

/* ================= UI THEME ================= */
const glassPanel =
  'bg-white/70 backdrop-blur-xl border border-white/70 ring-1 ring-black/5 rounded-2xl';
const glassCard = `${glassPanel} p-6 md:p-8`;
const glassInput =
  'w-full px-4 py-3 rounded-lg bg-white/70 backdrop-blur-xl border border-white/70 ring-1 ring-black/5 ' +
  'text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200 focus:border-white/80';
const glassBtnPrimary =
  'inline-flex items-center justify-center gap-2 px-5 py-2 rounded-full text-sm font-semibold ' +
  'bg-[#7A1F2B] text-white hover:bg-[#651823] transition-colors';
const glassBtnMuted =
  'inline-flex items-center justify-center gap-2 px-5 py-2 rounded-full text-sm font-semibold ' +
  'bg-white/70 backdrop-blur-xl border border-white/70 ring-1 ring-black/5 text-slate-600 ' +
  'hover:bg-white/90 transition-colors';
const glassBtnDanger =
  'inline-flex items-center justify-center gap-2 px-5 py-2 rounded-full text-sm font-semibold ' +
  'bg-rose-600 text-white hover:bg-rose-700 transition-colors';
const alertBase =
  'rounded-xl p-4 border ring-1 ring-black/5 bg-white/70 backdrop-blur-xl';

const SetupMFA = () => {
  const [qrCode, setQrCode] = useState('');
  const [secret, setSecret] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [message, setMessage] = useState('');
  const [messageTone, setMessageTone] = useState('');
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
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('adminToken')}`,
            'Content-Type': 'application/json',
          },
        }
      );

      setQrCode(response.data.qrCode);
      setSecret(response.data.secret);
      setStep(2);

      if (response.data.alreadySetup) {
        if (response.data.mfaEnabled) {
          setMessage('MFA is already enabled. Scan this QR code if you need to set it up on a new device.');
          setMessageTone('warning');
          setMfaEnabled(true);
        } else {
          setMessage('MFA setup is in progress. Complete verification to enable MFA.');
          setMessageTone('warning');
        }
      } else {
        setMessage('');
        setMessageTone('');
      }
    } catch (error) {
      console.error('Error setting up MFA:', error);
      console.error('Error response:', error.response?.data);
      setMessage('Failed to setup MFA. Please try again.');
      setMessageTone('error');
    }
  };
  const handleVerifyMFA = async () => {
    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/admin-auth/verify-mfa-setup`,
        { userId, token: verificationCode },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('adminToken')}`,
            'Content-Type': 'application/json',
          },
        }
      );

      setMessage('MFA enabled successfully! Your account is now more secure. This QR code is permanent - save it securely.');
      setMessageTone('success');
      setMfaEnabled(true);
      setStep(1);
      setQrCode('');
      setSecret('');
      setVerificationCode('');
    } catch (error) {
      setMessage('Invalid verification code. Please try again.');
      setMessageTone('error');
      console.error('MFA verification error:', error);
    }
  };
  const handleDisableMFA = async () => {
    if (!window.confirm('Are you sure you want to disable MFA? This will make your account less secure and delete your MFA secret.')) return;

    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/admin-auth/disable-mfa`,
        { userId },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('adminToken')}`,
            'Content-Type': 'application/json',
          },
        }
      );

      setMessage('MFA disabled successfully. You will need to set up a new QR code if you enable it again.');
      setMessageTone('warning');
      setMfaEnabled(false);
    } catch (error) {
      setMessage('Failed to disable MFA.');
      setMessageTone('error');
      console.error('MFA disable error:', error);
    }
  };
  const messageToneClass =
    messageTone === 'success'
      ? 'border-emerald-200/70 text-emerald-700 bg-emerald-50/40'
      : messageTone === 'warning'
        ? 'border-amber-200/70 text-amber-800 bg-amber-50/40'
        : messageTone === 'info'
          ? 'border-sky-200/70 text-sky-700 bg-sky-50/40'
          : 'border-rose-200/70 text-rose-700 bg-rose-50/40';

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto p-4 pt-0 mt-10 font-montserrat text-slate-700">
        <div className={`${glassPanel} p-8 text-center`}>
          <div className="inline-flex h-12 w-12 rounded-full border-2 border-slate-200 border-t-[#7A1F2B] animate-spin mb-4"></div>
          <p className="text-slate-600 text-sm">Loading MFA settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-4 pt-0 mt-10 font-montserrat text-slate-700">
      <div className={glassCard}>
        <div className="mb-6 text-center">
          <h1 className="text-2xl md:text-3xl font-semibold text-[#7A1F2B] mb-2">
            Two-Factor Authentication
          </h1>
          <p className="text-slate-500 text-sm md:text-base">
            Add an extra layer of security to your admin account with MFA.
          </p>
        </div>

        <div
          className={`${alertBase} mb-6 ${mfaEnabled
            ? 'border-emerald-200/70 bg-emerald-50/40 text-emerald-800'
            : 'border-amber-200/70 bg-amber-50/40 text-amber-800'
            }`}
        >
          <div className="flex items-start gap-3">
            <span
              className={`mt-1 inline-flex h-2.5 w-2.5 rounded-full ${mfaEnabled ? 'bg-emerald-500' : 'bg-amber-500'}`}
            ></span>
            <div>
              <p className="font-semibold text-[#7A1F2B]">
                {mfaEnabled ? 'MFA is Enabled' : 'MFA is Disabled'}
              </p>
              <p className="text-sm text-slate-600">
                {mfaEnabled
                  ? 'Your account is protected with two-factor authentication.'
                  : 'Your account is not using two-factor authentication.'}
              </p>
            </div>
          </div>
        </div>

        {/* Step 1 */}
        {step === 1 && !mfaEnabled && (
          <div>
            <div className={`${alertBase} mb-6`}>
              <h3 className="font-semibold text-[#7A1F2B] mb-2">What is MFA?</h3>
              <p className="text-sm text-slate-600">
                Multi-factor authentication adds an extra security step when logging in.
                You'll need both your password and a code from your phone.
              </p>
            </div>
            <div className="flex justify-center">
              <button onClick={handleSetupMFA} className={glassBtnPrimary}>
                Enable Two-Factor Authentication
              </button>
            </div>
          </div>
        )}

        {/* Step 2 */}
        {step === 2 && (
          <div>
            <div className="mb-6">
              <h3 className="font-semibold text-lg mb-4 text-slate-700">Step 1: Scan QR Code</h3>
              <p className="text-slate-600 mb-4">
                Open Google Authenticator, Microsoft Authenticator, or any TOTP app and scan this QR code:
              </p>
              {qrCode && (
                <div className="flex justify-center mb-4">
                  <div className={`${glassPanel} p-4`}>
                    <img src={qrCode} alt="QR Code" className="w-64 h-64" />
                  </div>
                </div>
              )}

              <div className={`${alertBase} border-white/70`}>
                <p className="text-sm text-slate-600 mb-2">Can't scan? Enter this code manually:</p>
                <code className="bg-white/80 px-3 py-2 rounded border border-white/70 ring-1 ring-black/5 text-sm block break-all text-slate-700">
                  {secret}
                </code>
              </div>

              <div className={`${alertBase} mt-4 border-amber-200/70 bg-amber-50/40 text-gray-600`}>
                <p className="text-sm text-gray-600">
                  <strong>Important:</strong> This QR code is permanent. Save a screenshot or the secret key securely.
                  You'll use the same code even if you set up MFA on multiple devices.
                </p>
              </div>
            </div>

            <div className="mb-6">
              <h3 className="font-semibold text-lg mb-4 text-slate-700">Step 2: Enter Verification Code</h3>
              <p className="text-slate-600 mb-4">
                Enter the 6-digit code from your authenticator app:
              </p>
              <input
                type="text"
                maxLength="6"
                placeholder="000000"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, ''))}
                className={`${glassInput} text-center text-sm tracking-[0.2em]`}
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => {
                  setStep(1);
                  setQrCode('');
                  setSecret('');
                  setVerificationCode('');
                  setMessage('');
                  setMessageTone('');
                }}
                className={`${glassBtnMuted} flex-1`}
              >
                Cancel
              </button>
              <button
                onClick={handleVerifyMFA}
                disabled={verificationCode.length !== 6}
                className={`${glassBtnPrimary} flex-1 ${verificationCode.length !== 6 ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                Verify & Enable
              </button>
            </div>
          </div>
        )}

        {/* Enabled MFA */}
        {mfaEnabled && (
          <div>
            <div className={`${alertBase} mb-6 border-emerald-200/70 bg-emerald-50/40 text-emerald-800`}>
              <p className="mb-2">
                Your account is protected with two-factor authentication. You'll need to enter a code from your
                authenticator app each time you log in.
              </p>
              <p className="text-sm text-emerald-700">
                Your MFA secret is permanent. You can use the same QR code on multiple devices.
              </p>
            </div>

            <button onClick={handleDisableMFA} className={`${glassBtnDanger} w-full`}>
              Disable Two-Factor Authentication
            </button>
          </div>
        )}

        {/* Message */}
        {message && (
          <div className={`${alertBase} mt-6 ${messageToneClass}`}>
            {message}
          </div>
        )}

        <div className={`${glassPanel} mt-6 p-6`}>
          <h3 className="font-semibold text-lg mb-3 text-[#7A1F2B]">Need Help?</h3>
          <ul className="list-disc pl-5 space-y-2 text-sm text-slate-600">
            <li className="text-gray-600">Download Google Authenticator (iOS/Android) or Microsoft Authenticator.</li>
            <li className="text-gray-600">Make sure your phone's time is set to automatic.</li>
            <li className="text-gray-600">Your MFA secret never changes - it's permanent for your account.</li>
            <li className="text-gray-600">You can use the same QR code on multiple devices.</li>
            <li className="text-gray-600">Contact support if you lose access to your authenticator app.</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default SetupMFA;
