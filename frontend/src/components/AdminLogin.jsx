import React, { useState, useEffect } from "react";
import FingerprintJS from '@fingerprintjs/fingerprintjs';
import { useForm } from "react-hook-form";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { FaUserShield } from "react-icons/fa";
import Swal from "sweetalert2";

const AdminLogin = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [mfaRequired, setMfaRequired] = useState(false);
  const [tempToken, setTempToken] = useState("");
  const [deviceFingerprint, setDeviceFingerprint] = useState("");

  useEffect(() => {
    const setFp = async () => {
      const fp = await FingerprintJS.load();
      const result = await fp.get();
      setDeviceFingerprint(result.visitorId);
    };

    setFp();
  }, []);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  /* Auto redirect */
  useEffect(() => {
    const verify = async () => {
      try {
        await axios.get(`${API_URL}/api/admin-auth/verify`, {
          withCredentials: true,
        });
        navigate("/dashboard", { replace: true });
      } catch { }
    };
    verify();
  }, [navigate, API_URL]);

  const onSubmit = async (data) => {
    setLoading(true);
    setMessage("");

    try {
      const res = await axios.post(
        `${API_URL}/api/admin-auth/admin`,
        { ...data, deviceFingerprint },
        { withCredentials: true }
      );

      if (res.data.mfaRequired) {
        setMfaRequired(true);
        setTempToken(res.data.tempToken);
        reset();
      } else {
        localStorage.setItem("adminToken", res.data.token);

        await Swal.fire({
          icon: "success",
          title: "Login Successful",
          text: "Welcome to the Admin Dashboard",
          timer: 1500,
          showConfirmButton: false,
          customClass: {
            popup: "rounded-2xl",
          },
        });

        navigate("/dashboard", { replace: true });
      }
    } catch (err) {
      setMessage(err.response?.data?.message || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  const onMFASubmit = async (data) => {
    setLoading(true);
    setMessage("");

    try {
      const res = await axios.post(
        `${API_URL}/api/admin-auth/verify-mfa-login`,
        { tempToken, mfaCode: data.mfaCode, deviceFingerprint },
        { withCredentials: true }
      );

      localStorage.setItem("adminToken", res.data.token);
      navigate("/dashboard", { replace: true });
    } catch (err) {
      setMessage(err.response?.data?.message || "Invalid code");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2 font-montserrat admin-scope">

      {/* ================= LEFT SECTION ================= */}
      <div
        className="hidden md:flex items-center justify-center text-center text-white relative px-16"
        style={{
          backgroundImage: `
      linear-gradient(
        rgba(0, 0, 0, 0.35),
        rgba(0, 0, 0, 0.35)
      ),
      url("/group-sessions-parallax.webp")
    `,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* Center content */}
        <div className="relative z-10 max-w-md">
          <h1 className="text-4xl font-semibold tracking-tight mb-6 text-white/90">
            Admin Dashboard
          </h1>

          <p className="text-white/80 text-lg leading-relaxed">
            Manage content, users, analytics, and system settings securely from
            one central place.
          </p>
        </div>

        {/* Footer */}
        <p className="absolute bottom-8 left-0 right-0 text-center text-sm text-white/60">
          © 2026 Sita Admin Panel
        </p>
      </div>



      {/* ================= RIGHT SECTION ================= */}
      <div className="flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-slate-100 px-6">
        <div
          className="
            w-full max-w-md
            bg-white/70 backdrop-blur-xl
            border border-white/60 ring-1 ring-black/5
            shadow-[0_20px_45px_-30px_rgba(15,23,42,0.45)]
            rounded-2xl px-8 pt-10 pb-8
          "
        >
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex flex-col items-center justify-center gap-1 mb-1">
              <div className="shield-glow p-3 bg-white/70 backdrop-blur-md rounded-full border border-white/60 ring-1 ring-black/5">
                <FaUserShield className="text-slate-600 text-3xl sm:text-4xl" />
              </div>
            </div>

            <h2 className="text-2xl font-semibold tracking-tight text-[#7A1F2B]">
              {mfaRequired ? "Verify Access" : "Admin Login"}
            </h2>
            <p className="text-slate-500 text-sm mt-1">
              {mfaRequired
                ? "Enter your 6-digit authentication code"
                : "Authorized personnel only"}
            </p>
          </div>

          {!mfaRequired ? (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <input
                {...register("username", { required: true })}
                placeholder="Username"
                className="
    w-full px-4 py-3 rounded-xl
    bg-white/80 border border-slate-200
    focus:outline-none
    focus:border-[#7A1F2B]
    focus:ring-2 focus:ring-[#7A1F2B]/40
    transition
  "
              />

              <div className="relative">
                <input
                  {...register("password", { required: true })}
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  className="
    w-full px-4 py-3 pr-12 rounded-xl
    bg-white/80 border border-slate-200
    focus:outline-none
    focus:border-[#7A1F2B]
    focus:ring-2 focus:ring-[#7A1F2B]/40
    transition
  "
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              {message && (
                <div className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
                  {message}
                </div>
              )}

              <button
                disabled={loading}
                className="w-full py-3 rounded-xl font-semibold bg-gradient-to-br from-[#7A1F2B] to-[#8b171b] text-white shadow-md hover:opacity-95"
              >
                {loading ? "Signing in..." : "Sign In"}
              </button>
            </form>
          ) : (
            <form onSubmit={handleSubmit(onMFASubmit)} className="space-y-6">
              <input
                {...register("mfaCode", { required: true })}
                maxLength={6}
                className="w-full text-center tracking-widest text-2xl px-4 py-3 rounded-xl bg-white/80 border ring-1 ring-black/5 focus:ring-2 focus:ring-[#7A1F2B]/40"
              />

              {message && (
                <div className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
                  {message}
                </div>
              )}

              <button className="w-full py-3 rounded-xl font-semibold bg-gradient-to-br from-[#7A1F2B] to-[#8b171b] text-white">
                Verify
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
