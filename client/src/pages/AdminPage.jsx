import React, { useEffect, useState } from 'react';
import { Link } from 'react-router';
import { useSelector } from 'react-redux';
import axiosClient from '../utils/axiosClient';
import DifficultyBadge from '../components/DifficultyBadge';

const EMPTY_FORM = {
    title: '',
    description: '',
    difficulty: 'Easy',
    tags: [],
    visibleTestCases: [{ input: '', output: '', explanation: '' }],
    hiddenTestCases: [{ input: '', output: '' }],
    startCode: [{ language: 'c++', initialCode: '' }],
    referenceSolution: [{ language: 'c++', completeCode: '' }],
};

const TAG_OPTIONS = ['array','linkedlist','graph','dp','string','tree','math','greedy','binarysearch','stack','queue','hashmap'];

const AdminPage = () => {
    const { user } = useSelector((state) => state.auth);
    const [problems, setProblems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Form state
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [form, setForm] = useState(EMPTY_FORM);
    const [submitting, setSubmitting] = useState(false);
    const [formError, setFormError] = useState(null);
    const [formSuccess, setFormSuccess] = useState(null);

    // Delete state
    const [deletingId, setDeletingId] = useState(null);

    // Search/filter
    const [search, setSearch] = useState('');

    useEffect(() => {
        fetchProblems();
    }, []);

    const fetchProblems = async () => {
        try {
            setLoading(true);
            const res = await axiosClient.get('/problem/getAllProblem');
            setProblems(res.data.problem || []);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to fetch problems');
        } finally {
            setLoading(false);
        }
    };

    // Guard: only admins
    if (!user || user.role !== 'admin') {
        return (
            <div className="noise-bg" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '56px' }}>
                <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '48px', marginBottom: '16px' }}>🔒</div>
                    <h2 style={{ fontFamily: "'Geist', sans-serif", fontSize: '24px', fontWeight: 600, color: 'var(--on-surface)', marginBottom: '8px' }}>
                        Admin Access Only
                    </h2>
                    <p style={{ fontFamily: "'Inter', sans-serif", fontSize: '14px', color: 'var(--on-surface-variant)' }}>
                        You don't have permission to view this page.
                    </p>
                </div>
            </div>
        );
    }

    // ─── Handlers ───

    const handleOpenCreate = () => {
        setEditingId(null);
        setForm(EMPTY_FORM);
        setFormError(null);
        setFormSuccess(null);
        setShowForm(true);
    };

    const handleOpenEdit = async (id) => {
        try {
            const res = await axiosClient.get(`/problem/problemById/${id}`);
            const p = res.data.problem;
            setForm({
                title: p.title || '',
                description: p.description || '',
                difficulty: p.difficulty || 'Easy',
                tags: p.tags || [],
                visibleTestCases: p.visibleTestCases?.length ? p.visibleTestCases : [{ input: '', output: '', explanation: '' }],
                hiddenTestCases: [{ input: '', output: '' }], // hidden are not returned by API
                startCode: p.startCode?.length ? p.startCode : [{ language: 'c++', initialCode: '' }],
                referenceSolution: [{ language: 'c++', completeCode: '' }], // not returned by API
            });
            setEditingId(id);
            setFormError(null);
            setFormSuccess(null);
            setShowForm(true);
        } catch (err) {
            alert('Failed to load problem for editing');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this problem? This action cannot be undone.')) return;
        try {
            setDeletingId(id);
            await axiosClient.delete(`/problem/delete/${id}`);
            setProblems(prev => prev.filter(p => p._id !== id));
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to delete');
        } finally {
            setDeletingId(null);
        }
    };

    const handleSubmitForm = async (e) => {
        e.preventDefault();
        setFormError(null);
        setFormSuccess(null);

        // Basic validation
        if (!form.title.trim()) return setFormError('Title is required');
        if (!form.description.trim()) return setFormError('Description is required');
        if (form.tags.length === 0) return setFormError('Select at least one tag');
        if (form.visibleTestCases.some(tc => !tc.input.trim() || !tc.output.trim())) return setFormError('All visible test cases need input & output');
        if (form.hiddenTestCases.some(tc => !tc.input.trim() || !tc.output.trim())) return setFormError('All hidden test cases need input & output');
        if (form.startCode.some(sc => !sc.initialCode.trim())) return setFormError('Start code cannot be empty');
        if (form.referenceSolution.some(rs => !rs.completeCode.trim())) return setFormError('Reference solution cannot be empty');

        try {
            setSubmitting(true);
            if (editingId) {
                await axiosClient.put(`/problem/update/${editingId}`, form);
                setFormSuccess('Problem updated successfully!');
            } else {
                await axiosClient.post('/problem/create', form);
                setFormSuccess('Problem created successfully!');
            }
            fetchProblems();
            setTimeout(() => {
                setShowForm(false);
                setFormSuccess(null);
            }, 1500);
        } catch (err) {
            let errorMsg = err.response?.data?.message || err.response?.data?.error || 'Operation failed';
            if (err.response?.data?.reason) {
                errorMsg += ` (${err.response.data.reason})`;
            }
            if (err.response?.data?.details) {
                errorMsg += ` | Details: ${err.response.data.details}`;
            }
            setFormError(errorMsg);
        } finally {
            setSubmitting(false);
        }
    };

    // ─── Dynamic array field helpers ───
    const addArrayItem = (field, template) => {
        setForm(prev => ({ ...prev, [field]: [...prev[field], template] }));
    };
    const removeArrayItem = (field, index) => {
        setForm(prev => ({ ...prev, [field]: prev[field].filter((_, i) => i !== index) }));
    };
    const updateArrayItem = (field, index, key, value) => {
        setForm(prev => ({
            ...prev,
            [field]: prev[field].map((item, i) => i === index ? { ...item, [key]: value } : item)
        }));
    };

    const toggleTag = (tag) => {
        setForm(prev => ({
            ...prev,
            tags: prev.tags.includes(tag) ? prev.tags.filter(t => t !== tag) : [...prev.tags, tag]
        }));
    };

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
        marginBottom: '8px',
        display: 'block',
    };

    const inputStyle = {
        width: '100%',
        background: 'var(--surface-container-highest)',
        border: '1px solid rgba(84, 68, 52, 0.3)',
        color: 'var(--on-surface)',
        fontFamily: "'Inter', sans-serif",
        fontSize: '14px',
        borderRadius: '8px',
        padding: '10px 14px',
        outline: 'none',
        transition: 'border-color 0.2s',
    };

    const textareaStyle = {
        ...inputStyle,
        fontFamily: "'JetBrains Mono', monospace",
        fontSize: '13px',
        lineHeight: '20px',
        minHeight: '100px',
        resize: 'vertical',
    };

    const filteredProblems = problems.filter(p =>
        p.title.toLowerCase().includes(search.toLowerCase())
    );

    const stats = {
        total: problems.length,
        easy: problems.filter(p => p.difficulty === 'Easy').length,
        medium: problems.filter(p => p.difficulty === 'Medium').length,
        hard: problems.filter(p => p.difficulty === 'Hard').length,
    };

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
                {/* Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px' }}>
                    <div>
                        <h1 style={{
                            fontFamily: "'Geist', sans-serif",
                            fontSize: '32px',
                            lineHeight: '40px',
                            fontWeight: 600,
                            color: 'var(--on-surface)',
                            marginBottom: '4px',
                        }}>
                            Admin Dashboard
                        </h1>
                        <p style={{ fontFamily: "'Inter', sans-serif", fontSize: '14px', color: 'var(--on-surface-variant)' }}>
                            Manage problems, test cases, and solutions.
                        </p>
                    </div>
                    <button
                        onClick={handleOpenCreate}
                        className="dm-btn-primary"
                        style={{
                            width: 'auto',
                            padding: '12px 28px',
                            fontSize: '13px',
                            fontFamily: "'JetBrains Mono', monospace",
                            letterSpacing: '0.05em',
                            fontWeight: 500,
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                        }}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
                        </svg>
                        New Problem
                    </button>
                </div>

                {/* Stats Cards */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '28px' }}>
                    {[
                        { label: 'Total', value: stats.total, color: 'var(--primary)' },
                        { label: 'Easy', value: stats.easy, color: '#4cce73' },
                        { label: 'Medium', value: stats.medium, color: '#ffa116' },
                        { label: 'Hard', value: stats.hard, color: '#ffb4ab' },
                    ].map(({ label, value, color }) => (
                        <div key={label} style={card}>
                            <p style={{ ...labelStyle, marginBottom: '4px' }}>{label}</p>
                            <span style={{
                                fontFamily: "'Geist', sans-serif",
                                fontSize: '28px',
                                fontWeight: 700,
                                color: color,
                            }}>
                                {value}
                            </span>
                        </div>
                    ))}
                </div>

                {/* Search */}
                <div style={{ marginBottom: '20px' }}>
                    <div className="input-icon-wrapper">
                        <svg className="input-icon" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
                        </svg>
                        <input
                            type="text"
                            placeholder="Search problems..."
                            className="dm-input"
                            style={{ maxWidth: '400px' }}
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                </div>

                {/* Problems Table */}
                <div style={{
                    ...card,
                    padding: 0,
                    overflow: 'hidden',
                }}>
                    {loading ? (
                        <div style={{ display: 'flex', justifyContent: 'center', padding: '60px' }}>
                            <div className="dm-spinner" style={{ width: '28px', height: '28px', borderWidth: '3px', borderColor: 'var(--primary)', borderTopColor: 'transparent' }} />
                        </div>
                    ) : error ? (
                        <div className="dm-error" style={{ margin: '24px' }}>{error}</div>
                    ) : (
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr style={{ borderBottom: '1px solid rgba(84, 68, 52, 0.2)' }}>
                                    {['#', 'Title', 'Difficulty', 'Tags', 'Actions'].map((col, i) => (
                                        <th key={col} style={{
                                            ...labelStyle,
                                            padding: '14px 16px',
                                            textAlign: i === 4 ? 'center' : 'left',
                                            display: 'table-cell',
                                        }}>{col}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {filteredProblems.length > 0 ? filteredProblems.map((prob, idx) => (
                                    <tr
                                        key={prob._id}
                                        style={{ borderBottom: '1px solid rgba(84, 68, 52, 0.1)', transition: 'background 0.15s' }}
                                        onMouseEnter={(e) => e.currentTarget.style.background = 'var(--surface-container)'}
                                        onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                                    >
                                        <td style={{ padding: '14px 16px', fontFamily: "'JetBrains Mono', monospace", fontSize: '13px', color: 'var(--on-surface-variant)', width: '50px' }}>
                                            {idx + 1}
                                        </td>
                                        <td style={{ padding: '14px 16px' }}>
                                            <span style={{ fontFamily: "'Inter', sans-serif", fontSize: '14px', color: 'var(--on-surface)', fontWeight: 500 }}>
                                                {prob.title}
                                            </span>
                                        </td>
                                        <td style={{ padding: '14px 16px' }}>
                                            <DifficultyBadge level={prob.difficulty} />
                                        </td>
                                        <td style={{ padding: '14px 16px' }}>
                                            <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                                                {prob.tags?.slice(0, 3).map((tag, i) => (
                                                    <span key={i} style={{
                                                        fontFamily: "'JetBrains Mono', monospace",
                                                        fontSize: '11px',
                                                        padding: '2px 8px',
                                                        borderRadius: '4px',
                                                        background: 'var(--surface-container-highest)',
                                                        color: 'var(--on-surface-variant)',
                                                    }}>{tag}</span>
                                                ))}
                                            </div>
                                        </td>
                                        <td style={{ padding: '14px 16px', textAlign: 'center' }}>
                                            <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                                                <button
                                                    onClick={() => handleOpenEdit(prob._id)}
                                                    style={{
                                                        background: 'none', border: 'none', cursor: 'pointer',
                                                        color: 'var(--secondary)', padding: '4px', transition: 'color 0.2s',
                                                    }}
                                                    onMouseEnter={(e) => e.currentTarget.style.color = 'var(--primary)'}
                                                    onMouseLeave={(e) => e.currentTarget.style.color = 'var(--secondary)'}
                                                    title="Edit"
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                                                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                                                    </svg>
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(prob._id)}
                                                    disabled={deletingId === prob._id}
                                                    style={{
                                                        background: 'none', border: 'none', cursor: 'pointer',
                                                        color: 'var(--error)', padding: '4px', transition: 'opacity 0.2s',
                                                        opacity: deletingId === prob._id ? 0.4 : 1,
                                                    }}
                                                    title="Delete"
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                        <polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                                                    </svg>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan="5" style={{ padding: '48px 16px', textAlign: 'center', fontFamily: "'Inter', sans-serif", fontSize: '14px', color: 'var(--on-surface-variant)' }}>
                                            No problems found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    )}
                </div>
            </main>

            {/* ════════════════════ CREATE / EDIT FORM MODAL ════════════════════ */}
            {showForm && (
                <div style={{
                    position: 'fixed',
                    inset: 0,
                    zIndex: 100,
                    display: 'flex',
                    alignItems: 'flex-start',
                    justifyContent: 'center',
                    background: 'rgba(0,0,0,0.7)',
                    backdropFilter: 'blur(4px)',
                    overflowY: 'auto',
                    padding: '80px 16px 40px',
                }}>
                    <div style={{
                        ...card,
                        width: '100%',
                        maxWidth: '800px',
                        position: 'relative',
                    }}>
                        {/* Close */}
                        <button
                            onClick={() => setShowForm(false)}
                            style={{
                                position: 'absolute', top: '16px', right: '16px',
                                background: 'none', border: 'none', cursor: 'pointer',
                                color: 'var(--on-surface-variant)', padding: '4px',
                            }}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                            </svg>
                        </button>

                        <h2 style={{
                            fontFamily: "'Geist', sans-serif",
                            fontSize: '24px',
                            fontWeight: 600,
                            color: 'var(--on-surface)',
                            marginBottom: '24px',
                        }}>
                            {editingId ? 'Edit Problem' : 'Create New Problem'}
                        </h2>

                        {/* Status messages */}
                        {formError && <div className="dm-error" style={{ marginBottom: '16px' }}>{formError}</div>}
                        {formSuccess && (
                            <div style={{
                                padding: '12px 16px', borderRadius: '8px', marginBottom: '16px',
                                background: 'rgba(76, 206, 115, 0.1)', border: '1px solid rgba(76, 206, 115, 0.2)',
                                color: '#4cce73', fontFamily: "'Inter', sans-serif", fontSize: '14px',
                            }}>{formSuccess}</div>
                        )}

                        <form onSubmit={handleSubmitForm} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                            {/* Title */}
                            <div>
                                <label style={labelStyle}>Title</label>
                                <input style={inputStyle} value={form.title} onChange={(e) => setForm(p => ({ ...p, title: e.target.value }))} placeholder="Two Sum" />
                            </div>

                            {/* Description */}
                            <div>
                                <label style={labelStyle}>Description</label>
                                <textarea style={textareaStyle} value={form.description} onChange={(e) => setForm(p => ({ ...p, description: e.target.value }))} placeholder="Given an array of integers..." />
                            </div>

                            {/* Difficulty + Tags row */}
                            <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr', gap: '16px' }}>
                                <div>
                                    <label style={labelStyle}>Difficulty</label>
                                    <select
                                        value={form.difficulty}
                                        onChange={(e) => setForm(p => ({ ...p, difficulty: e.target.value }))}
                                        style={{
                                            ...inputStyle,
                                            fontFamily: "'JetBrains Mono', monospace",
                                            fontSize: '13px',
                                            cursor: 'pointer',
                                            appearance: 'none',
                                        }}
                                    >
                                        <option value="Easy">Easy</option>
                                        <option value="Medium">Medium</option>
                                        <option value="Hard">Hard</option>
                                    </select>
                                </div>
                                <div>
                                    <label style={labelStyle}>Tags</label>
                                    <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                                        {TAG_OPTIONS.map(tag => (
                                            <button
                                                key={tag}
                                                type="button"
                                                onClick={() => toggleTag(tag)}
                                                style={{
                                                    fontFamily: "'JetBrains Mono', monospace",
                                                    fontSize: '11px',
                                                    padding: '4px 10px',
                                                    borderRadius: '4px',
                                                    border: form.tags.includes(tag) ? '1px solid var(--primary-container)' : '1px solid rgba(84, 68, 52, 0.3)',
                                                    background: form.tags.includes(tag) ? 'rgba(255, 161, 22, 0.1)' : 'transparent',
                                                    color: form.tags.includes(tag) ? 'var(--primary)' : 'var(--on-surface-variant)',
                                                    cursor: 'pointer',
                                                    transition: 'all 0.15s',
                                                }}
                                            >
                                                {tag}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Visible Test Cases */}
                            <div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                                    <label style={{ ...labelStyle, margin: 0 }}>Visible Test Cases</label>
                                    <button type="button" onClick={() => addArrayItem('visibleTestCases', { input: '', output: '', explanation: '' })}
                                        style={{ background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer', fontFamily: "'JetBrains Mono', monospace", fontSize: '12px' }}>
                                        + Add
                                    </button>
                                </div>
                                {form.visibleTestCases.map((tc, i) => (
                                    <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr auto', gap: '8px', marginBottom: '8px' }}>
                                        <input style={inputStyle} placeholder="Input" value={tc.input} onChange={(e) => updateArrayItem('visibleTestCases', i, 'input', e.target.value)} />
                                        <input style={inputStyle} placeholder="Output" value={tc.output} onChange={(e) => updateArrayItem('visibleTestCases', i, 'output', e.target.value)} />
                                        <input style={inputStyle} placeholder="Explanation" value={tc.explanation} onChange={(e) => updateArrayItem('visibleTestCases', i, 'explanation', e.target.value)} />
                                        {form.visibleTestCases.length > 1 && (
                                            <button type="button" onClick={() => removeArrayItem('visibleTestCases', i)}
                                                style={{ background: 'none', border: 'none', color: 'var(--error)', cursor: 'pointer', padding: '0 4px', fontSize: '18px' }}>×</button>
                                        )}
                                    </div>
                                ))}
                            </div>

                            {/* Hidden Test Cases */}
                            <div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                                    <label style={{ ...labelStyle, margin: 0 }}>Hidden Test Cases</label>
                                    <button type="button" onClick={() => addArrayItem('hiddenTestCases', { input: '', output: '' })}
                                        style={{ background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer', fontFamily: "'JetBrains Mono', monospace", fontSize: '12px' }}>
                                        + Add
                                    </button>
                                </div>
                                {form.hiddenTestCases.map((tc, i) => (
                                    <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: '8px', marginBottom: '8px' }}>
                                        <input style={inputStyle} placeholder="Input" value={tc.input} onChange={(e) => updateArrayItem('hiddenTestCases', i, 'input', e.target.value)} />
                                        <input style={inputStyle} placeholder="Output" value={tc.output} onChange={(e) => updateArrayItem('hiddenTestCases', i, 'output', e.target.value)} />
                                        {form.hiddenTestCases.length > 1 && (
                                            <button type="button" onClick={() => removeArrayItem('hiddenTestCases', i)}
                                                style={{ background: 'none', border: 'none', color: 'var(--error)', cursor: 'pointer', padding: '0 4px', fontSize: '18px' }}>×</button>
                                        )}
                                    </div>
                                ))}
                            </div>

                            {/* Start Code */}
                            <div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                                    <label style={{ ...labelStyle, margin: 0 }}>Start Code (per language)</label>
                                    <button type="button" onClick={() => addArrayItem('startCode', { language: 'java', initialCode: '' })}
                                        style={{ background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer', fontFamily: "'JetBrains Mono', monospace", fontSize: '12px' }}>
                                        + Add Language
                                    </button>
                                </div>
                                {form.startCode.map((sc, i) => (
                                    <div key={i} style={{ marginBottom: '12px', padding: '12px', borderRadius: '8px', background: 'var(--surface-container)' }}>
                                        <div style={{ display: 'flex', gap: '8px', marginBottom: '8px', alignItems: 'center' }}>
                                            <select value={sc.language} onChange={(e) => updateArrayItem('startCode', i, 'language', e.target.value)}
                                                style={{ ...inputStyle, width: '160px', fontFamily: "'JetBrains Mono', monospace", fontSize: '12px' }}>
                                                <option value="c++">C++</option>
                                                <option value="java">Java</option>
                                                <option value="javascript">JavaScript</option>
                                            </select>
                                            {form.startCode.length > 1 && (
                                                <button type="button" onClick={() => removeArrayItem('startCode', i)}
                                                    style={{ background: 'none', border: 'none', color: 'var(--error)', cursor: 'pointer', fontSize: '16px' }}>×</button>
                                            )}
                                        </div>
                                        <textarea style={{ ...textareaStyle, minHeight: '80px' }} placeholder="// Starter code template..."
                                            value={sc.initialCode} onChange={(e) => updateArrayItem('startCode', i, 'initialCode', e.target.value)} />
                                    </div>
                                ))}
                            </div>

                            {/* Reference Solution */}
                            <div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                                    <label style={{ ...labelStyle, margin: 0 }}>Reference Solution (per language)</label>
                                    <button type="button" onClick={() => addArrayItem('referenceSolution', { language: 'java', completeCode: '' })}
                                        style={{ background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer', fontFamily: "'JetBrains Mono', monospace", fontSize: '12px' }}>
                                        + Add Language
                                    </button>
                                </div>
                                {form.referenceSolution.map((rs, i) => (
                                    <div key={i} style={{ marginBottom: '12px', padding: '12px', borderRadius: '8px', background: 'var(--surface-container)' }}>
                                        <div style={{ display: 'flex', gap: '8px', marginBottom: '8px', alignItems: 'center' }}>
                                            <select value={rs.language} onChange={(e) => updateArrayItem('referenceSolution', i, 'language', e.target.value)}
                                                style={{ ...inputStyle, width: '160px', fontFamily: "'JetBrains Mono', monospace", fontSize: '12px' }}>
                                                <option value="c++">C++</option>
                                                <option value="java">Java</option>
                                                <option value="javascript">JavaScript</option>
                                            </select>
                                            {form.referenceSolution.length > 1 && (
                                                <button type="button" onClick={() => removeArrayItem('referenceSolution', i)}
                                                    style={{ background: 'none', border: 'none', color: 'var(--error)', cursor: 'pointer', fontSize: '16px' }}>×</button>
                                            )}
                                        </div>
                                        <textarea style={{ ...textareaStyle, minHeight: '120px' }} placeholder="// Full working solution..."
                                            value={rs.completeCode} onChange={(e) => updateArrayItem('referenceSolution', i, 'completeCode', e.target.value)} />
                                    </div>
                                ))}
                            </div>

                            {/* Submit */}
                            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', paddingTop: '8px' }}>
                                <button
                                    type="button"
                                    onClick={() => setShowForm(false)}
                                    style={{
                                        padding: '12px 24px', borderRadius: '8px',
                                        border: '1px solid rgba(84, 68, 52, 0.3)', background: 'transparent',
                                        color: 'var(--on-surface)', fontFamily: "'JetBrains Mono', monospace",
                                        fontSize: '13px', fontWeight: 500, cursor: 'pointer', transition: 'all 0.15s',
                                    }}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="dm-btn-primary"
                                    style={{
                                        width: 'auto', padding: '12px 28px', fontSize: '13px',
                                        fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.05em',
                                        display: 'flex', alignItems: 'center', gap: '8px',
                                    }}
                                >
                                    {submitting ? <span className="dm-spinner" style={{ width: '14px', height: '14px', borderWidth: '2px' }} /> : null}
                                    {editingId ? 'Update Problem' : 'Create Problem'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

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
                            >{label}</a>
                        ))}
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default AdminPage;
