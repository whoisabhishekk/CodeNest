import React from 'react';

// ===== DIFFICULTY BADGE =====
// Ek chhota sa UI component jo problem ki difficulty (Easy, Medium, Hard) 
// ke hisaab se uska color set karega.

const DifficultyBadge = ({ level }) => {
    let color = '';
    
    switch (level?.toLowerCase()) {
        case 'easy':
            color = '#4cce73'; // tertiary-container green
            break;
        case 'medium':
            color = '#ffa116'; // primary-container amber
            break;
        case 'hard':
            color = '#ffb4ab'; // error red
            break;
        default:
            color = 'var(--on-surface-variant)';
    }

    return (
        <span style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: '12px',
            lineHeight: '16px',
            letterSpacing: '0.05em',
            fontWeight: 500,
            textTransform: 'uppercase',
            color: color,
        }}>
            {level}
        </span>
    );
};

export default DifficultyBadge;
