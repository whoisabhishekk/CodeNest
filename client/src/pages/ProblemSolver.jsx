import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import Editor from '@monaco-editor/react';
import axiosClient from '../utils/axiosClient';
import sanitize from '../utils/sanitize';
import DifficultyBadge from '../components/DifficultyBadge';

// Custom Monaco theme definition
const defineDevMetricsTheme = (monaco) => {
    monaco.editor.defineTheme('devmetrics-dark', {
        base: 'vs-dark',
        inherit: true,
        rules: [
            { token: '', foreground: 'e5e2e1', background: '131313' },
            { token: 'comment', foreground: '6a6a6a', fontStyle: 'italic' },
            { token: 'keyword', foreground: 'ffa116' },
            { token: 'keyword.control', foreground: 'ffa116' },
            { token: 'storage', foreground: 'ffa116' },
            { token: 'storage.type', foreground: 'ffa116' },
            { token: 'type', foreground: 'ffb867' },
            { token: 'type.identifier', foreground: 'ffb867' },
            { token: 'string', foreground: '6aeb8c' },
            { token: 'string.escape', foreground: '4cce73' },
            { token: 'number', foreground: 'adc6ff' },
            { token: 'constant', foreground: 'adc6ff' },
            { token: 'variable', foreground: 'e5e2e1' },
            { token: 'variable.parameter', foreground: 'e5e2e1' },
            { token: 'function', foreground: 'ffc78b' },
            { token: 'identifier', foreground: 'e5e2e1' },
            { token: 'operator', foreground: 'd9c3ad' },
            { token: 'delimiter', foreground: 'd9c3ad' },
            { token: 'delimiter.bracket', foreground: 'd9c3ad' },
            { token: 'tag', foreground: 'ffa116' },
            { token: 'attribute.name', foreground: 'ffb867' },
            { token: 'attribute.value', foreground: '6aeb8c' },
            { token: 'metatag', foreground: 'ffa116' },
            { token: 'annotation', foreground: 'adc6ff' },
        ],
        colors: {
            'editor.background': '#131313',
            'editor.foreground': '#e5e2e1',
            'editor.lineHighlightBackground': '#1c1b1b',
            'editor.selectionBackground': '#544434',
            'editor.inactiveSelectionBackground': '#35353550',
            'editorLineNumber.foreground': '#544434',
            'editorLineNumber.activeForeground': '#a18d7a',
            'editorCursor.foreground': '#ffa116',
            'editorWhitespace.foreground': '#2a2a2a',
            'editorIndentGuide.background': '#2a2a2a',
            'editorIndentGuide.activeBackground': '#544434',
            'editor.selectionHighlightBackground': '#54443430',
            'editorBracketMatch.background': '#54443440',
            'editorBracketMatch.border': '#ffa11650',
            'scrollbar.shadow': '#00000000',
            'scrollbarSlider.background': '#54443440',
            'scrollbarSlider.hoverBackground': '#54443480',
            'scrollbarSlider.activeBackground': '#a18d7a60',
            'editorWidget.background': '#20201f',
            'editorWidget.border': '#544434',
            'editorSuggestWidget.background': '#20201f',
            'editorSuggestWidget.border': '#544434',
            'editorSuggestWidget.selectedBackground': '#353535',
            'editorHoverWidget.background': '#20201f',
            'editorHoverWidget.border': '#544434',
            'list.hoverBackground': '#2a2a2a',
            'list.activeSelectionBackground': '#353535',
            'focusBorder': '#ffa11650',
            'input.background': '#1c1b1b',
            'input.border': '#544434',
            'input.foreground': '#e5e2e1',
            'dropdown.background': '#20201f',
            'dropdown.border': '#544434',
        }
    });
};

const ProblemSolver = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    
    const [problem, setProblem] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    // Editor States
    const [language, setLanguage] = useState('c++');
    const [code, setCode] = useState('');
    const [isExecuting, setIsExecuting] = useState(false);
    const [runResults, setRunResults] = useState(null);
    const [submitResult, setSubmitResult] = useState(null);
    
    // UI States
    const [activeTab, setActiveTab] = useState('description');
    const [showConsole, setShowConsole] = useState(false);

    useEffect(() => {
        const fetchProblem = async () => {
            try {
                setLoading(true);
                const response = await axiosClient.get(`/problem/problemById/${id}`);
                const fetchedProblem = response.data.problem;
                setProblem(fetchedProblem);
                
                // Set initial code for default language (C++)
                const startCodeObj = fetchedProblem.startCode?.find(s => s.language === 'c++');
                if (startCodeObj) {
                    setCode(startCodeObj.initialCode);
                }
            } catch (err) {
                setError(err.response?.data?.message || "Failed to load problem");
            } finally {
                setLoading(false);
            }
        };
        fetchProblem();
    }, [id]);

    const handleLanguageChange = (newLang) => {
        setLanguage(newLang);
        const startCodeObj = problem.startCode?.find(s => s.language === newLang);
        if (startCodeObj) {
            setCode(startCodeObj.initialCode);
        } else {
            setCode('// Write your code here...');
        }
    };

    const handleRunCode = async () => {
        try {
            setIsExecuting(true);
            setSubmitResult(null);
            const response = await axiosClient.post(`/submission/run/${id}`, {
                code,
                language
            });
            setRunResults(response.data.results);
            setActiveTab('testcases');
        } catch (err) {
            alert(err.response?.data?.message || "Execution failed");
        } finally {
            setIsExecuting(false);
        }
    };

    const handleSubmitCode = async () => {
        try {
            setIsExecuting(true);
            setRunResults(null);
            const response = await axiosClient.post(`/submission/submit/${id}`, {
                code,
                language
            });
            setSubmitResult(response.data);
            setActiveTab('submissions');
        } catch (err) {
            setSubmitResult({
                status: 'wrong',
                message: err.response?.data?.message || "Submission failed"
            });
            setActiveTab('submissions');
        } finally {
            setIsExecuting(false);
        }
    };

    const langDisplayMap = {
        'c++': 'C++',
        'java': 'Java',
        'javascript': 'JavaScript',
    };

    // ─── Shared Styles ───
    const labelStyle = {
        fontFamily: "'JetBrains Mono', monospace",
        fontSize: '12px',
        lineHeight: '16px',
        letterSpacing: '0.05em',
        fontWeight: 500,
        textTransform: 'uppercase',
        color: 'var(--on-surface-variant)',
    };

    if (loading) return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'var(--surface-lowest)',
        }}>
            <div className="dm-spinner" style={{
                width: '32px', height: '32px',
                borderWidth: '3px',
                borderColor: 'var(--primary)',
                borderTopColor: 'transparent',
            }} />
        </div>
    );

    if (error) return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'var(--surface-lowest)',
            padding: '32px',
        }}>
            <div className="dm-error">{error}</div>
        </div>
    );

    if (!problem) return null;

    return (
        <div style={{
            display: 'flex',
            height: 'calc(100vh - 56px)',
            marginTop: '56px',
            background: 'var(--surface-lowest)',
            overflow: 'hidden',
        }}>
            {/* ════════════════════ LEFT PANEL — Problem Description ════════════════════ */}
            <div style={{
                width: '50%',
                display: 'flex',
                flexDirection: 'column',
                borderRight: '1px solid rgba(84, 68, 52, 0.2)',
                overflow: 'hidden',
            }}>
                {/* Problem Header */}
                <div style={{
                    padding: '16px 24px',
                    borderBottom: '1px solid rgba(84, 68, 52, 0.15)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    background: 'var(--surface-base)',
                    flexShrink: 0,
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <h1 style={{
                            fontFamily: "'Geist', sans-serif",
                            fontSize: '18px',
                            fontWeight: 600,
                            color: 'var(--on-surface)',
                        }}>
                            {problem.title}
                        </h1>
                        <DifficultyBadge level={problem.difficulty} />
                    </div>
                    <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>

                    </div>
                </div>

                {/* Tags */}
                <div style={{
                    padding: '10px 24px',
                    display: 'flex',
                    gap: '8px',
                    flexWrap: 'wrap',
                    borderBottom: '1px solid rgba(84, 68, 52, 0.1)',
                    background: 'var(--surface-base)',
                    flexShrink: 0,
                }}>
                    {problem.tags?.map((tag, i) => (
                        <span key={i} style={{
                            fontFamily: "'JetBrains Mono', monospace",
                            fontSize: '11px',
                            letterSpacing: '0.03em',
                            fontWeight: 500,
                            padding: '4px 12px',
                            borderRadius: '6px',
                            border: '1px solid rgba(84, 68, 52, 0.3)',
                            color: 'var(--on-surface-variant)',
                            background: 'transparent',
                        }}>
                            {tag}
                        </span>
                    ))}
                </div>

                {/* Left panel tabs (now below tags) */}
                <div style={{
                    display: 'flex',
                    borderBottom: '1px solid rgba(84, 68, 52, 0.2)',
                    background: 'var(--surface-container)',
                    flexShrink: 0,
                }}>
                    {[
                        { key: 'description', label: 'Description' },
                        { key: 'testcases', label: 'Test Cases' },
                        { key: 'submissions', label: 'Result' },
                    ].map((tab) => (
                        <button
                            key={tab.key}
                            onClick={() => setActiveTab(tab.key)}
                            style={{
                                flex: 1,
                                padding: '10px 16px',
                                background: 'transparent',
                                border: 'none',
                                borderBottom: activeTab === tab.key
                                    ? '2px solid var(--primary-container)'
                                    : '2px solid transparent',
                                fontFamily: "'JetBrains Mono', monospace",
                                fontSize: '12px',
                                letterSpacing: '0.03em',
                                fontWeight: 500,
                                color: activeTab === tab.key ? 'var(--primary)' : 'var(--on-surface-variant)',
                                cursor: 'pointer',
                                transition: 'all 0.15s',
                            }}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Scrollable Content */}
                <div style={{
                    flex: 1,
                    overflowY: 'auto',
                    padding: '24px',
                    background: 'var(--surface-base)',
                }}>
                    {activeTab === 'description' && (
                        <div style={{
                            fontFamily: "'Inter', sans-serif",
                            fontSize: '14px',
                            lineHeight: '24px',
                            color: 'var(--on-surface-variant)',
                        }}>
                            {/* Description text */}
                            <div style={{ whiteSpace: 'pre-wrap', marginBottom: '28px' }}>
                                {sanitize(problem.description)}
                            </div>

                            {/* Test Cases as Examples */}
                            {problem.visibleTestCases?.map((tc, index) => (
                                <div key={index} style={{ marginBottom: '24px' }}>
                                    <p style={{
                                        fontFamily: "'Geist', sans-serif",
                                        fontSize: '14px',
                                        fontWeight: 600,
                                        color: 'var(--on-surface)',
                                        marginBottom: '10px',
                                    }}>
                                        Example {index + 1}:
                                    </p>
                                    <div style={{
                                        background: 'var(--surface-container)',
                                        borderRadius: '8px',
                                        padding: '16px',
                                        borderLeft: '3px solid rgba(84, 68, 52, 0.4)',
                                    }}>
                                        <pre style={{
                                            fontFamily: "'JetBrains Mono', monospace",
                                            fontSize: '13px',
                                            lineHeight: '22px',
                                            color: 'var(--on-surface)',
                                            whiteSpace: 'pre-wrap',
                                            margin: 0,
                                        }}>
{`Input: ${tc.input}
Output: ${tc.output}`}{tc.explanation ? `\nExplanation: ${tc.explanation}` : ''}
                                        </pre>
                                    </div>
                                </div>
                            ))}

                            {/* Constraints */}
                            {problem.constraints && (
                                <div style={{ marginTop: '8px' }}>
                                    <p style={{
                                        fontFamily: "'Geist', sans-serif",
                                        fontSize: '14px',
                                        fontWeight: 600,
                                        color: 'var(--on-surface)',
                                        marginBottom: '10px',
                                    }}>
                                        Constraints:
                                    </p>
                                    <div style={{
                                        fontFamily: "'JetBrains Mono', monospace",
                                        fontSize: '13px',
                                        lineHeight: '24px',
                                        color: 'var(--on-surface-variant)',
                                        whiteSpace: 'pre-wrap',
                                    }}>
                                        {sanitize(problem.constraints)}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === 'testcases' && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            {runResults ? (
                                <>
                                    <h3 style={{
                                        fontFamily: "'Geist', sans-serif",
                                        fontSize: '16px',
                                        fontWeight: 600,
                                        color: 'var(--on-surface)',
                                        marginBottom: '4px',
                                    }}>Run Results</h3>
                                    {runResults.map((res, i) => (
                                        <div key={i} style={{
                                            background: 'var(--surface-container)',
                                            borderRadius: '8px',
                                            padding: '16px',
                                            border: `1px solid ${res.passed ? 'rgba(76, 206, 115, 0.2)' : 'rgba(255, 180, 171, 0.2)'}`,
                                        }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                                                <span style={{
                                                    fontFamily: "'Geist', sans-serif",
                                                    fontSize: '14px',
                                                    fontWeight: 600,
                                                    color: res.passed ? '#4cce73' : '#ffb4ab',
                                                }}>
                                                    {res.passed ? '✅ Passed' : '❌ Failed'}
                                                </span>
                                                <span style={{ ...labelStyle, textTransform: 'none', letterSpacing: 'normal' }}>
                                                    Test Case {res.testCase}
                                                </span>
                                            </div>
                                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                                                <div>
                                                    <p style={{ ...labelStyle, marginBottom: '4px', fontSize: '11px' }}>Expected Output</p>
                                                    <div style={{
                                                        background: 'var(--surface-container-high)',
                                                        padding: '8px 12px',
                                                        borderRadius: '6px',
                                                        fontFamily: "'JetBrains Mono', monospace",
                                                        fontSize: '12px',
                                                        color: 'var(--on-surface)',
                                                    }}>{res.expectedOutput}</div>
                                                </div>
                                                <div>
                                                    <p style={{ ...labelStyle, marginBottom: '4px', fontSize: '11px' }}>Your Output</p>
                                                    <div style={{
                                                        background: 'var(--surface-container-high)',
                                                        padding: '8px 12px',
                                                        borderRadius: '6px',
                                                        fontFamily: "'JetBrains Mono', monospace",
                                                        fontSize: '12px',
                                                        color: res.passed ? 'var(--on-surface)' : '#ffb4ab',
                                                    }}>{res.actualOutput || 'N/A'}</div>
                                                </div>
                                            </div>
                                            {res.error && (
                                                <div style={{
                                                    marginTop: '10px',
                                                    padding: '8px 12px',
                                                    borderRadius: '6px',
                                                    background: 'rgba(147, 0, 10, 0.1)',
                                                    border: '1px solid rgba(255, 180, 171, 0.15)',
                                                    fontFamily: "'JetBrains Mono', monospace",
                                                    fontSize: '12px',
                                                    color: '#ffb4ab',
                                                }}>
                                                    {res.error}
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </>
                            ) : (
                                <>
                                    {problem.visibleTestCases?.map((tc, index) => (
                                        <div key={index} style={{
                                            background: 'var(--surface-container)',
                                            borderRadius: '8px',
                                            padding: '16px',
                                        }}>
                                            <h4 style={{
                                                fontFamily: "'Geist', sans-serif",
                                                fontSize: '14px',
                                                fontWeight: 600,
                                                color: 'var(--on-surface)',
                                                marginBottom: '12px',
                                            }}>Test Case {index + 1}</h4>
                                            <div style={{ marginBottom: '8px' }}>
                                                <p style={{ ...labelStyle, fontSize: '11px', marginBottom: '4px' }}>Input</p>
                                                <div style={{
                                                    background: 'var(--surface-container-high)',
                                                    padding: '8px 12px',
                                                    borderRadius: '6px',
                                                    fontFamily: "'JetBrains Mono', monospace",
                                                    fontSize: '12px',
                                                    color: 'var(--on-surface)',
                                                    whiteSpace: 'pre-wrap',
                                                }}>{tc.input}</div>
                                            </div>
                                            <div>
                                                <p style={{ ...labelStyle, fontSize: '11px', marginBottom: '4px' }}>Output</p>
                                                <div style={{
                                                    background: 'var(--surface-container-high)',
                                                    padding: '8px 12px',
                                                    borderRadius: '6px',
                                                    fontFamily: "'JetBrains Mono', monospace",
                                                    fontSize: '12px',
                                                    color: 'var(--on-surface)',
                                                    whiteSpace: 'pre-wrap',
                                                }}>{tc.output}</div>
                                            </div>
                                        </div>
                                    ))}
                                </>
                            )}
                        </div>
                    )}

                    {activeTab === 'submissions' && (
                        <div>
                            {submitResult ? (
                                <div style={{
                                    padding: '24px',
                                    borderRadius: '8px',
                                    background: submitResult.status === 'wrong'
                                        ? 'rgba(147, 0, 10, 0.1)'
                                        : 'rgba(76, 206, 115, 0.08)',
                                    border: `1px solid ${submitResult.status === 'wrong' ? 'rgba(255, 180, 171, 0.2)' : 'rgba(76, 206, 115, 0.2)'}`,
                                }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                                        <span style={{ fontSize: '24px' }}>{submitResult.status === 'wrong' ? '❌' : '🎉'}</span>
                                        <h3 style={{
                                            fontFamily: "'Geist', sans-serif",
                                            fontSize: '20px',
                                            fontWeight: 600,
                                            color: submitResult.status === 'wrong' ? '#ffb4ab' : '#4cce73',
                                        }}>
                                            {submitResult.status === 'wrong' ? 'Wrong Answer / Error' : 'Accepted!'}
                                        </h3>
                                    </div>
                                    <p style={{
                                        fontFamily: "'Inter', sans-serif",
                                        fontSize: '14px',
                                        color: 'var(--on-surface-variant)',
                                        marginBottom: '12px',
                                    }}>{submitResult.message}</p>
                                    {submitResult.runtime !== undefined && (
                                        <div style={{ display: 'flex', gap: '12px' }}>
                                            <div style={{
                                                padding: '8px 16px',
                                                borderRadius: '6px',
                                                background: 'var(--surface-container)',
                                                fontFamily: "'JetBrains Mono', monospace",
                                                fontSize: '13px',
                                                color: 'var(--on-surface)',
                                            }}>
                                                Runtime: <strong>{submitResult.runtime} ms</strong>
                                            </div>
                                            <div style={{
                                                padding: '8px 16px',
                                                borderRadius: '6px',
                                                background: 'var(--surface-container)',
                                                fontFamily: "'JetBrains Mono', monospace",
                                                fontSize: '13px',
                                                color: 'var(--on-surface)',
                                            }}>
                                                Memory: <strong>{submitResult.memory} bytes</strong>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div style={{
                                    textAlign: 'center',
                                    padding: '60px 16px',
                                    color: 'var(--on-surface-variant)',
                                    fontFamily: "'Inter', sans-serif",
                                    fontSize: '14px',
                                }}>
                                    Submit your code to see the result here.
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* ════════════════════ RIGHT PANEL — Code Editor ════════════════════ */}
            <div style={{
                width: '50%',
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden',
                background: 'var(--surface-base)',
            }}>
                {/* Editor Toolbar */}
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '8px 12px',
                    borderBottom: '1px solid rgba(84, 68, 52, 0.2)',
                    background: 'var(--surface-base)',
                    flexShrink: 0,
                }}>
                    {/* Language Selector */}
                    <div style={{ position: 'relative' }}>
                        <select
                            value={language}
                            onChange={(e) => handleLanguageChange(e.target.value)}
                            style={{
                                fontFamily: "'JetBrains Mono', monospace",
                                fontSize: '13px',
                                fontWeight: 500,
                                color: 'var(--on-surface)',
                                background: 'var(--surface-container)',
                                border: '1px solid rgba(84, 68, 52, 0.3)',
                                borderRadius: '6px',
                                padding: '6px 32px 6px 12px',
                                cursor: 'pointer',
                                outline: 'none',
                                appearance: 'none',
                                WebkitAppearance: 'none',
                            }}
                        >
                            <option value="c++">C++</option>
                            <option value="java">Java</option>
                            <option value="javascript">JavaScript</option>
                        </select>
                        {/* Dropdown chevron */}
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--on-surface-variant)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                            style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}>
                            <polyline points="6 9 12 15 18 9" />
                        </svg>
                    </div>

                    {/* Run + Submit */}
                    <div style={{ display: 'flex', gap: '8px' }}>
                        <button
                            onClick={handleRunCode}
                            disabled={isExecuting}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '6px',
                                padding: '6px 14px',
                                borderRadius: '6px',
                                border: '1px solid rgba(84, 68, 52, 0.3)',
                                background: 'transparent',
                                color: 'var(--on-surface)',
                                fontFamily: "'JetBrains Mono', monospace",
                                fontSize: '12px',
                                letterSpacing: '0.03em',
                                fontWeight: 500,
                                cursor: isExecuting ? 'not-allowed' : 'pointer',
                                opacity: isExecuting ? 0.5 : 1,
                                transition: 'all 0.15s',
                            }}
                            onMouseEnter={(e) => { if (!isExecuting) e.currentTarget.style.borderColor = 'var(--primary-container)'; }}
                            onMouseLeave={(e) => e.currentTarget.style.borderColor = 'rgba(84, 68, 52, 0.3)'}
                        >
                            {isExecuting ? (
                                <div className="dm-spinner" style={{ width: '12px', height: '12px', borderWidth: '2px' }} />
                            ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                                    <polygon points="5 3 19 12 5 21 5 3" />
                                </svg>
                            )}
                            Run
                        </button>

                        <button
                            onClick={handleSubmitCode}
                            disabled={isExecuting}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '6px',
                                padding: '6px 14px',
                                borderRadius: '6px',
                                border: 'none',
                                background: 'var(--primary-container)',
                                color: 'var(--on-primary-container)',
                                fontFamily: "'JetBrains Mono', monospace",
                                fontSize: '12px',
                                letterSpacing: '0.03em',
                                fontWeight: 500,
                                cursor: isExecuting ? 'not-allowed' : 'pointer',
                                opacity: isExecuting ? 0.5 : 1,
                                transition: 'all 0.15s',
                            }}
                            onMouseEnter={(e) => { if (!isExecuting) e.currentTarget.style.background = 'var(--primary-fixed-dim)'; }}
                            onMouseLeave={(e) => e.currentTarget.style.background = 'var(--primary-container)'}
                        >
                            {isExecuting ? (
                                <div className="dm-spinner" style={{ width: '12px', height: '12px', borderWidth: '2px', borderColor: 'var(--on-primary-container)', borderTopColor: 'transparent' }} />
                            ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" />
                                </svg>
                            )}
                            Submit
                        </button>
                    </div>
                </div>

                {/* Monaco Editor */}
                <div style={{ flex: 1, overflow: 'hidden' }}>
                    <Editor
                        height="100%"
                        language={language === 'c++' ? 'cpp' : language}
                        theme="devmetrics-dark"
                        value={code}
                        onChange={(val) => setCode(val)}
                        beforeMount={defineDevMetricsTheme}
                        options={{
                            minimap: { enabled: false },
                            fontSize: 14,
                            fontFamily: "'JetBrains Mono', monospace",
                            fontLigatures: true,
                            wordWrap: 'on',
                            automaticLayout: true,
                            padding: { top: 16, bottom: 16 },
                            scrollBeyondLastLine: false,
                            renderLineHighlight: 'line',
                            lineNumbers: 'on',
                            glyphMargin: false,
                            folding: true,
                            lineDecorationsWidth: 8,
                            lineNumbersMinChars: 4,
                            overviewRulerBorder: false,
                            hideCursorInOverviewRuler: true,
                            overviewRulerLanes: 0,
                            scrollbar: {
                                verticalScrollbarSize: 6,
                                horizontalScrollbarSize: 6,
                                useShadows: false,
                            },
                            bracketPairColorization: {
                                enabled: true,
                            },
                            cursorBlinking: 'smooth',
                            cursorSmoothCaretAnimation: 'on',
                            smoothScrolling: true,
                        }}
                    />
                </div>
            </div>

            {/* ─── Responsive ─── */}
            <style>{`
                @media (max-width: 768px) {
                    div[style*="width: 50%"] {
                        width: 100% !important;
                    }
                }
                /* Fix Monaco select dropdowns */
                select option {
                    background: var(--surface-container) !important;
                    color: var(--on-surface) !important;
                    font-family: 'JetBrains Mono', monospace !important;
                }
            `}</style>
        </div>
    );
};

export default ProblemSolver;
