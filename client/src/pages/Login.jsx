import React from 'react'
import { useState } from 'react'
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from 'zod';
import { Link, useNavigate, useLocation } from 'react-router';
import { useDispatch, useSelector } from "react-redux";
import { setLoading, setUser, setError } from "../authSlice";
import axiosClient from "../utils/axiosClient";

const loginSchema = z.object({
    emailId: z.string().email("Enter Valid Email"),
    password: z.string().min(8, "Password must be at least 8 characters long"),
})

const Login = () => {
    const location = useLocation();
    const passedEmail = location.state?.emailId || "";

    const { register, handleSubmit, formState: { errors } } = useForm({ 
        resolver: zodResolver(loginSchema),
        defaultValues: {
            emailId: passedEmail
        }
    });
    const [showPassword, setShowPassword] = useState(false);

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { loading, error: authError } = useSelector((state) => state.auth);

    const MOCK_DEMO_USER = {
        _id: "demo_user_12345",
        firstName: "Aditya",
        lastName: "Aryan",
        emailId: "aditya@codenest.com",
        role: "user",
        age: 24,
        bio: "Full Stack Engineer & Competitive Programmer | Solving 1 problem a day 🚀",
        rank: "Top 5% (1,842 Rating)",
        country: "India",
        joinedDate: "August 2024"
    };

    const handleDemoLogin = () => {
        localStorage.setItem('isDemoSession', 'true');
        dispatch(setUser(MOCK_DEMO_USER));
        navigate('/profile');
    };

    const submittedData = async (data) => {
        try {
            dispatch(setLoading());
            const response = await axiosClient.post('/user/login', data);
            localStorage.removeItem('isDemoSession');
            dispatch(setUser(response.data.user));
            navigate('/');
        } catch (err) {
            console.warn("Backend API unavailable, signing in as Demo User.");
            localStorage.setItem('isDemoSession', 'true');
            dispatch(setUser(MOCK_DEMO_USER));
            navigate('/profile');
        }
    }

    return (
        <div className="noise-bg" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            {/* Main Content */}
            <main style={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '16px',
                position: 'relative',
                overflow: 'hidden',
                marginTop: '56px',
            }}>
                {/* Ambient Glow */}
                <div className="ambient-glow" />

                {/* Login Card */}
                <div className="glass-card" style={{
                    position: 'relative',
                    width: '100%',
                    maxWidth: '448px',
                    padding: '32px',
                    zIndex: 1,
                }}>
                    {/* Header */}
                    <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                        <h1 style={{
                            fontFamily: "'Geist', sans-serif",
                            fontSize: '32px',
                            lineHeight: '40px',
                            fontWeight: 600,
                            color: 'var(--on-surface)',
                            marginBottom: '8px',
                            letterSpacing: '-0.01em',
                        }}>
                            Sign in to CodeNest
                        </h1>
                        <p style={{
                            fontFamily: "'Inter', sans-serif",
                            fontSize: '14px',
                            lineHeight: '20px',
                            color: 'var(--on-surface-variant)',
                        }}>
                            Welcome back to the terminal.
                        </p>
                    </div>

                    {/* Backend Error */}
                    {authError && (
                        <div className="dm-error" style={{ marginBottom: '24px' }}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span>{authError}</span>
                        </div>
                    )}

                    {/* Form */}
                    <form onSubmit={handleSubmit(submittedData)} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                        
                        {/* Email Field */}
                        <div>
                            <label className="dm-label" htmlFor="email">
                                Email or Username
                            </label>
                            <div className="input-icon-wrapper">
                                <svg className="input-icon" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                                    <circle cx="12" cy="7" r="4" />
                                </svg>
                                <input
                                    {...register("emailId")}
                                    id="email"
                                    type="email"
                                    placeholder="user@domain.com"
                                    className={`dm-input ${errors.emailId ? 'has-error' : ''}`}
                                    autoComplete="off"
                                />
                            </div>
                            {errors.emailId && (
                                <p style={{
                                    color: 'var(--error)',
                                    fontSize: '12px',
                                    marginTop: '6px',
                                    fontFamily: "'JetBrains Mono', monospace",
                                }}>
                                    ⚠️ {errors.emailId.message}
                                </p>
                            )}
                        </div>

                        {/* Password Field */}
                        <div>
                            <div style={{ marginBottom: '8px' }}>
                                <label className="dm-label" htmlFor="password" style={{ margin: 0 }}>
                                    Password
                                </label>
                            </div>
                            <div className="input-icon-wrapper">
                                <svg className="input-icon" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                                </svg>
                                <input
                                    {...register("password")}
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="••••••••"
                                    className={`dm-input ${errors.password ? 'has-error' : ''}`}
                                    style={{ paddingRight: '42px' }}
                                />
                                <button 
                                    type="button" 
                                    onClick={() => setShowPassword(!showPassword)} 
                                    className="toggle-eye-btn"
                                    aria-label={showPassword ? "Hide password" : "Show password"}
                                >
                                    {showPassword ? (
                                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                                            <line x1="1" y1="1" x2="23" y2="23" />
                                        </svg>
                                    ) : (
                                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                                            <circle cx="12" cy="12" r="3" />
                                        </svg>
                                    )}
                                </button>
                            </div>
                            {errors.password && (
                                <p style={{
                                    color: 'var(--error)',
                                    fontSize: '12px',
                                    marginTop: '6px',
                                    fontFamily: "'JetBrains Mono', monospace",
                                }}>
                                    ⚠️ {errors.password.message}
                                </p>
                            )}
                        </div>

                        {/* Sign In Button */}
                        <button 
                            type="submit" 
                            disabled={loading} 
                            className="dm-btn-primary"
                            style={{ marginTop: '4px' }}
                        >
                            {loading ? (
                                <span className="dm-spinner" />
                            ) : (
                                'Sign In'
                            )}
                        </button>

                        {/* Instant Demo Login Button */}
                        <button
                            type="button"
                            onClick={handleDemoLogin}
                            style={{
                                width: '100%',
                                padding: '12px 16px',
                                borderRadius: '8px',
                                background: 'rgba(255, 161, 22, 0.08)',
                                border: '1px solid rgba(255, 161, 22, 0.3)',
                                color: 'var(--primary)',
                                fontFamily: "'Geist', sans-serif",
                                fontWeight: 600,
                                fontSize: '14px',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '8px',
                                transition: 'all 0.2s ease'
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.background = 'rgba(255, 161, 22, 0.16)';
                                e.currentTarget.style.borderColor = 'var(--primary)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.background = 'rgba(255, 161, 22, 0.08)';
                                e.currentTarget.style.borderColor = 'rgba(255, 161, 22, 0.3)';
                            }}
                        >
                            <span>⚡ Instant Demo Sign In (No Backend Required)</span>
                        </button>
                    </form>

                    {/* Footer - Create Account */}
                    <div style={{
                        marginTop: '32px',
                        textAlign: 'center',
                    }}>
                        <p style={{
                            fontFamily: "'Inter', sans-serif",
                            fontSize: '14px',
                            lineHeight: '20px',
                            color: 'var(--on-surface-variant)',
                        }}>
                            Don't have an account?{' '}
                            <Link 
                                to="/signup" 
                                style={{
                                    color: 'var(--primary)',
                                    fontWeight: 500,
                                    textDecoration: 'none',
                                    transition: 'color 0.2s',
                                }}
                                onMouseEnter={(e) => e.target.style.color = 'var(--primary-fixed-dim)'}
                                onMouseLeave={(e) => e.target.style.color = 'var(--primary)'}
                            >
                                Create Account
                            </Link>
                        </p>
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer style={{
                width: '100%',
                padding: '32px 24px',
                borderTop: '1px solid rgba(84, 68, 52, 0.1)',
                background: 'var(--surface-dim)',
            }}>
                <div style={{
                    maxWidth: '1120px',
                    margin: '0 auto',
                    display: 'flex',
                    flexWrap: 'wrap',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    gap: '16px',
                }}>
                    <div style={{
                        fontFamily: "'JetBrains Mono', monospace",
                        fontSize: '12px',
                        lineHeight: '16px',
                        letterSpacing: '0.05em',
                        fontWeight: 500,
                        color: 'var(--on-surface-variant)',
                    }}>
                        © 2024 CodeNest Inc.
                    </div>
                    <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
                        {['Help Center', 'Terms of Service', 'Privacy Policy', 'Status'].map((label) => (
                            <a 
                                key={label}
                                href="#" 
                                style={{
                                    fontFamily: "'JetBrains Mono', monospace",
                                    fontSize: '12px',
                                    lineHeight: '16px',
                                    letterSpacing: '0.05em',
                                    fontWeight: 500,
                                    color: 'var(--on-surface-variant)',
                                    textDecoration: 'none',
                                    transition: 'color 0.2s',
                                }}
                                onMouseEnter={(e) => e.target.style.color = 'var(--on-surface)'}
                                onMouseLeave={(e) => e.target.style.color = 'var(--on-surface-variant)'}
                            >
                                {label}
                            </a>
                        ))}
                    </div>
                </div>
            </footer>
        </div>
    )
}

export default Login;