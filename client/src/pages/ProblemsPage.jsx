import React, { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import { setProblems, setProblemLoading, setProblemError } from '../problemSlice';
import axiosClient from '../utils/axiosClient';
import DifficultyBadge from '../components/DifficultyBadge';

const ITEMS_PER_PAGE = 50;

// All available tags for filter sidebar
const ALL_TAGS = [
    'Array', 'String', 'Hash Table',
    'Dynamic Programming', 'Math',
    'Sorting', 'Greedy',
    'Depth-First Search', 'Binary Search',
    'Tree', 'Stack', 'Graph',
];

const ProblemsPage = () => {
    const dispatch = useDispatch();
    const { problems, loading, error } = useSelector((state) => state.problem);
    const [search, setSearch] = useState("");
    const [filterDifficulty, setFilterDifficulty] = useState("All");
    const [selectedTags, setSelectedTags] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        const fetchProblems = async () => {
            try {
                dispatch(setProblemLoading());
                const response = await axiosClient.get('/problem/getAllProblem');
                // Backend returns: { message: "...", problem: [...] }
                dispatch(setProblems(response.data.problem || []));
            } catch (err) {
                dispatch(setProblemError(err.response?.data?.message || "Failed to fetch problems"));
            }
        };

        fetchProblems();
    }, [dispatch]);

    // Search and Filter Logic
    const filteredProblems = useMemo(() => {
        return problems.filter((prob) => {
            const matchesSearch = prob.title.toLowerCase().includes(search.toLowerCase());
            const matchesDifficulty = filterDifficulty === "All" || prob.difficulty === filterDifficulty;
            const matchesTags = selectedTags.length === 0 || selectedTags.some(tag => prob.tags?.some(t => t.toLowerCase() === tag.toLowerCase()));
            return matchesSearch && matchesDifficulty && matchesTags;
        });
    }, [problems, search, filterDifficulty, selectedTags]);

    // Pagination
    const totalPages = Math.ceil(filteredProblems.length / ITEMS_PER_PAGE);
    const paginatedProblems = filteredProblems.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    // Session Progress stats
    const sessionStats = useMemo(() => {
        const total = problems.length;
        const easy = problems.filter(p => p.difficulty === 'Easy').length;
        const medium = problems.filter(p => p.difficulty === 'Medium').length;
        const hard = problems.filter(p => p.difficulty === 'Hard').length;
        return { total, easy, medium, hard };
    }, [problems]);

    const toggleTag = (tag) => {
        setSelectedTags(prev =>
            prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
        );
        setCurrentPage(1);
    };

    const handleDifficultyFilter = (diff) => {
        setFilterDifficulty(prev => prev === diff ? "All" : diff);
        setCurrentPage(1);
    };

    // ─── Shared Styles ───
    const sidebarCard = {
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

    const thStyle = {
        ...labelStyle,
        padding: '14px 16px',
        textAlign: 'left',
        borderBottom: '1px solid rgba(84, 68, 52, 0.2)',
        background: 'transparent',
        position: 'sticky',
        top: 0,
    };

    return (
        <div className="noise-bg" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <main style={{
                flex: 1,
                marginTop: '56px',
                padding: '24px 16px',
                maxWidth: '1400px',
                width: '100%',
                margin: '56px auto 0',
            }}>
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: '240px 1fr 280px',
                    gap: '20px',
                    alignItems: 'start',
                }}>
                    {/* ════════════════════ LEFT SIDEBAR — Filter ════════════════════ */}
                    <aside style={sidebarCard}>
                        <h2 style={{
                            fontFamily: "'Geist', sans-serif",
                            fontSize: '20px',
                            lineHeight: '28px',
                            fontWeight: 600,
                            color: 'var(--on-surface)',
                            marginBottom: '24px',
                        }}>
                            Filter Problems
                        </h2>


                        {/* Difficulty */}
                        <div style={{ marginBottom: '24px' }}>
                            <p style={{ ...labelStyle, marginBottom: '12px' }}>Difficulty</p>
                            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                                {[
                                    { label: 'Easy', color: '#4cce73' },
                                    { label: 'Medium', color: '#ffa116' },
                                    { label: 'Hard', color: '#ffb4ab' },
                                ].map(({ label, color }) => {
                                    const isActive = filterDifficulty === label;
                                    return (
                                        <button
                                            key={label}
                                            onClick={() => handleDifficultyFilter(label)}
                                            style={{
                                                fontFamily: "'JetBrains Mono', monospace",
                                                fontSize: '12px',
                                                letterSpacing: '0.05em',
                                                fontWeight: 500,
                                                textTransform: 'uppercase',
                                                padding: '6px 14px',
                                                borderRadius: '6px',
                                                border: `1px solid ${isActive ? color : 'rgba(84, 68, 52, 0.3)'}`,
                                                background: isActive ? `${color}15` : 'transparent',
                                                color: isActive ? color : 'var(--on-surface-variant)',
                                                cursor: 'pointer',
                                                transition: 'all 0.2s',
                                            }}
                                        >
                                            {label}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Tags */}
                        <div>
                            <p style={{ ...labelStyle, marginBottom: '12px' }}>Tags</p>
                            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                                {ALL_TAGS.map((tag) => {
                                    const isActive = selectedTags.includes(tag);
                                    return (
                                        <button
                                            key={tag}
                                            onClick={() => toggleTag(tag)}
                                            style={{
                                                fontFamily: "'JetBrains Mono', monospace",
                                                fontSize: '12px',
                                                fontWeight: 500,
                                                padding: '6px 12px',
                                                borderRadius: '6px',
                                                border: isActive
                                                    ? '1px solid var(--primary-container)'
                                                    : '1px solid rgba(84, 68, 52, 0.3)',
                                                background: isActive
                                                    ? 'rgba(255, 161, 22, 0.1)'
                                                    : 'var(--surface-container-high)',
                                                color: isActive ? 'var(--primary)' : 'var(--on-surface-variant)',
                                                cursor: 'pointer',
                                                transition: 'all 0.15s',
                                            }}
                                            onMouseEnter={(e) => {
                                                if (!isActive) {
                                                    e.currentTarget.style.borderColor = 'var(--primary-container)';
                                                    e.currentTarget.style.color = 'var(--primary)';
                                                }
                                            }}
                                            onMouseLeave={(e) => {
                                                if (!isActive) {
                                                    e.currentTarget.style.borderColor = 'rgba(84, 68, 52, 0.3)';
                                                    e.currentTarget.style.color = 'var(--on-surface-variant)';
                                                }
                                            }}
                                        >
                                            {tag}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    </aside>

                    {/* ════════════════════ CENTER — Problem Table ════════════════════ */}
                    <div style={{
                        background: 'var(--surface-container-low)',
                        border: '1px solid rgba(84, 68, 52, 0.2)',
                        borderRadius: '12px',
                        overflow: 'hidden',
                        display: 'flex',
                        flexDirection: 'column',
                        minHeight: '600px',
                    }}>
                        {loading ? (
                            <div style={{
                                flex: 1,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                padding: '80px 0',
                            }}>
                                <div className="dm-spinner" style={{
                                    width: '32px', height: '32px',
                                    borderWidth: '3px',
                                    borderColor: 'var(--primary)',
                                    borderTopColor: 'transparent',
                                }} />
                            </div>
                        ) : error ? (
                            <div className="dm-error" style={{ margin: '24px' }}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <span>{error}</span>
                            </div>
                        ) : (
                            <>
                                {/* Table */}
                                <div style={{ flex: 1, overflowX: 'auto' }}>
                                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                        <thead>
                                            <tr>
                                                <th style={{ ...thStyle, width: '48px', textAlign: 'center' }}>
                                                    {/* Status icon column */}
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--outline)', display: 'inline' }}>
                                                        <circle cx="12" cy="12" r="10" />
                                                    </svg>
                                                </th>
                                                <th style={thStyle}>Title</th>
                                                <th style={{ ...thStyle, width: '120px', textAlign: 'center' }}>Acceptance</th>
                                                <th style={{ ...thStyle, width: '120px', textAlign: 'center' }}>Difficulty</th>
                                                <th style={{ ...thStyle, width: '100px', textAlign: 'center' }}>Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {paginatedProblems.length > 0 ? (
                                                paginatedProblems.map((prob, index) => {
                                                    const globalIndex = (currentPage - 1) * ITEMS_PER_PAGE + index + 1;
                                                    // Simulate acceptance rate
                                                    const acceptance = (30 + Math.random() * 40).toFixed(1);
                                                    return (
                                                        <tr
                                                            key={prob._id}
                                                            style={{
                                                                borderBottom: '1px solid rgba(84, 68, 52, 0.1)',
                                                                transition: 'background 0.15s',
                                                                cursor: 'pointer',
                                                            }}
                                                            onMouseEnter={(e) => e.currentTarget.style.background = 'var(--surface-container)'}
                                                            onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                                                        >
                                                            {/* Status */}
                                                            <td style={{ padding: '14px 16px', textAlign: 'center' }}>
                                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--outline-variant)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.4 }}>
                                                                    <circle cx="12" cy="12" r="10" />
                                                                </svg>
                                                            </td>
                                                            {/* Title */}
                                                            <td style={{ padding: '14px 16px' }}>
                                                                <Link
                                                                    to={`/problem/${prob._id}`}
                                                                    style={{
                                                                        fontFamily: "'Inter', sans-serif",
                                                                        fontSize: '14px',
                                                                        fontWeight: 400,
                                                                        color: 'var(--on-surface)',
                                                                        textDecoration: 'none',
                                                                        transition: 'color 0.2s',
                                                                    }}
                                                                    onMouseEnter={(e) => e.target.style.color = 'var(--primary)'}
                                                                    onMouseLeave={(e) => e.target.style.color = 'var(--on-surface)'}
                                                                >
                                                                    {globalIndex}. {prob.title}
                                                                </Link>
                                                            </td>
                                                            {/* Acceptance */}
                                                            <td style={{
                                                                padding: '14px 16px',
                                                                textAlign: 'center',
                                                                fontFamily: "'JetBrains Mono', monospace",
                                                                fontSize: '13px',
                                                                color: 'var(--on-surface-variant)',
                                                            }}>
                                                                {acceptance}%
                                                            </td>
                                                            {/* Difficulty */}
                                                            <td style={{ padding: '14px 16px', textAlign: 'center' }}>
                                                                <DifficultyBadge level={prob.difficulty} />
                                                            </td>
                                                            {/* Action */}
                                                            <td style={{ padding: '14px 16px', textAlign: 'center' }}>
                                                                <Link
                                                                    to={`/problem/${prob._id}`}
                                                                    style={{
                                                                        fontFamily: "'JetBrains Mono', monospace",
                                                                        fontSize: '12px',
                                                                        letterSpacing: '0.05em',
                                                                        fontWeight: 500,
                                                                        color: 'var(--primary)',
                                                                        textDecoration: 'none',
                                                                        transition: 'color 0.2s',
                                                                    }}
                                                                    onMouseEnter={(e) => e.target.style.color = 'var(--primary-fixed-dim)'}
                                                                    onMouseLeave={(e) => e.target.style.color = 'var(--primary)'}
                                                                >
                                                                    Solve →
                                                                </Link>
                                                            </td>
                                                        </tr>
                                                    );
                                                })
                                            ) : (
                                                <tr>
                                                    <td colSpan="5" style={{
                                                        padding: '48px 16px',
                                                        textAlign: 'center',
                                                        fontFamily: "'Inter', sans-serif",
                                                        fontSize: '14px',
                                                        color: 'var(--on-surface-variant)',
                                                    }}>
                                                        No problems found matching your criteria.
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>

                                {/* Pagination */}
                                {filteredProblems.length > 0 && (
                                    <div style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        padding: '14px 16px',
                                        borderTop: '1px solid rgba(84, 68, 52, 0.2)',
                                    }}>
                                        <span style={{
                                            ...labelStyle,
                                            textTransform: 'none',
                                            letterSpacing: 'normal',
                                            fontFamily: "'JetBrains Mono', monospace",
                                            fontSize: '13px',
                                        }}>
                                            Showing {((currentPage - 1) * ITEMS_PER_PAGE) + 1} to {Math.min(currentPage * ITEMS_PER_PAGE, filteredProblems.length)} of {filteredProblems.length.toLocaleString()}
                                        </span>
                                        <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                                            {/* Prev */}
                                            <button
                                                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                                disabled={currentPage === 1}
                                                style={{
                                                    width: '32px', height: '32px',
                                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                    borderRadius: '6px',
                                                    border: '1px solid rgba(84, 68, 52, 0.3)',
                                                    background: 'transparent',
                                                    color: currentPage === 1 ? 'var(--outline-variant)' : 'var(--on-surface-variant)',
                                                    cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                                                    fontFamily: "'Inter', sans-serif",
                                                    fontSize: '14px',
                                                    transition: 'all 0.15s',
                                                }}
                                            >
                                                ‹
                                            </button>
                                            {/* Page Numbers */}
                                            {Array.from({ length: Math.min(totalPages, 3) }, (_, i) => i + 1).map(page => (
                                                <button
                                                    key={page}
                                                    onClick={() => setCurrentPage(page)}
                                                    style={{
                                                        width: '32px', height: '32px',
                                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                        borderRadius: '6px',
                                                        border: page === currentPage
                                                            ? '1px solid var(--primary-container)'
                                                            : '1px solid rgba(84, 68, 52, 0.3)',
                                                        background: page === currentPage
                                                            ? 'var(--primary-container)'
                                                            : 'transparent',
                                                        color: page === currentPage
                                                            ? 'var(--on-primary-container)'
                                                            : 'var(--on-surface-variant)',
                                                        cursor: 'pointer',
                                                        fontFamily: "'JetBrains Mono', monospace",
                                                        fontSize: '13px',
                                                        fontWeight: 500,
                                                        transition: 'all 0.15s',
                                                    }}
                                                >
                                                    {page}
                                                </button>
                                            ))}
                                            {totalPages > 3 && (
                                                <span style={{
                                                    width: '32px', height: '32px',
                                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                    color: 'var(--on-surface-variant)',
                                                    fontFamily: "'JetBrains Mono', monospace",
                                                    fontSize: '13px',
                                                }}>
                                                    ...
                                                </span>
                                            )}
                                            {/* Next */}
                                            <button
                                                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                                disabled={currentPage === totalPages || totalPages === 0}
                                                style={{
                                                    width: '32px', height: '32px',
                                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                    borderRadius: '6px',
                                                    border: '1px solid rgba(84, 68, 52, 0.3)',
                                                    background: 'transparent',
                                                    color: currentPage === totalPages ? 'var(--outline-variant)' : 'var(--on-surface-variant)',
                                                    cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
                                                    fontFamily: "'Inter', sans-serif",
                                                    fontSize: '14px',
                                                    transition: 'all 0.15s',
                                                }}
                                            >
                                                ›
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </>
                        )}
                    </div>

                    {/* ════════════════════ RIGHT SIDEBAR — Session Progress ════════════════════ */}
                    <aside>
                        <div style={sidebarCard}>
                            <h3 style={{
                                fontFamily: "'Geist', sans-serif",
                                fontSize: '20px',
                                lineHeight: '28px',
                                fontWeight: 600,
                                color: 'var(--on-surface)',
                                marginBottom: '20px',
                            }}>
                                Session Progress
                            </h3>

                            {/* Total Solved */}
                            <div style={{ marginBottom: '20px' }}>
                                <div style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    marginBottom: '8px',
                                }}>
                                    <span style={{
                                        fontFamily: "'Inter', sans-serif",
                                        fontSize: '14px',
                                        color: 'var(--on-surface)',
                                    }}>
                                        Total Solved
                                    </span>
                                    <span style={{
                                        fontFamily: "'JetBrains Mono', monospace",
                                        fontSize: '14px',
                                        fontWeight: 500,
                                        color: 'var(--primary)',
                                    }}>
                                        0 / {sessionStats.total}
                                    </span>
                                </div>
                                <div style={{
                                    width: '100%',
                                    height: '6px',
                                    borderRadius: '3px',
                                    background: 'var(--surface-container-highest)',
                                    overflow: 'hidden',
                                }}>
                                    <div style={{
                                        width: '0%',
                                        height: '100%',
                                        borderRadius: '3px',
                                        background: 'var(--primary-container)',
                                        transition: 'width 0.5s ease',
                                    }} />
                                </div>
                            </div>

                            {/* Difficulty Breakdown */}
                            {[
                                { label: 'EASY', count: sessionStats.easy, color: '#4cce73' },
                                { label: 'MEDIUM', count: sessionStats.medium, color: '#ffa116' },
                                { label: 'HARD', count: sessionStats.hard, color: '#ffb4ab' },
                            ].map(({ label, count, color }) => (
                                <div key={label} style={{ marginBottom: '16px' }}>
                                    <div style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        marginBottom: '6px',
                                    }}>
                                        <span style={{
                                            ...labelStyle,
                                            color: color,
                                        }}>
                                            {label}
                                        </span>
                                        <span style={{
                                            fontFamily: "'JetBrains Mono', monospace",
                                            fontSize: '13px',
                                            fontWeight: 500,
                                            color: 'var(--on-surface-variant)',
                                        }}>
                                            0 / {count}
                                        </span>
                                    </div>
                                    <div style={{
                                        width: '100%',
                                        height: '4px',
                                        borderRadius: '2px',
                                        background: 'var(--surface-container-highest)',
                                        overflow: 'hidden',
                                    }}>
                                        <div style={{
                                            width: '0%',
                                            height: '100%',
                                            borderRadius: '2px',
                                            background: color,
                                            transition: 'width 0.5s ease',
                                        }} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </aside>
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

            {/* ─── Responsive CSS ─── */}
            <style>{`
                @media (max-width: 1024px) {
                    main > div {
                        grid-template-columns: 1fr !important;
                    }
                }
                @media (min-width: 1025px) and (max-width: 1280px) {
                    main > div {
                        grid-template-columns: 220px 1fr !important;
                    }
                    main > div > aside:last-child {
                        display: none !important;
                    }
                }
            `}</style>
        </div>
    );
};

export default ProblemsPage;
