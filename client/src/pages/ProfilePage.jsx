import React, { useEffect, useState, useMemo, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router';
import axiosClient from '../utils/axiosClient';
import { updateAvatar, updateUserProfile } from '../authSlice';
import DifficultyBadge from '../components/DifficultyBadge';

// Helper to format dates nicely
const formatTimeAgo = (dateStr) => {
    if (!dateStr) return 'Recently';
    const diffMs = Date.now() - new Date(dateStr).getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 30) return `${diffDays}d ago`;
    return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

const ProfilePage = () => {
    const { user } = useSelector((state) => state.auth);
    const dispatch = useDispatch();
    const fileInputRef = useRef(null);

    const [solvedProblems, setSolvedProblems] = useState([]);
    const [allProblems, setAllProblems] = useState([]);
    const [submissions, setSubmissions] = useState([]);
    const [loading, setLoading] = useState(true);
    
    // Avatar upload state
    const [isUploading, setIsUploading] = useState(false);
    const [uploadMessage, setUploadMessage] = useState(null);

    // Edit Profile Modal State
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isSavingProfile, setIsSavingProfile] = useState(false);
    const [editFormData, setEditFormData] = useState({
        firstName: '',
        lastName: '',
        bio: '',
        country: ''
    });

    useEffect(() => {
        const fetchRealTimeData = async () => {
            try {
                const [solvedRes, allRes, subRes] = await Promise.allSettled([
                    axiosClient.get('/problem/problemSolvedByUser'),
                    axiosClient.get('/problem/getAllProblem'),
                    axiosClient.get('/submission/userSubmissions')
                ]);

                // 1. Process Solved Problems
                if (solvedRes.status === 'fulfilled' && solvedRes.value?.data?.problems) {
                    setSolvedProblems(solvedRes.value.data.problems);
                } else {
                    setSolvedProblems([]);
                }

                // 2. Process All Problems
                if (allRes.status === 'fulfilled' && allRes.value?.data?.problem) {
                    setAllProblems(allRes.value.data.problem);
                } else {
                    setAllProblems([]);
                }

                // 3. Process Submissions
                if (subRes.status === 'fulfilled' && subRes.value?.data?.submissions) {
                    setSubmissions(subRes.value.data.submissions);
                } else {
                    setSubmissions([]);
                }
            } catch (err) {
                console.error("Failed to load user profile statistics:", err);
            } finally {
                setLoading(false);
            }
        };

        if (user) {
            fetchRealTimeData();
        }
    }, [user]);

    // Handle Open Edit Profile Modal
    const handleOpenEditModal = () => {
        setEditFormData({
            firstName: user?.firstName || '',
            lastName: user?.lastName || '',
            bio: user?.bio || '',
            country: user?.country || 'India'
        });
        setIsEditModalOpen(true);
    };

    // Handle Save Profile
    const handleSaveProfile = async (e) => {
        e.preventDefault();
        setIsSavingProfile(true);

        try {
            // Update Redux state immediately for instant feedback
            dispatch(updateUserProfile({
                firstName: editFormData.firstName,
                lastName: editFormData.lastName,
                bio: editFormData.bio,
                country: editFormData.country
            }));

            // Sync with backend API
            await axiosClient.put('/user/profile', {
                firstName: editFormData.firstName,
                lastName: editFormData.lastName,
                bio: editFormData.bio,
                country: editFormData.country
            });

            setUploadMessage({ type: 'success', text: 'Profile updated successfully!' });
        } catch (err) {
            setUploadMessage({ type: 'error', text: err.response?.data?.message || 'Failed to update profile' });
        } finally {
            setIsSavingProfile(false);
            setIsEditModalOpen(false);
            setTimeout(() => setUploadMessage(null), 4000);
        }
    };

    // Handle Profile Picture File Selection
    const handleFileChange = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validate image format & size (5MB max)
        if (!file.type.startsWith('image/')) {
            setUploadMessage({ type: 'error', text: 'Please select a valid image file.' });
            return;
        }
        if (file.size > 5 * 1024 * 1024) {
            setUploadMessage({ type: 'error', text: 'Image size must be less than 5MB.' });
            return;
        }

        // Instant local preview
        const reader = new FileReader();
        reader.onload = () => {
            dispatch(updateAvatar(reader.result));
        };
        reader.readAsDataURL(file);

        // Upload to Backend (Cloudinary)
        try {
            setIsUploading(true);
            setUploadMessage({ type: 'info', text: 'Uploading avatar to Cloudinary...' });

            const formData = new FormData();
            formData.append('avatar', file);

            const res = await axiosClient.post('/user/avatar', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                }
            });

            if (res.data?.avatarUrl) {
                dispatch(updateAvatar(res.data.avatarUrl));
                setUploadMessage({ type: 'success', text: 'Profile picture updated successfully!' });
            }
        } catch (err) {
            setUploadMessage({ type: 'error', text: err.response?.data?.message || 'Failed to upload picture' });
        } finally {
            setIsUploading(false);
            setTimeout(() => setUploadMessage(null), 4000);
        }
    };

    // ─── Real-Time Dynamic Stat Calculations ───

    // 1. Difficulty breakdown
    const easyTotal = useMemo(() => allProblems.filter(p => p.difficulty?.toLowerCase() === 'easy').length, [allProblems]);
    const medTotal = useMemo(() => allProblems.filter(p => p.difficulty?.toLowerCase() === 'medium').length, [allProblems]);
    const hardTotal = useMemo(() => allProblems.filter(p => p.difficulty?.toLowerCase() === 'hard').length, [allProblems]);

    const easySolved = useMemo(() => solvedProblems.filter(p => p.difficulty?.toLowerCase() === 'easy').length, [solvedProblems]);
    const medSolved = useMemo(() => solvedProblems.filter(p => p.difficulty?.toLowerCase() === 'medium').length, [solvedProblems]);
    const hardSolved = useMemo(() => solvedProblems.filter(p => p.difficulty?.toLowerCase() === 'hard').length, [solvedProblems]);

    // 2. Real-time Acceptance Rate
    const acceptanceRate = useMemo(() => {
        if (submissions.length > 0) {
            const accepted = submissions.filter(s => s.status === 'accepted').length;
            return ((accepted / submissions.length) * 100).toFixed(1) + '%';
        }
        if (solvedProblems.length > 0) {
            return '100%';
        }
        return '0.0%';
    }, [submissions, solvedProblems]);

    // 3. Real-time Streak Calculation (consecutive active days)
    const activeStreak = useMemo(() => {
        if (submissions.length === 0 && solvedProblems.length === 0) return 0;
        const uniqueDates = new Set(
            submissions.map(s => new Date(s.createdAt).toISOString().split('T')[0])
        );
        return Math.max(1, uniqueDates.size);
    }, [submissions, solvedProblems]);

    // 4. Real-time Top Tech Skills derived from solved problem tags
    const topSkills = useMemo(() => {
        const tagCounts = {};
        solvedProblems.forEach(prob => {
            if (prob.tags && Array.isArray(prob.tags)) {
                prob.tags.forEach(t => {
                    tagCounts[t] = (tagCounts[t] || 0) + 1;
                });
            }
        });

        const sortedTags = Object.keys(tagCounts).sort((a, b) => tagCounts[b] - tagCounts[a]);
        if (sortedTags.length > 0) {
            return sortedTags.slice(0, 6);
        }
        return ['Algorithms', 'Data Structures', 'Problem Solving'];
    }, [solvedProblems]);

    // 5. Dynamic User Rank Badge
    const userRankBadge = useMemo(() => {
        if (user?.role === 'admin') return 'ADMINISTRATOR';
        const count = solvedProblems.length;
        if (count >= 20) return 'GRANDMASTER CODER';
        if (count >= 10) return 'PRO CODER';
        if (count >= 5) return 'ADVANCED CODER';
        if (count >= 1) return 'RISING CODER';
        return 'NEWBIE CODER';
    }, [user, solvedProblems]);

    // 6. User Joined Date Formatted
    const joinedDateFormatted = useMemo(() => {
        if (user?.createdAt) {
            return new Date(user.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
        }
        return 'Member';
    }, [user]);

    if (!user) return null;

    // ─── Shared Styles ───
    const cardStyle = {
        background: 'var(--surface-container-low)',
        border: '1px solid rgba(84, 68, 52, 0.2)',
        borderRadius: '16px',
        padding: '24px',
        backdropFilter: 'blur(12px)',
        boxShadow: '0 10px 30px -10px rgba(0, 0, 0, 0.5)',
    };

    const labelStyle = {
        fontFamily: "'JetBrains Mono', monospace",
        fontSize: '11px',
        lineHeight: '16px',
        letterSpacing: '0.08em',
        fontWeight: 600,
        textTransform: 'uppercase',
        color: 'var(--on-surface-variant)',
    };

    return (
        <div className="noise-bg" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', color: 'var(--on-surface)' }}>
            <div className="ambient-glow" />

            <main style={{
                flex: 1,
                marginTop: '56px',
                padding: '40px 24px 80px',
                maxWidth: '1280px',
                width: '100%',
                margin: '56px auto 0',
                position: 'relative',
                zIndex: 1
            }}>
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: '300px 1fr',
                    gap: '32px',
                    alignItems: 'start',
                }}>
                    {/* ════════════════════ LEFT SIDEBAR ════════════════════ */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                        
                        {/* Profile Info Card */}
                        <div style={cardStyle}>
                            <div style={{ textAlign: 'center' }}>
                                
                                {/* Interactive Avatar Upload Container */}
                                <div 
                                    onClick={() => fileInputRef.current?.click()}
                                    style={{
                                        width: '104px',
                                        height: '104px',
                                        borderRadius: '50%',
                                        background: 'linear-gradient(135deg, var(--primary-container), var(--primary-fixed-dim))',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        margin: '0 auto 16px',
                                        border: '3px solid rgba(255, 199, 139, 0.3)',
                                        boxShadow: '0 0 25px rgba(255, 161, 22, 0.2)',
                                        position: 'relative',
                                        cursor: 'pointer',
                                        overflow: 'hidden',
                                    }}
                                    className="avatar-container"
                                    title="Click to upload profile picture"
                                >
                                    {user.avatarUrl ? (
                                        <img 
                                            src={user.avatarUrl} 
                                            alt={`${user.firstName || 'User'}'s Profile`}
                                            style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                                        />
                                    ) : (
                                        <span style={{
                                            fontFamily: "'Geist', sans-serif",
                                            fontSize: '44px',
                                            fontWeight: 700,
                                            color: 'var(--on-primary)',
                                        }}>
                                            {user.firstName ? user.firstName.charAt(0).toUpperCase() : "U"}
                                        </span>
                                    )}

                                    {/* Hover Overlay with Camera Icon */}
                                    <div 
                                        className="avatar-overlay"
                                        style={{
                                            position: 'absolute',
                                            inset: 0,
                                            background: 'rgba(0, 0, 0, 0.65)',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            opacity: isUploading ? 1 : 0,
                                            transition: 'opacity 0.2s ease',
                                            color: '#ffffff',
                                            fontSize: '11px',
                                            fontFamily: "'JetBrains Mono', monospace",
                                            fontWeight: 600
                                        }}
                                    >
                                        {isUploading ? (
                                            <div className="dm-spinner" style={{ width: '22px', height: '22px', borderColor: 'var(--primary)', borderTopColor: 'transparent' }} />
                                        ) : (
                                            <>
                                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginBottom: '4px' }}>
                                                    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path>
                                                    <circle cx="12" cy="13" r="4"></circle>
                                                </svg>
                                                <span>Edit Pic</span>
                                            </>
                                        )}
                                    </div>
                                </div>

                                {/* Hidden File Input */}
                                <input 
                                    type="file" 
                                    ref={fileInputRef} 
                                    onChange={handleFileChange} 
                                    accept="image/*" 
                                    style={{ display: 'none' }} 
                                />

                                {/* Upload / Update Status Notification */}
                                {uploadMessage && (
                                    <div style={{
                                        fontSize: '11px',
                                        fontFamily: "'JetBrains Mono', monospace",
                                        color: uploadMessage.type === 'error' ? 'var(--error)' : 'var(--tertiary)',
                                        marginBottom: '12px',
                                        padding: '4px 8px',
                                        borderRadius: '6px',
                                        background: uploadMessage.type === 'error' ? 'rgba(255, 180, 171, 0.1)' : 'rgba(106, 235, 140, 0.1)'
                                    }}>
                                        {uploadMessage.text}
                                    </div>
                                )}

                                {/* Full Name & Real-time Badge */}
                                <h2 style={{
                                    fontFamily: "'Geist', sans-serif",
                                    fontSize: '22px',
                                    fontWeight: 700,
                                    color: 'var(--on-surface)',
                                    marginBottom: '6px',
                                }}>
                                    {user.firstName} {user.lastName}
                                </h2>

                                <div style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '6px',
                                    padding: '4px 12px',
                                    borderRadius: '12px',
                                    background: 'rgba(255, 161, 22, 0.12)',
                                    border: '1px solid rgba(255, 161, 22, 0.3)',
                                    color: 'var(--primary)',
                                    fontSize: '11px',
                                    fontFamily: "'JetBrains Mono', monospace",
                                    fontWeight: 600,
                                    marginBottom: '16px'
                                }}>
                                    ⚡ {userRankBadge}
                                </div>

                                {/* Bio */}
                                <p style={{
                                    fontFamily: "'Inter', sans-serif",
                                    fontSize: '13px',
                                    color: 'var(--on-surface-variant)',
                                    lineHeight: 1.5,
                                    marginBottom: '20px',
                                    padding: '0 4px'
                                }}>
                                    {user.bio || "No bio added yet. Click 'Edit Profile' to introduce yourself!"}
                                </p>

                                <div style={{ height: '1px', background: 'rgba(84, 68, 52, 0.2)', margin: '16px 0' }} />

                                {/* Extra User Details */}
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', textAlign: 'left', fontSize: '13px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--on-surface-variant)' }}>
                                        <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                                            <polyline points="22,6 12,13 2,6" />
                                        </svg>
                                        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '12px' }}>{user.emailId}</span>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--on-surface-variant)' }}>
                                        <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                                            <circle cx="12" cy="10" r="3" />
                                        </svg>
                                        <span>{user.country || 'India'}</span>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--on-surface-variant)' }}>
                                        <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                                            <line x1="16" y1="2" x2="16" y2="6" />
                                            <line x1="8" y1="2" x2="8" y2="6" />
                                            <line x1="3" y1="10" x2="21" y2="10" />
                                        </svg>
                                        <span>Joined {joinedDateFormatted}</span>
                                    </div>
                                </div>

                                {/* Edit Profile Button */}
                                <button
                                    onClick={handleOpenEditModal}
                                    style={{
                                        width: '100%',
                                        marginTop: '20px',
                                        padding: '10px 16px',
                                        borderRadius: '8px',
                                        background: 'rgba(255, 161, 22, 0.08)',
                                        border: '1px solid rgba(255, 161, 22, 0.3)',
                                        color: 'var(--primary)',
                                        fontFamily: "'Geist', sans-serif",
                                        fontWeight: 600,
                                        fontSize: '13px',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        gap: '8px',
                                        transition: 'all 0.2s ease'
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.background = 'rgba(255, 161, 22, 0.18)';
                                        e.currentTarget.style.borderColor = 'var(--primary)';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.background = 'rgba(255, 161, 22, 0.08)';
                                        e.currentTarget.style.borderColor = 'rgba(255, 161, 22, 0.3)';
                                    }}
                                >
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M12 20h9"></path>
                                        <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
                                    </svg>
                                    <span>Edit Profile</span>
                                </button>
                            </div>
                        </div>

                        {/* Top Skills Card (Derived in real-time) */}
                        <div style={cardStyle}>
                            <h3 style={{
                                fontFamily: "'Geist', sans-serif",
                                fontSize: '16px',
                                fontWeight: 600,
                                color: 'var(--on-surface)',
                                marginBottom: '16px',
                            }}>
                                Primary Tech Skills
                            </h3>
                            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                                {topSkills.map((skill) => (
                                    <span
                                        key={skill}
                                        style={{
                                            fontFamily: "'JetBrains Mono', monospace",
                                            fontSize: '12px',
                                            padding: '6px 12px',
                                            borderRadius: '8px',
                                            border: '1px solid rgba(84, 68, 52, 0.3)',
                                            color: 'var(--on-surface-variant)',
                                            background: 'rgba(255, 255, 255, 0.02)',
                                        }}
                                    >
                                        {skill}
                                    </span>
                                ))}
                            </div>
                        </div>

                    </div>

                    {/* ════════════════════ MAIN DASHBOARD ════════════════════ */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
                        
                        {/* Header & Quick Stat Cards */}
                        <div>
                            <h1 style={{
                                fontFamily: "'Geist', sans-serif",
                                fontSize: '28px',
                                fontWeight: 700,
                                color: 'var(--on-surface)',
                                marginBottom: '20px',
                                letterSpacing: '-0.01em'
                            }}>
                                Performance Analytics & Solved History
                            </h1>

                            <div style={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                                gap: '16px',
                            }}>
                                {/* Total Solved */}
                                <div style={cardStyle}>
                                    <p style={{ ...labelStyle, marginBottom: '10px' }}>Total Solved</p>
                                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
                                        <span style={{
                                            fontFamily: "'Geist', sans-serif",
                                            fontSize: '36px',
                                            fontWeight: 700,
                                            color: 'var(--primary)',
                                            lineHeight: 1,
                                        }}>
                                            {solvedProblems.length}
                                        </span>
                                        <span style={{
                                            fontFamily: "'JetBrains Mono', monospace",
                                            fontSize: '14px',
                                            color: 'var(--on-surface-variant)',
                                        }}>
                                            / {allProblems.length || 0}
                                        </span>
                                    </div>
                                </div>

                                {/* Acceptance Rate */}
                                <div style={cardStyle}>
                                    <p style={{ ...labelStyle, marginBottom: '10px' }}>Acceptance Rate</p>
                                    <div style={{
                                        fontFamily: "'Geist', sans-serif",
                                        fontSize: '36px',
                                        fontWeight: 700,
                                        color: 'var(--tertiary)',
                                        lineHeight: 1,
                                    }}>
                                        {acceptanceRate}
                                    </div>
                                </div>

                                {/* Active Streak */}
                                <div style={cardStyle}>
                                    <p style={{ ...labelStyle, marginBottom: '10px' }}>Active Streak</p>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <span style={{
                                            fontFamily: "'Geist', sans-serif",
                                            fontSize: '36px',
                                            fontWeight: 700,
                                            color: 'var(--primary-container)',
                                            lineHeight: 1,
                                        }}>
                                            {activeStreak}
                                        </span>
                                        <span style={{ fontSize: '20px' }}>🔥 Days</span>
                                    </div>
                                </div>

                                {/* Difficulty Breakdown Card */}
                                <div style={{ ...cardStyle, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '10px' }}>
                                    {[
                                        { label: 'Easy', solved: easySolved, total: easyTotal, color: '#4cce73' },
                                        { label: 'Medium', solved: medSolved, total: medTotal, color: '#ffa116' },
                                        { label: 'Hard', solved: hardSolved, total: hardTotal, color: '#ffb4ab' },
                                    ].map(({ label, solved, total, color }) => (
                                        <div key={label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <span style={{
                                                fontFamily: "'JetBrains Mono', monospace",
                                                fontSize: '11px',
                                                fontWeight: 600,
                                                color: color,
                                                textTransform: 'uppercase',
                                            }}>
                                                {label}
                                            </span>
                                            <span style={{
                                                fontFamily: "'JetBrains Mono', monospace",
                                                fontSize: '12px',
                                                fontWeight: 500,
                                                color: 'var(--on-surface-variant)',
                                            }}>
                                                {solved} / {total}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Solved Problems Grid */}
                        <div style={cardStyle}>
                            <h3 style={{
                                fontFamily: "'Geist', sans-serif",
                                fontSize: '18px',
                                fontWeight: 600,
                                color: 'var(--on-surface)',
                                marginBottom: '20px'
                            }}>
                                Solved Problem Set ({solvedProblems.length})
                            </h3>

                            {loading ? (
                                <div style={{ display: 'flex', justifyContent: 'center', padding: '40px 0' }}>
                                    <div className="dm-spinner" style={{ width: '32px', height: '32px', borderWidth: '3px', borderColor: 'var(--primary)', borderTopColor: 'transparent' }} />
                                </div>
                            ) : solvedProblems.length === 0 ? (
                                <div style={{ textAlign: 'center', padding: '36px 0', color: 'var(--on-surface-variant)' }}>
                                    <p style={{ marginBottom: '16px', fontSize: '14px' }}>No problems solved yet.</p>
                                    <Link to="/problems" className="dm-btn-primary" style={{ padding: '8px 20px', fontSize: '13px', display: 'inline-block', textDecoration: 'none' }}>
                                        Explore Problems
                                    </Link>
                                </div>
                            ) : (
                                <div style={{
                                    display: 'grid',
                                    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                                    gap: '14px',
                                }}>
                                    {solvedProblems.map((prob) => (
                                        <Link
                                            to={`/problem/${prob._id}`}
                                            key={prob._id}
                                            style={{
                                                background: 'rgba(255, 255, 255, 0.02)',
                                                border: '1px solid rgba(84, 68, 52, 0.25)',
                                                borderRadius: '12px',
                                                padding: '16px',
                                                display: 'flex',
                                                flexDirection: 'column',
                                                justifyContent: 'space-between',
                                                gap: '12px',
                                                textDecoration: 'none',
                                                transition: 'all 0.2s ease',
                                            }}
                                            onMouseEnter={(e) => {
                                                e.currentTarget.style.borderColor = 'rgba(255, 161, 22, 0.4)';
                                                e.currentTarget.style.transform = 'translateY(-2px)';
                                            }}
                                            onMouseLeave={(e) => {
                                                e.currentTarget.style.borderColor = 'rgba(84, 68, 52, 0.25)';
                                                e.currentTarget.style.transform = 'translateY(0)';
                                            }}
                                        >
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px' }}>
                                                <h4 style={{
                                                    fontFamily: "'Inter', sans-serif",
                                                    fontSize: '15px',
                                                    fontWeight: 600,
                                                    color: 'var(--on-surface)',
                                                    lineHeight: 1.3
                                                }}>
                                                    {prob.title}
                                                </h4>
                                                <DifficultyBadge level={prob.difficulty} />
                                            </div>

                                            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                                                {prob.tags?.map((tag, i) => (
                                                    <span key={i} style={{
                                                        fontFamily: "'JetBrains Mono', monospace",
                                                        fontSize: '11px',
                                                        color: 'var(--on-surface-variant)',
                                                        background: 'var(--surface-container-highest)',
                                                        padding: '3px 8px',
                                                        borderRadius: '6px',
                                                    }}>
                                                        {tag}
                                                    </span>
                                                ))}
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Recent Submissions Activity Log */}
                        <div style={{
                            ...cardStyle,
                            padding: 0,
                            overflow: 'hidden',
                        }}>
                            <div style={{ padding: '24px 24px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <h3 style={{
                                    fontFamily: "'Geist', sans-serif",
                                    fontSize: '18px',
                                    fontWeight: 600,
                                    color: 'var(--on-surface)',
                                }}>
                                    Recent Submissions Log
                                </h3>
                                <span style={{
                                    fontFamily: "'JetBrains Mono', monospace",
                                    fontSize: '11px',
                                    color: 'var(--tertiary)',
                                    background: 'rgba(106, 235, 140, 0.12)',
                                    padding: '4px 10px',
                                    borderRadius: '10px'
                                }}>
                                    REAL-TIME SYNC
                                </span>
                            </div>

                            <div style={{ overflowX: 'auto' }}>
                                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                                    <thead>
                                        <tr style={{ borderTop: '1px solid rgba(84, 68, 52, 0.2)', borderBottom: '1px solid rgba(84, 68, 52, 0.2)', background: 'rgba(255,255,255,0.01)' }}>
                                            {['Status', 'Problem', 'Runtime', 'Memory', 'Language', 'Time Ago'].map((col) => (
                                                <th key={col} style={{
                                                    ...labelStyle,
                                                    padding: '14px 20px',
                                                }}>
                                                    {col}
                                                </th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {submissions.length === 0 ? (
                                            <tr>
                                                <td colSpan="6" style={{ textAlign: 'center', padding: '36px 20px', color: 'var(--on-surface-variant)', fontSize: '13px', fontFamily: "'JetBrains Mono', monospace" }}>
                                                    No submissions recorded yet.
                                                </td>
                                            </tr>
                                        ) : (
                                            submissions.map((sub) => (
                                                <tr key={sub._id} style={{ borderBottom: '1px solid rgba(84, 68, 52, 0.1)', transition: 'background 0.15s' }}>
                                                    <td style={{ padding: '14px 20px' }}>
                                                        <span style={{
                                                            fontFamily: "'JetBrains Mono', monospace",
                                                            fontSize: '12px',
                                                            fontWeight: 600,
                                                            color: sub.status === 'accepted' ? '#4cce73' : '#ffb4ab',
                                                            display: 'inline-flex',
                                                            alignItems: 'center',
                                                            gap: '6px'
                                                        }}>
                                                            {sub.status === 'accepted' ? (
                                                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                                                                    <polyline points="20 6 9 17 4 12"></polyline>
                                                                </svg>
                                                            ) : (
                                                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                                                                    <line x1="18" y1="6" x2="6" y2="18"></line>
                                                                    <line x1="6" y1="6" x2="18" y2="18"></line>
                                                                </svg>
                                                            )}
                                                            {sub.status ? sub.status.toUpperCase() : 'PENDING'}
                                                        </span>
                                                    </td>
                                                    <td style={{ padding: '14px 20px' }}>
                                                        {sub.problemId?._id ? (
                                                            <Link to={`/problem/${sub.problemId._id}`} style={{
                                                                fontFamily: "'Inter', sans-serif",
                                                                fontSize: '14px',
                                                                fontWeight: 500,
                                                                color: 'var(--on-surface)',
                                                                textDecoration: 'none',
                                                                transition: 'color 0.2s',
                                                            }}
                                                                onMouseEnter={(e) => e.target.style.color = 'var(--primary)'}
                                                                onMouseLeave={(e) => e.target.style.color = 'var(--on-surface)'}
                                                            >
                                                                {sub.problemId.title || 'Problem'}
                                                            </Link>
                                                        ) : (
                                                            <span style={{ color: 'var(--on-surface)' }}>{sub.problemId?.title || 'Problem'}</span>
                                                        )}
                                                    </td>
                                                    <td style={{ padding: '14px 20px', fontFamily: "'JetBrains Mono', monospace", fontSize: '13px', color: 'var(--on-surface-variant)' }}>
                                                        {sub.runtime ? `${sub.runtime} ms` : '—'}
                                                    </td>
                                                    <td style={{ padding: '14px 20px', fontFamily: "'JetBrains Mono', monospace", fontSize: '13px', color: 'var(--on-surface-variant)' }}>
                                                        {sub.memory ? `${sub.memory} MB` : '—'}
                                                    </td>
                                                    <td style={{ padding: '14px 20px', fontFamily: "'JetBrains Mono', monospace", fontSize: '13px', color: 'var(--primary)' }}>
                                                        {sub.language || 'c++'}
                                                    </td>
                                                    <td style={{ padding: '14px 20px', fontFamily: "'JetBrains Mono', monospace", fontSize: '13px', color: 'var(--on-surface-variant)' }}>
                                                        {formatTimeAgo(sub.createdAt)}
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                    </div>
                </div>
            </main>

            {/* ─── Edit Profile Modal ─── */}
            {isEditModalOpen && (
                <div
                    onClick={() => setIsEditModalOpen(false)}
                    style={{
                        position: 'fixed',
                        inset: 0,
                        zIndex: 100,
                        background: 'rgba(0, 0, 0, 0.75)',
                        backdropFilter: 'blur(8px)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '24px',
                        animation: 'fadeIn 0.2s ease-out'
                    }}
                >
                    <div
                        onClick={(e) => e.stopPropagation()}
                        className="glass-card"
                        style={{
                            maxWidth: '480px',
                            width: '100%',
                            padding: '32px',
                            borderRadius: '16px',
                            position: 'relative',
                            border: '1px solid rgba(84, 68, 52, 0.3)',
                            boxShadow: '0 25px 60px -10px rgba(0, 0, 0, 0.8), 0 0 30px rgba(255, 161, 22, 0.1)',
                            background: 'var(--surface-container-low)'
                        }}
                    >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                            <h3 style={{
                                fontFamily: "'Geist', sans-serif",
                                fontSize: '20px',
                                fontWeight: 700,
                                color: 'var(--on-surface)'
                            }}>
                                Edit Profile Details
                            </h3>
                            <button
                                onClick={() => setIsEditModalOpen(false)}
                                style={{
                                    background: 'none',
                                    border: 'none',
                                    color: 'var(--outline)',
                                    cursor: 'pointer',
                                    padding: '4px',
                                    display: 'flex',
                                    alignItems: 'center'
                                }}
                            >
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <line x1="18" y1="6" x2="6" y2="18"></line>
                                    <line x1="6" y1="6" x2="18" y2="18"></line>
                                </svg>
                            </button>
                        </div>

                        <form onSubmit={handleSaveProfile} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                            {/* First Name & Last Name */}
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                                <div>
                                    <label className="dm-label">First Name</label>
                                    <input
                                        type="text"
                                        value={editFormData.firstName}
                                        onChange={(e) => setEditFormData({ ...editFormData, firstName: e.target.value })}
                                        className="dm-input"
                                        style={{ paddingLeft: '14px' }}
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="dm-label">Last Name</label>
                                    <input
                                        type="text"
                                        value={editFormData.lastName}
                                        onChange={(e) => setEditFormData({ ...editFormData, lastName: e.target.value })}
                                        className="dm-input"
                                        style={{ paddingLeft: '14px' }}
                                        required
                                    />
                                </div>
                            </div>

                            {/* Email (Read only info) */}
                            <div>
                                <label className="dm-label">Email Address (Registered)</label>
                                <input
                                    type="email"
                                    value={user.emailId}
                                    disabled
                                    className="dm-input"
                                    style={{ paddingLeft: '14px', opacity: 0.6, cursor: 'not-allowed' }}
                                />
                            </div>

                            {/* Location / Country */}
                            <div>
                                <label className="dm-label">Location / Country</label>
                                <input
                                    type="text"
                                    value={editFormData.country}
                                    onChange={(e) => setEditFormData({ ...editFormData, country: e.target.value })}
                                    placeholder="e.g. India, San Francisco, CA"
                                    className="dm-input"
                                    style={{ paddingLeft: '14px' }}
                                />
                            </div>

                            {/* Bio */}
                            <div>
                                <label className="dm-label">Bio / Tagline</label>
                                <textarea
                                    value={editFormData.bio}
                                    onChange={(e) => setEditFormData({ ...editFormData, bio: e.target.value })}
                                    placeholder="Write a brief intro about yourself..."
                                    rows={3}
                                    className="dm-input"
                                    style={{ padding: '10px 14px', resize: 'vertical', minHeight: '80px' }}
                                    maxLength={200}
                                />
                                <div style={{ textAlign: 'right', fontSize: '11px', color: 'var(--outline)', marginTop: '4px', fontFamily: "'JetBrains Mono', monospace" }}>
                                    {editFormData.bio.length} / 200
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
                                <button
                                    type="button"
                                    onClick={() => setIsEditModalOpen(false)}
                                    style={{
                                        flex: 1,
                                        padding: '10px',
                                        borderRadius: '8px',
                                        border: '1px solid rgba(84, 68, 52, 0.3)',
                                        background: 'transparent',
                                        color: 'var(--on-surface-variant)',
                                        fontFamily: "'Geist', sans-serif",
                                        fontWeight: 600,
                                        fontSize: '14px',
                                        cursor: 'pointer'
                                    }}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSavingProfile}
                                    className="dm-btn-primary"
                                    style={{
                                        flex: 1,
                                        padding: '10px',
                                        fontSize: '14px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        gap: '8px'
                                    }}
                                >
                                    {isSavingProfile ? (
                                        <div className="dm-spinner" style={{ width: '18px', height: '18px' }} />
                                    ) : (
                                        'Save Changes'
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Footer */}
            <footer style={{
                width: '100%',
                padding: '32px 24px',
                borderTop: '1px solid rgba(84, 68, 52, 0.1)',
                background: 'var(--surface-dim)',
            }}>
                <div style={{
                    maxWidth: '1280px',
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

            <style>{`
                .avatar-container:hover .avatar-overlay {
                    opacity: 1 !important;
                }
                @media (max-width: 900px) {
                    main > div {
                        grid-template-columns: 1fr !important;
                    }
                }
            `}</style>
        </div>
    );
};

export default ProfilePage;
