import React, { useState } from 'react';
import { Link } from 'react-router';

const PremiumPage = () => {
    const [billingCycle, setBillingCycle] = useState('monthly'); // 'monthly' | 'yearly'
    const [showModal, setShowModal] = useState(false);
    const [selectedTier, setSelectedTier] = useState(null);

    const handlePurchaseClick = (tierName) => {
        setSelectedTier(tierName);
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setSelectedTier(null);
    };

    const tiers = [
        {
            id: 'free',
            name: 'Starter',
            badge: 'Free Plan',
            badgeStyle: { background: 'rgba(255, 255, 255, 0.08)', color: 'var(--on-surface-variant)' },
            monthlyPrice: '0',
            yearlyPrice: '0',
            period: 'forever',
            description: 'Essential features for coding practice and problem solving.',
            buttonText: 'Current Plan',
            buttonDisabled: true,
            isPopular: false,
            features: [
                'Access to 50+ standard problems',
                'Basic Online Code Editor',
                'Community Discussion Forums',
                'Standard Execution Speed',
                'Basic Test Case Submissions'
            ],
            notIncluded: [
                'AI Hints & Debug Assistant',
                'Company-wise Problem Tags',
                'Detailed Time/Space Analytics',
                'Mock Interview Sessions'
            ]
        },
        {
            id: 'pro',
            name: 'Pro Member',
            badge: '⚡ MOST POPULAR',
            badgeStyle: { background: 'linear-gradient(135deg, #ffa116, #ffb867)', color: '#482900', fontWeight: 'bold' },
            monthlyPrice: '499',
            yearlyPrice: '4,790',
            period: billingCycle === 'monthly' ? '/ month' : '/ year',
            savings: billingCycle === 'yearly' ? 'Save ₹1,198/yr' : null,
            description: 'Supercharge your interview prep with AI assistance & premium problems.',
            buttonText: 'Upgrade to Pro',
            buttonDisabled: false,
            isPopular: true,
            features: [
                'Access to ALL 250+ Premium Problems',
                'Unlimited Code Executions',
                'AI Code Assistant & Instant Debugging',
                'Detailed Time & Space Complexity Breakdown',
                'Company-specific Interview Tags (Google, Amazon, Meta)',
                'Priority Code Runner Queue',
                'Video Solutions & Editorial Insights'
            ],
            notIncluded: [
                '1-on-1 Mock Interview Sessions',
                'Live Collaborative Code Nesting'
            ]
        },
        {
            id: 'ultimate',
            name: 'Ultimate Nest',
            badge: '💎 BEST VALUE',
            badgeStyle: { background: 'linear-gradient(135deg, #4b8eff, #adc6ff)', color: '#002e69', fontWeight: 'bold' },
            monthlyPrice: '999',
            yearlyPrice: '9,590',
            period: billingCycle === 'monthly' ? '/ month' : '/ year',
            savings: billingCycle === 'yearly' ? 'Save ₹2,398/yr' : null,
            description: 'Complete career acceleration package with mock interviews & 1-on-1 mentorship.',
            buttonText: 'Get Ultimate',
            buttonDisabled: false,
            isPopular: false,
            features: [
                'Everything included in Pro Tier',
                '2 Monthly 1-on-1 Live Mock Interviews',
                'Real-time Collaborative Pair Programming',
                'Customized Learning Roadmap',
                'Direct Access to Senior Mentor Community',
                'System Design & Architecture Masterclass',
                '24/7 Dedicated Priority Support'
            ],
            notIncluded: []
        }
    ];

    const faqs = [
        {
            q: 'Can I cancel or switch plans anytime?',
            a: 'Yes, you can upgrade, downgrade, or cancel your subscription at any time directly from your profile settings with no cancellation fees.'
        },
        {
            q: 'What payment methods are supported in India?',
            a: 'We support all major Indian payment options including UPI (GPay, PhonePe, Paytm), Credit/Debit Cards, Net Banking, and Wallet payments.'
        },
        {
            q: 'How does the AI Assistant work during problem solving?',
            a: 'Our built-in AI guide gives targeted hints, explains failing edge cases, and optimizes your solution without spoiling the final answer directly.'
        },
        {
            q: 'Do you offer student discounts?',
            a: 'Yes! Students with a valid .edu or university ID are eligible for an additional 20% discount on annual subscriptions.'
        }
    ];

    return (
        <div className="noise-bg" style={{ minHeight: '100vh', paddingTop: '80px', paddingBottom: '80px', color: 'var(--on-surface)' }}>
            <div className="ambient-glow" />

            <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px', position: 'relative', zIndex: 1 }}>
                
                {/* ─── Hero Section ─── */}
                <div style={{ textAlign: 'center', marginBottom: '56px' }}>
                    <div style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '6px 16px',
                        borderRadius: '20px',
                        background: 'rgba(255, 161, 22, 0.1)',
                        border: '1px solid rgba(255, 161, 22, 0.25)',
                        color: 'var(--primary)',
                        fontSize: '13px',
                        fontFamily: "'JetBrains Mono', monospace",
                        fontWeight: 600,
                        marginBottom: '20px'
                    }}>
                        <span>✨ CODE NEST PREMIUM</span>
                    </div>

                    <h1 style={{
                        fontFamily: "'Geist', sans-serif",
                        fontSize: 'clamp(32px, 5vw, 48px)',
                        fontWeight: 700,
                        lineHeight: 1.2,
                        marginBottom: '16px',
                        background: 'linear-gradient(180deg, #ffffff 0%, #d9c3ad 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        letterSpacing: '-0.02em'
                    }}>
                        Level Up Your Coding Career
                    </h1>

                    <p style={{
                        fontFamily: "'Inter', sans-serif",
                        fontSize: '16px',
                        color: 'var(--on-surface-variant)',
                        maxWidth: '640px',
                        margin: '0 auto 36px',
                        lineHeight: 1.6
                    }}>
                        Unlock premium problem sets, AI-powered debugging assistance, company interview tags, and live mentorship designed to crack top tech roles.
                    </p>

                    {/* ─── Billing Toggle ─── */}
                    <div style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        background: 'var(--surface-container-low)',
                        padding: '4px',
                        borderRadius: '12px',
                        border: '1px solid rgba(84, 68, 52, 0.3)'
                    }}>
                        <button
                            onClick={() => setBillingCycle('monthly')}
                            style={{
                                padding: '8px 20px',
                                borderRadius: '8px',
                                border: 'none',
                                background: billingCycle === 'monthly' ? 'var(--surface-container-highest)' : 'transparent',
                                color: billingCycle === 'monthly' ? 'var(--primary)' : 'var(--on-surface-variant)',
                                fontFamily: "'Inter', sans-serif",
                                fontWeight: 600,
                                fontSize: '14px',
                                cursor: 'pointer',
                                transition: 'all 0.2s ease'
                            }}
                        >
                            Monthly Billing
                        </button>
                        <button
                            onClick={() => setBillingCycle('yearly')}
                            style={{
                                padding: '8px 20px',
                                borderRadius: '8px',
                                border: 'none',
                                background: billingCycle === 'yearly' ? 'var(--surface-container-highest)' : 'transparent',
                                color: billingCycle === 'yearly' ? 'var(--primary)' : 'var(--on-surface-variant)',
                                fontFamily: "'Inter', sans-serif",
                                fontWeight: 600,
                                fontSize: '14px',
                                cursor: 'pointer',
                                transition: 'all 0.2s ease',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px'
                            }}
                        >
                            Annual Billing
                            <span style={{
                                background: 'rgba(106, 235, 140, 0.15)',
                                color: 'var(--tertiary)',
                                fontSize: '11px',
                                padding: '2px 8px',
                                borderRadius: '10px',
                                fontFamily: "'JetBrains Mono', monospace",
                                fontWeight: 600
                            }}>
                                SAVE 20%
                            </span>
                        </button>
                    </div>
                </div>

                {/* ─── Pricing Tiers Grid ─── */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
                    gap: '24px',
                    alignItems: 'stretch',
                    marginBottom: '80px'
                }}>
                    {tiers.map((tier) => (
                        <div
                            key={tier.id}
                            className="glass-card"
                            style={{
                                padding: '32px 28px',
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'space-between',
                                position: 'relative',
                                border: tier.isPopular 
                                    ? '1.5px solid var(--primary-container)' 
                                    : '1px solid rgba(84, 68, 52, 0.2)',
                                boxShadow: tier.isPopular 
                                    ? '0 20px 40px -10px rgba(255, 161, 22, 0.15)' 
                                    : '0 20px 40px -10px rgba(0, 0, 0, 0.4)',
                                background: tier.isPopular 
                                    ? 'linear-gradient(180deg, rgba(32, 32, 31, 0.95) 0%, rgba(20, 20, 20, 0.98) 100%)' 
                                    : 'var(--surface-container-low)',
                                borderRadius: '16px'
                            }}
                        >
                            {/* Popular Highlight Badge */}
                            <div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                                    <span style={{
                                        fontFamily: "'Geist', sans-serif",
                                        fontSize: '22px',
                                        fontWeight: 700,
                                        color: 'var(--on-surface)'
                                    }}>
                                        {tier.name}
                                    </span>
                                    <span style={{
                                        fontFamily: "'JetBrains Mono', monospace",
                                        fontSize: '11px',
                                        padding: '4px 10px',
                                        borderRadius: '12px',
                                        ...tier.badgeStyle
                                    }}>
                                        {tier.badge}
                                    </span>
                                </div>

                                <p style={{
                                    fontFamily: "'Inter', sans-serif",
                                    fontSize: '14px',
                                    color: 'var(--on-surface-variant)',
                                    marginBottom: '24px',
                                    minHeight: '40px',
                                    lineHeight: 1.4
                                }}>
                                    {tier.description}
                                </p>

                                {/* Price Display */}
                                <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', marginBottom: '8px' }}>
                                    <span style={{ fontFamily: "'Geist', sans-serif", fontSize: '38px', fontWeight: 700, color: 'var(--on-surface)' }}>
                                        ₹{billingCycle === 'monthly' ? tier.monthlyPrice : tier.yearlyPrice}
                                    </span>
                                    <span style={{ fontFamily: "'Inter', sans-serif", fontSize: '14px', color: 'var(--on-surface-variant)' }}>
                                        {tier.period}
                                    </span>
                                </div>

                                {tier.savings && (
                                    <div style={{
                                        fontFamily: "'JetBrains Mono', monospace",
                                        fontSize: '12px',
                                        color: 'var(--tertiary)',
                                        marginBottom: '24px'
                                    }}>
                                        {tier.savings}
                                    </div>
                                )}
                                {!tier.savings && <div style={{ height: '24px', marginBottom: '8px' }} />}

                                <div style={{ height: '1px', background: 'rgba(84, 68, 52, 0.2)', margin: '16px 0 24px' }} />

                                {/* Features List */}
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '32px' }}>
                                    {tier.features.map((feat, idx) => (
                                        <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '14px' }}>
                                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--tertiary)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginTop: '2px', flexShrink: 0 }}>
                                                <polyline points="20 6 9 17 4 12"></polyline>
                                            </svg>
                                            <span style={{ color: 'var(--on-surface)', lineHeight: 1.4 }}>{feat}</span>
                                        </div>
                                    ))}

                                    {tier.notIncluded.map((feat, idx) => (
                                        <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '14px', opacity: 0.45 }}>
                                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--outline)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginTop: '2px', flexShrink: 0 }}>
                                                <line x1="18" y1="6" x2="6" y2="18"></line>
                                                <line x1="6" y1="6" x2="18" y2="18"></line>
                                            </svg>
                                            <span style={{ color: 'var(--on-surface-variant)', lineHeight: 1.4 }}>{feat}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Purchase Button */}
                            <button
                                onClick={() => handlePurchaseClick(tier.name)}
                                disabled={tier.buttonDisabled}
                                style={{
                                    width: '100%',
                                    padding: '14px 20px',
                                    borderRadius: '10px',
                                    border: tier.isPopular ? 'none' : '1px solid rgba(84, 68, 52, 0.4)',
                                    background: tier.isPopular
                                        ? 'linear-gradient(135deg, var(--primary-container), var(--primary-fixed-dim))'
                                        : (tier.buttonDisabled ? 'rgba(255,255,255,0.05)' : 'var(--surface-container-highest)'),
                                    color: tier.isPopular ? 'var(--on-primary)' : (tier.buttonDisabled ? 'rgba(255,255,255,0.4)' : 'var(--on-surface)'),
                                    fontFamily: "'Geist', sans-serif",
                                    fontWeight: 700,
                                    fontSize: '15px',
                                    cursor: tier.buttonDisabled ? 'default' : 'pointer',
                                    transition: 'all 0.2s ease',
                                    boxShadow: tier.isPopular ? '0 4px 14px rgba(255, 161, 22, 0.25)' : 'none'
                                }}
                                onMouseEnter={(e) => {
                                    if (!tier.buttonDisabled) {
                                        e.currentTarget.style.transform = 'translateY(-2px)';
                                        if (!tier.isPopular) {
                                            e.currentTarget.style.borderColor = 'var(--primary)';
                                            e.currentTarget.style.color = 'var(--primary)';
                                        }
                                    }
                                }}
                                onMouseLeave={(e) => {
                                    if (!tier.buttonDisabled) {
                                        e.currentTarget.style.transform = 'translateY(0)';
                                        if (!tier.isPopular) {
                                            e.currentTarget.style.borderColor = 'rgba(84, 68, 52, 0.4)';
                                            e.currentTarget.style.color = 'var(--on-surface)';
                                        }
                                    }
                                }}
                            >
                                {tier.buttonText}
                            </button>
                        </div>
                    ))}
                </div>

                {/* ─── FAQ Section ─── */}
                <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                    <h2 style={{
                        fontFamily: "'Geist', sans-serif",
                        fontSize: '28px',
                        fontWeight: 700,
                        textAlign: 'center',
                        marginBottom: '32px',
                        color: 'var(--on-surface)'
                    }}>
                        Frequently Asked Questions
                    </h2>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        {faqs.map((faq, index) => (
                            <div
                                key={index}
                                className="glass-card"
                                style={{ padding: '24px', borderRadius: '12px' }}
                            >
                                <h3 style={{
                                    fontFamily: "'Geist', sans-serif",
                                    fontSize: '16px',
                                    fontWeight: 600,
                                    color: 'var(--primary)',
                                    marginBottom: '8px'
                                }}>
                                    {faq.q}
                                </h3>
                                <p style={{
                                    fontFamily: "'Inter', sans-serif",
                                    fontSize: '14px',
                                    color: 'var(--on-surface-variant)',
                                    lineHeight: 1.6
                                }}>
                                    {faq.a}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>

            </div>

            {/* ─── Feature Coming Soon Popup Modal ─── */}
            {showModal && (
                <div
                    onClick={closeModal}
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
                            maxWidth: '440px',
                            width: '100%',
                            padding: '36px 32px',
                            borderRadius: '20px',
                            textAlign: 'center',
                            position: 'relative',
                            border: '1px solid rgba(255, 161, 22, 0.3)',
                            boxShadow: '0 25px 60px -10px rgba(0, 0, 0, 0.8), 0 0 30px rgba(255, 161, 22, 0.15)',
                            background: 'var(--surface-container-low)'
                        }}
                    >
                        {/* Glow Badge */}
                        <div style={{
                            width: '64px',
                            height: '64px',
                            borderRadius: '50%',
                            background: 'rgba(255, 161, 22, 0.12)',
                            border: '1px solid rgba(255, 161, 22, 0.3)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            margin: '0 auto 20px',
                            color: 'var(--primary)',
                            fontSize: '28px'
                        }}>
                            🚀
                        </div>

                        <h3 style={{
                            fontFamily: "'Geist', sans-serif",
                            fontSize: '22px',
                            fontWeight: 700,
                            color: 'var(--on-surface)',
                            marginBottom: '10px'
                        }}>
                            Feature Coming Soon!
                        </h3>

                        <p style={{
                            fontFamily: "'Inter', sans-serif",
                            fontSize: '14px',
                            color: 'var(--on-surface-variant)',
                            lineHeight: 1.6,
                            marginBottom: '24px'
                        }}>
                            Thank you for your interest in upgrading to <strong style={{ color: 'var(--primary)' }}>{selectedTier}</strong>. Payment gateway integration is currently in final testing and will be live shortly!
                        </p>

                        <div style={{
                            padding: '12px 16px',
                            borderRadius: '8px',
                            background: 'rgba(255, 255, 255, 0.04)',
                            border: '1px solid rgba(84, 68, 52, 0.2)',
                            fontSize: '12px',
                            fontFamily: "'JetBrains Mono', monospace",
                            color: 'var(--outline)',
                            marginBottom: '28px'
                        }}>
                            💡 Tip: All current practice problems remain 100% free to solve!
                        </div>

                        <button
                            onClick={closeModal}
                            style={{
                                width: '100%',
                                padding: '12px',
                                borderRadius: '10px',
                                border: 'none',
                                background: 'var(--primary-container)',
                                color: 'var(--on-primary-container)',
                                fontFamily: "'Geist', sans-serif",
                                fontWeight: 700,
                                fontSize: '15px',
                                cursor: 'pointer',
                                transition: 'all 0.2s ease'
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.background = 'var(--primary-fixed-dim)'}
                            onMouseLeave={(e) => e.currentTarget.style.background = 'var(--primary-container)'}
                        >
                            Got It!
                        </button>
                    </div>
                </div>
            )}

            <style>{`
                @keyframes fadeIn {
                    from { opacity: 0; transform: scale(0.95); }
                    to { opacity: 1; transform: scale(1); }
                }
            `}</style>
        </div>
    );
};

export default PremiumPage;
