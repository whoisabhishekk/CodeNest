import React, { useEffect, useState, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router';
import axiosClient from '../utils/axiosClient';
import DifficultyBadge from '../components/DifficultyBadge';

const ProfilePage = () => {
    const { user } = useSelector((state) => state.auth);
    const [solvedProblems, setSolvedProblems] = useState([]);
    const [allProblems, setAllProblems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [solvedRes, allRes] = await Promise.all([
                    axiosClient.get('/problem/problemSolvedByUser'),
                    axiosClient.get('/problem/getAllProblem')
                ]);
                setSolvedProblems(solvedRes.data.problems || []);
                setAllProblems(allRes.data.problem || []);
            } catch (err) {
                setError(err.response?.data?.message || "Failed to load data");
            } finally {
                setLoading(false);
            }
        };

        if (user) {
            fetchData();
        }
    }, [user]);

    if (!user) return null;

    // ─── Shared Styles ───
    const card = {
        background: 'var(--surface-container-low)',
        border: '1px solid rgba(84, 68, 52, 0.2)',
        borderRadius: '12px',
        padding: '24px',
    };

    const labelStyle = {
        fontFamily: "'JetBrains Mono', monospace",
        fontSize: '12px',
        lineHeight: '16px',
        letterSpacing: '0.05em',
        fontWeight: 500,
        textTransform: 'uppercase',
        color: 'var(--on-surface-variant)',
    };

    const easyTotal = allProblems.filter(p => p.difficulty?.toLowerCase() === 'easy').length;
    const medTotal = allProblems.filter(p => p.difficulty?.toLowerCase() === 'medium').length;
    const hardTotal = allProblems.filter(p => p.difficulty?.toLowerCase() === 'hard').length;

    const easySolved = solvedProblems.filter(p => p.difficulty?.toLowerCase() === 'easy').length;
    const medSolved = solvedProblems.filter(p => p.difficulty?.toLowerCase() === 'medium').length;
    const hardSolved = solvedProblems.filter(p => p.difficulty?.toLowerCase() === 'hard').length;

    return (
        <div className="noise-bg" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <main style={{
                flex: 1,
                marginTop: '56px',
                padding: '32px 24px',
                maxWidth: '1200px',
                width: '100%',
                margin: '56px auto 0',
            }}>
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: '260px 1fr',
                    gap: '24px',
                    alignItems: 'start',
                }}>
                    {/* ════════════════════ LEFT SIDEBAR ════════════════════ */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        {/* Profile Card */}
                        <div style={card}>
                            <div style={{ textAlign: 'center' }}>
                                {/* Avatar */}
                                <div style={{
                                    width: '96px',
                                    height: '96px',
                                    borderRadius: '12px',
                                    background: 'linear-gradient(135deg, var(--surface-container-highest), var(--surface-container))',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    margin: '0 auto 16px',
                                    border: '2px solid rgba(84, 68, 52, 0.3)',
                                    overflow: 'hidden',
                                }}>
                                    <span style={{
                                        fontFamily: "'Geist', sans-serif",
                                        fontSize: '40px',
                                        fontWeight: 700,
                                        color: 'var(--primary)',
                                    }}>
                                        {user.firstName ? user.firstName.charAt(0).toUpperCase() : "U"}
                                    </span>
                                </div>

                                {/* Name */}
                                <h2 style={{
                                    fontFamily: "'Geist', sans-serif",
                                    fontSize: '20px',
                                    fontWeight: 600,
                                    color: 'var(--on-surface)',
                                    marginBottom: '4px',
                                }}>
                                    {user.firstName} {user.lastName}
                                </h2>

                                {/* Bio */}
                                <p style={{
                                    fontFamily: "'Inter', sans-serif",
                                    fontSize: '13px',
                                    color: 'var(--on-surface-variant)',
                                    marginBottom: '16px',
                                }}>
                                    Building logic, breaking bugs.
                                </p>


                            </div>
                        </div>

                        {/* Top Skills Card */}
                        <div style={card}>
                            <h3 style={{
                                fontFamily: "'Geist', sans-serif",
                                fontSize: '18px',
                                fontWeight: 600,
                                color: 'var(--on-surface)',
                                marginBottom: '16px',
                            }}>
                                Top Skills
                            </h3>
                            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                                {['Algorithms', 'Data Structures', 'Dynamic Programming', 'Graphs'].map((skill) => (
                                    <span
                                        key={skill}
                                        style={{
                                            fontFamily: "'JetBrains Mono', monospace",
                                            fontSize: '12px',
                                            letterSpacing: '0.03em',
                                            fontWeight: 500,
                                            padding: '6px 14px',
                                            borderRadius: '6px',
                                            border: '1px solid rgba(84, 68, 52, 0.3)',
                                            color: 'var(--on-surface-variant)',
                                            background: 'transparent',
                                        }}
                                    >
                                        {skill}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* ════════════════════ MAIN CONTENT ════════════════════ */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        {/* Your Journey heading */}
                        <h1 style={{
                            fontFamily: "'Geist', sans-serif",
                            fontSize: '32px',
                            lineHeight: '40px',
                            fontWeight: 600,
                            color: 'var(--on-surface)',
                        }}>
                            Your Journey
                        </h1>

                        {/* Empty state / Solved problems */}
                        {loading ? (
                            <div style={{ display: 'flex', justifyContent: 'center', padding: '60px 0' }}>
                                <div className="dm-spinner" style={{
                                    width: '32px', height: '32px',
                                    borderWidth: '3px',
                                    borderColor: 'var(--primary)',
                                    borderTopColor: 'transparent',
                                }} />
                            </div>
                        ) : error ? (
                            <div className="dm-error">{error}</div>
                        ) : solvedProblems.length === 0 ? (
                            <div style={{
                                ...card,
                                textAlign: 'center',
                                padding: '48px 24px',
                            }}>
                                <div style={{ fontSize: '36px', marginBottom: '12px' }}>🌱</div>
                                <h3 style={{
                                    fontFamily: "'Geist', sans-serif",
                                    fontSize: '20px',
                                    fontWeight: 600,
                                    color: 'var(--on-surface)',
                                    marginBottom: '8px',
                                }}>
                                    No problems solved yet!
                                </h3>
                                <p style={{
                                    fontFamily: "'Inter', sans-serif",
                                    fontSize: '14px',
                                    color: 'var(--on-surface-variant)',
                                    marginBottom: '24px',
                                }}>
                                    Start your coding journey by solving your first problem.
                                </p>
                                <Link
                                    to="/problems"
                                    className="dm-btn-primary"
                                    style={{
                                        width: 'auto',
                                        display: 'inline-flex',
                                        padding: '12px 32px',
                                        fontSize: '14px',
                                        fontFamily: "'JetBrains Mono', monospace",
                                        letterSpacing: '0.05em',
                                        fontWeight: 500,
                                        textDecoration: 'none',
                                    }}
                                >
                                    Browse Problems
                                </Link>
                            </div>
                        ) : (
                            /* Solved problems grid (when user has solved) */
                            <div style={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                                gap: '12px',
                            }}>
                                {solvedProblems.map((prob) => (
                                    <Link
                                        to={`/problem/${prob._id}`}
                                        key={prob._id}
                                        style={{
                                            ...card,
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                            textDecoration: 'none',
                                            transition: 'border-color 0.2s, background 0.2s',
                                            padding: '16px 20px',
                                        }}
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.borderColor = 'rgba(255, 161, 22, 0.4)';
                                            e.currentTarget.style.background = 'var(--surface-container)';
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.borderColor = 'rgba(84, 68, 52, 0.2)';
                                            e.currentTarget.style.background = 'var(--surface-container-low)';
                                        }}
                                    >
                                        <div>
                                            <h3 style={{
                                                fontFamily: "'Inter', sans-serif",
                                                fontSize: '14px',
                                                fontWeight: 500,
                                                color: 'var(--on-surface)',
                                                marginBottom: '6px',
                                            }}>
                                                {prob.title}
                                            </h3>
                                            <div style={{ display: 'flex', gap: '6px' }}>
                                                {prob.tags?.slice(0, 2).map((tag, i) => (
                                                    <span key={i} style={{
                                                        fontFamily: "'JetBrains Mono', monospace",
                                                        fontSize: '11px',
                                                        color: 'var(--on-surface-variant)',
                                                        background: 'var(--surface-container-highest)',
                                                        padding: '2px 8px',
                                                        borderRadius: '4px',
                                                    }}>
                                                        {tag}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                        <DifficultyBadge level={prob.difficulty} />
                                    </Link>
                                ))}
                            </div>
                        )}

                        {/* Stats Row */}
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: '1fr 1fr',
                            gap: '20px',
                        }}>
                            {/* Total Solved */}
                            <div style={card}>
                                <p style={{ ...labelStyle, marginBottom: '8px' }}>Total Solved</p>
                                <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
                                    <span style={{
                                        fontFamily: "'Geist', sans-serif",
                                        fontSize: '40px',
                                        fontWeight: 700,
                                        color: 'var(--on-surface)',
                                        lineHeight: 1,
                                    }}>
                                        {solvedProblems.length}
                                    </span>
                                    <span style={{
                                        fontFamily: "'JetBrains Mono', monospace",
                                        fontSize: '16px',
                                        color: 'var(--on-surface-variant)',
                                    }}>
                                        / {allProblems.length}
                                    </span>
                                </div>
                            </div>

                            {/* Difficulty breakdown */}
                            <div style={{ ...card, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '10px' }}>
                                {[
                                    { label: 'Easy', solved: easySolved, total: easyTotal, color: '#4cce73' },
                                    { label: 'Medium', solved: medSolved, total: medTotal, color: '#ffa116' },
                                    { label: 'Hard', solved: hardSolved, total: hardTotal, color: '#ffb4ab' },
                                ].map(({ label, solved, total, color }) => (
                                    <div key={label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <span style={{
                                            fontFamily: "'JetBrains Mono', monospace",
                                            fontSize: '12px',
                                            letterSpacing: '0.05em',
                                            fontWeight: 500,
                                            color: color,
                                            textTransform: 'uppercase',
                                        }}>
                                            {label}
                                        </span>
                                        <span style={{
                                            fontFamily: "'JetBrains Mono', monospace",
                                            fontSize: '13px',
                                            fontWeight: 500,
                                            color: 'var(--on-surface-variant)',
                                        }}>
                                            {solved} / {total}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Recent Submissions Table */}
                        <div style={{
                            ...card,
                            padding: 0,
                            overflow: 'hidden',
                        }}>
                            <h3 style={{
                                fontFamily: "'Geist', sans-serif",
                                fontSize: '20px',
                                fontWeight: 600,
                                color: 'var(--on-surface)',
                                padding: '24px 24px 16px',
                            }}>
                                Recent Submissions
                            </h3>

                            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                <thead>
                                    <tr style={{ borderTop: '1px solid rgba(84, 68, 52, 0.2)', borderBottom: '1px solid rgba(84, 68, 52, 0.2)' }}>
                                        {['Time Submitted', 'Question', 'Status', 'Runtime', 'Language'].map((col) => (
                                            <th key={col} style={{
                                                ...labelStyle,
                                                padding: '12px 20px',
                                                textAlign: 'left',
                                            }}>
                                                {col}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {solvedProblems.length > 0 ? (
                                        solvedProblems.slice(0, 5).map((prob) => (
                                            <tr key={prob._id} style={{ borderBottom: '1px solid rgba(84, 68, 52, 0.1)' }}>
                                                <td style={{ padding: '14px 20px', fontFamily: "'JetBrains Mono', monospace", fontSize: '13px', color: 'var(--on-surface-variant)' }}>
                                                    Recently
                                                </td>
                                                <td style={{ padding: '14px 20px' }}>
                                                    <Link to={`/problem/${prob._id}`} style={{
                                                        fontFamily: "'Inter', sans-serif",
                                                        fontSize: '14px',
                                                        color: 'var(--on-surface)',
                                                        textDecoration: 'none',
                                                        transition: 'color 0.2s',
                                                    }}
                                                        onMouseEnter={(e) => e.target.style.color = 'var(--primary)'}
                                                        onMouseLeave={(e) => e.target.style.color = 'var(--on-surface)'}
                                                    >
                                                        {prob.title}
                                                    </Link>
                                                </td>
                                                <td style={{ padding: '14px 20px', fontFamily: "'JetBrains Mono', monospace", fontSize: '12px', color: '#4cce73' }}>
                                                    Accepted
                                                </td>
                                                <td style={{ padding: '14px 20px', fontFamily: "'JetBrains Mono', monospace", fontSize: '13px', color: 'var(--on-surface-variant)' }}>
                                                    —
                                                </td>
                                                <td style={{ padding: '14px 20px', fontFamily: "'JetBrains Mono', monospace", fontSize: '13px', color: 'var(--on-surface-variant)' }}>
                                                    JavaScript
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="5" style={{
                                                padding: '40px 20px',
                                                textAlign: 'center',
                                                fontFamily: "'JetBrains Mono', monospace",
                                                fontSize: '13px',
                                                color: 'var(--on-surface-variant)',
                                            }}>
                                                No recent submissions found.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
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

            {/* Responsive */}
            <style>{`
                @media (max-width: 768px) {
                    main > div {
                        grid-template-columns: 1fr !important;
                    }
                }
            `}</style>
        </div>
    );
};

export default ProfilePage;
