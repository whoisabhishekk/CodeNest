import React from 'react';
import { Link } from 'react-router';
import { useSelector } from 'react-redux';

const Homepage = () => {
    const { user } = useSelector((state) => state.auth);

    return (
        <div className="noise-bg" style={{ height: '100vh', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            {/* Main Content Wrapper for Centering */}
            <div style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                paddingTop: '56px',
            }}>
                {/* ════════════════════ HERO SECTION ════════════════════ */}
                <section style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    padding: '0 24px',
                    position: 'relative',
                    marginBottom: '48px',
                }}>
                {/* Ambient glow */}
                <div className="ambient-glow" />

                {/* Faint code background overlay */}
                <div style={{
                    position: 'absolute',
                    inset: 0,
                    opacity: 0.04,
                    pointerEvents: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    overflow: 'hidden',
                }}>
                    <pre style={{
                        fontFamily: "'JetBrains Mono', monospace",
                        fontSize: '14px',
                        lineHeight: '22px',
                        color: 'var(--on-surface)',
                        whiteSpace: 'pre',
                        transform: 'rotate(-3deg) scale(1.3)',
                    }}>{`function twoSum(nums, target) {
    const map = new Map();
    for (let i = 0; i < nums.length; i++) {
        const complement = target - nums[i];
        if (map.has(complement)) {
            return [map.get(complement), i];
        }
        map.set(nums[i], i);
    }
    return [];
}

class TreeNode {
    constructor(val, left, right) {
        this.val = val;
        this.left = left || null;
        this.right = right || null;
    }
}

function maxDepth(root) {
    if (!root) return 0;
    return 1 + Math.max(
        maxDepth(root.left),
        maxDepth(root.right)
    );
}

function mergeSort(arr) {
    if (arr.length <= 1) return arr;
    const mid = Math.floor(arr.length / 2);
    const left = mergeSort(arr.slice(0, mid));
    const right = mergeSort(arr.slice(mid));
    return merge(left, right);
}`}</pre>
                </div>

                {/* Content */}
                <div style={{
                    position: 'relative',
                    zIndex: 1,
                    textAlign: 'center',
                    maxWidth: '720px',
                }}>
                    {/* Badge */}
                    <div style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '8px 20px',
                        borderRadius: '999px',
                        background: 'var(--surface-container-high)',
                        border: '1px solid rgba(84, 68, 52, 0.3)',
                        marginBottom: '32px',
                    }}>
                        <span style={{ fontSize: '14px' }}>🚀</span>
                        <span style={{
                            fontFamily: "'Inter', sans-serif",
                            fontSize: '14px',
                            fontWeight: 500,
                            color: 'var(--on-surface)',
                        }}>
                            The Ultimate Coding Platform
                        </span>
                    </div>

                    {/* Heading */}
                    <h1 style={{
                        fontFamily: "'Geist', sans-serif",
                        fontSize: 'clamp(36px, 6vw, 56px)',
                        lineHeight: 1.1,
                        fontWeight: 700,
                        letterSpacing: '-0.02em',
                        color: 'var(--on-surface)',
                        marginBottom: '24px',
                    }}>
                        Master Your<br />
                        <span style={{ color: 'var(--primary)' }}>
                            Coding Interview
                        </span>
                    </h1>

                    {/* Subtext */}
                    <p style={{
                        fontFamily: "'Inter', sans-serif",
                        fontSize: '16px',
                        lineHeight: '26px',
                        color: 'var(--on-surface-variant)',
                        maxWidth: '560px',
                        margin: '0 auto 40px',
                    }}>
                        Practice Data Structures and Algorithms with our curated list of problems. Write code, test against edge cases, and compete with others.
                    </p>

                    {/* CTA */}
                    <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
                        <Link
                            to="/problems"
                            className="dm-btn-primary"
                            style={{
                                width: 'auto',
                                padding: '14px 36px',
                                fontSize: '14px',
                                fontFamily: "'JetBrains Mono', monospace",
                                letterSpacing: '0.05em',
                                fontWeight: 500,
                                textTransform: 'uppercase',
                                textDecoration: 'none',
                                display: 'inline-flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}
                        >
                            Explore Problems
                        </Link>
                    </div>
                </div>
            </section>

            {/* ════════════════════ FEATURE CARDS ════════════════════ */}
            <section style={{
                padding: '0 24px',
                maxWidth: '1100px',
                width: '100%',
                margin: '0 auto',
            }}>
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                    gap: '20px',
                }}>
                    {[
                        {
                            icon: (
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                                    <polyline points="14 2 14 8 20 8" />
                                    <line x1="16" y1="13" x2="8" y2="13" />
                                    <line x1="16" y1="17" x2="8" y2="17" />
                                    <polyline points="10 9 9 9 8 9" />
                                </svg>
                            ),
                            title: 'Curated Problems',
                            desc: 'From Easy to Hard, we have everything you need to prepare.',
                            color: '#4cce73',
                        },
                        {
                            icon: (
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <polyline points="16 18 22 12 16 6" />
                                    <polyline points="8 6 2 12 8 18" />
                                </svg>
                            ),
                            title: 'In-Browser IDE',
                            desc: 'Write and test your code directly in the browser. No setup required.',
                            color: '#4b8eff',
                        },
                        {
                            icon: (
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                                </svg>
                            ),
                            title: 'Fast Execution',
                            desc: 'Get instant feedback on your code with our fast evaluation engine.',
                            color: '#ffa116',
                        },
                    ].map((feature) => (
                        <div
                            key={feature.title}
                            className="glass-card"
                            style={{
                                padding: '32px 24px',
                                textAlign: 'center',
                                transition: 'transform 0.25s ease, box-shadow 0.25s ease',
                                cursor: 'default',
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform = 'translateY(-4px)';
                                e.currentTarget.style.boxShadow = '0 30px 60px -12px rgba(0,0,0,0.6)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = 'translateY(0)';
                                e.currentTarget.style.boxShadow = '';
                            }}
                        >
                            {/* Icon */}
                            <div style={{
                                width: '48px',
                                height: '48px',
                                borderRadius: '12px',
                                background: `${feature.color}15`,
                                border: `1px solid ${feature.color}30`,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                margin: '0 auto 20px',
                                color: feature.color,
                            }}>
                                {feature.icon}
                            </div>
                            {/* Title */}
                            <h3 style={{
                                fontFamily: "'Geist', sans-serif",
                                fontSize: '18px',
                                fontWeight: 600,
                                color: 'var(--on-surface)',
                                marginBottom: '10px',
                            }}>
                                {feature.title}
                            </h3>
                            {/* Description */}
                            <p style={{
                                fontFamily: "'Inter', sans-serif",
                                fontSize: '14px',
                                lineHeight: '22px',
                                color: 'var(--on-surface-variant)',
                            }}>
                                {feature.desc}
                            </p>
                        </div>
                    ))}
                </div>
            </section>
            </div>

            {/* ════════════════════ FOOTER ════════════════════ */}
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
    );
};

export default Homepage;