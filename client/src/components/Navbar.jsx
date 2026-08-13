import React from 'react';
import { Link, useNavigate } from 'react-router';
import { useSelector, useDispatch } from 'react-redux';
import { clearUser } from '../authSlice';
import axiosClient from '../utils/axiosClient';

const Navbar = () => {
    const { user } = useSelector((state) => state.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await axiosClient.post('/user/logout'); 
            dispatch(clearUser());
            navigate('/login');
        } catch (error) {
            console.error("Logout failed:", error);
            dispatch(clearUser());
            navigate('/login');
        }
    };

    return (
        <nav className="dm-navbar">
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                width: '100%',
                maxWidth: '1920px',
                margin: '0 auto',
                height: '100%',
            }}>
                {/* Left — Logo + Nav Links */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
                    {/* Logo */}
                    <Link 
                        to="/" 
                        style={{
                            fontFamily: "'Geist', sans-serif",
                            fontSize: '20px',
                            lineHeight: '28px',
                            fontWeight: 700,
                            color: 'var(--primary)',
                            textDecoration: 'none',
                            letterSpacing: '-0.01em',
                        }}
                    >
                        CodeNest
                    </Link>

                </div>

                {/* Right — Nav Links + Actions */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
                    {/* Nav Links (hidden on mobile) */}
                    <div className="nav-links" style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
                        {[
                            { label: 'Problems', to: '/problems' },
                            ...(user?.role === 'admin' ? [{ label: 'Admin', to: '/admin' }] : []),
                        ].map((item) => (
                            <Link
                                key={item.label}
                                to={item.to}
                                style={{
                                    fontFamily: "'Inter', sans-serif",
                                    fontSize: '14px',
                                    lineHeight: '20px',
                                    fontWeight: 500,
                                    color: 'var(--on-surface)',
                                    textDecoration: 'none',
                                    padding: '6px 14px',
                                    borderRadius: '8px',
                                    backgroundColor: 'rgba(84, 68, 52, 0.1)',
                                    border: '1px solid rgba(84, 68, 52, 0.2)',
                                    transition: 'all 0.2s',
                                }}
                                onMouseEnter={(e) => {
                                    e.target.style.backgroundColor = 'rgba(84, 68, 52, 0.2)';
                                    e.target.style.borderColor = 'var(--primary-container)';
                                    e.target.style.color = 'var(--primary)';
                                }}
                                onMouseLeave={(e) => {
                                    e.target.style.backgroundColor = 'rgba(84, 68, 52, 0.1)';
                                    e.target.style.borderColor = 'rgba(84, 68, 52, 0.2)';
                                    e.target.style.color = 'var(--on-surface)';
                                }}
                            >
                                {item.label}
                            </Link>
                        ))}
                    </div>
                    {user ? (
                        /* ─── Logged In View ─── */
                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                            {/* Welcome text */}
                            <span style={{
                                fontFamily: "'Inter', sans-serif",
                                fontSize: '14px',
                                color: 'var(--on-surface)',
                            }}>
                                Welcome, {user.firstName}
                            </span>
                            
                            {/* Profile Avatar Dropdown */}
                            <div className="dropdown dropdown-end">
                                <div 
                                    tabIndex={0} 
                                    role="button" 
                                    style={{
                                        width: '36px',
                                        height: '36px',
                                        borderRadius: '50%',
                                        background: 'linear-gradient(135deg, var(--primary-container), var(--primary-fixed-dim))',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        cursor: 'pointer',
                                        transition: 'box-shadow 0.2s',
                                        boxShadow: '0 0 0 2px transparent',
                                        color: 'var(--on-primary)',
                                        fontFamily: "'Geist', sans-serif",
                                        fontWeight: 700,
                                        fontSize: '14px',
                                    }}
                                    onMouseEnter={(e) => e.currentTarget.style.boxShadow = '0 0 0 2px var(--primary)'}
                                    onMouseLeave={(e) => e.currentTarget.style.boxShadow = '0 0 0 2px transparent'}
                                >
                                    {user.firstName ? user.firstName.charAt(0).toUpperCase() : "U"}
                                </div>
                                <ul 
                                    tabIndex={0} 
                                    className="dropdown-content"
                                    style={{
                                        marginTop: '12px',
                                        zIndex: 50,
                                        padding: '12px',
                                        boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)',
                                        background: 'var(--surface-container-high)',
                                        borderRadius: '12px',
                                        width: '240px',
                                        border: '1px solid rgba(84, 68, 52, 0.2)',
                                        listStyle: 'none',
                                    }}
                                >
                                    {/* User Info */}
                                    <li style={{ padding: '8px 12px', marginBottom: '8px' }}>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                                            <span style={{
                                                fontFamily: "'Geist', sans-serif",
                                                fontWeight: 600,
                                                fontSize: '14px',
                                                color: 'var(--on-surface)',
                                            }}>
                                                {user.firstName} {user.lastName}
                                            </span>
                                            <span style={{
                                                fontFamily: "'JetBrains Mono', monospace",
                                                fontSize: '12px',
                                                color: 'var(--on-surface-variant)',
                                                opacity: 0.7,
                                            }}>
                                                {user.emailId}
                                            </span>
                                        </div>
                                    </li>
                                    <li style={{ height: '1px', background: 'rgba(84, 68, 52, 0.2)', margin: '4px 0' }} />
                                    <li>
                                        <Link 
                                            to="/profile" 
                                            style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '8px',
                                                padding: '10px 12px',
                                                borderRadius: '8px',
                                                color: 'var(--on-surface)',
                                                fontFamily: "'Inter', sans-serif",
                                                fontSize: '14px',
                                                textDecoration: 'none',
                                                transition: 'background 0.15s',
                                            }}
                                            onMouseEnter={(e) => e.currentTarget.style.background = 'var(--surface-container-highest)'}
                                            onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                            </svg>
                                            My Profile
                                        </Link>
                                    </li>
                                    <li style={{ height: '1px', background: 'rgba(84, 68, 52, 0.2)', margin: '4px 0' }} />
                                    <li>
                                        <button 
                                            onClick={handleLogout}
                                            style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '8px',
                                                padding: '10px 12px',
                                                borderRadius: '8px',
                                                color: 'var(--error)',
                                                fontFamily: "'Inter', sans-serif",
                                                fontSize: '14px',
                                                fontWeight: 600,
                                                background: 'none',
                                                border: 'none',
                                                cursor: 'pointer',
                                                width: '100%',
                                                textAlign: 'left',
                                                transition: 'background 0.15s',
                                            }}
                                            onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(147, 0, 10, 0.15)'}
                                            onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                            </svg>
                                            Sign Out
                                        </button>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    ) : (
                        /* ─── Logged Out View ─── */
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <Link 
                                to="/login"
                                style={{
                                    fontFamily: "'JetBrains Mono', monospace",
                                    fontSize: '12px',
                                    letterSpacing: '0.05em',
                                    fontWeight: 500,
                                    color: 'var(--primary)',
                                    textDecoration: 'none',
                                    padding: '8px 16px',
                                    transition: 'color 0.2s',
                                }}
                                onMouseEnter={(e) => e.target.style.color = 'var(--on-surface)'}
                                onMouseLeave={(e) => e.target.style.color = 'var(--primary)'}
                            >
                                Premium
                            </Link>
                            <Link 
                                to="/login"
                                style={{
                                    fontFamily: "'JetBrains Mono', monospace",
                                    fontSize: '12px',
                                    letterSpacing: '0.05em',
                                    fontWeight: 500,
                                    background: 'var(--primary-container)',
                                    color: 'var(--on-primary-container)',
                                    textDecoration: 'none',
                                    padding: '8px 16px',
                                    borderRadius: '6px',
                                    transition: 'all 0.2s',
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.background = 'var(--primary-fixed-dim)';
                                    e.currentTarget.style.transform = 'scale(0.97)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.background = 'var(--primary-container)';
                                    e.currentTarget.style.transform = 'scale(1)';
                                }}
                            >
                                Sign In
                            </Link>
                        </div>
                    )}
                </div>
            </div>

            {/* Responsive Styles */}
            <style>{`
                @media (max-width: 768px) {
                    .nav-links {
                        display: none !important;
                    }
                }
            `}</style>
        </nav>
    );
};

export default Navbar;
