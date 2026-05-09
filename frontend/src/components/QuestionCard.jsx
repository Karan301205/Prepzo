import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import PriorityBadge from './PriorityBadge';
import { useViewport } from '../hooks/useViewport';

function TypeBadge({ type }) {
  const configs = {
    MCQ: { bg: '#EEF6FF', text: '#2563EB', label: 'MCQ' },
    coding: { bg: '#F0FDF4', text: '#15803D', label: 'Coding' },
    theory: { bg: '#EEEDFF', text: '#4A44AA', label: 'Theory' },
  };
  const config = configs[type] || configs.theory;
  return (
    <span
      style={{
        display: 'inline-block',
        background: config.bg,
        color: config.text,
        border: `1px solid ${config.bg}`,
        borderRadius: 999,
        padding: '3px 10px',
        fontFamily: "'DM Mono', monospace",
        fontSize: 11,
        whiteSpace: 'nowrap',
      }}
    >
      {config.label}
    </span>
  );
}

function DifficultyTag({ difficulty }) {
  const colors = { easy: '#0D9E6E', medium: '#D4910A', hard: '#E8341C' };
  const icons  = { easy: '🟢', medium: '🟠', hard: '🔴' };
  const labels = { easy: 'Easy', medium: 'Medium', hard: 'Hard' };
  return (
    <span
      style={{
        fontFamily: "'DM Mono', monospace",
        fontSize: 12,
        color: colors[difficulty] || colors.medium,
        whiteSpace: 'nowrap',
      }}
    >
      {icons[difficulty] || '🟠'} {labels[difficulty] || 'Medium'}
    </span>
  );
}

export default function QuestionCard({ question, index }) {
  const [showSolution, setShowSolution] = useState(false);
  const { isMobile } = useViewport();

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06, duration: 0.4 }}
      style={{
        background: '#FFFFFF',
        border: '1.5px solid #E0E0E8',
        borderRadius: 16,
        padding: isMobile ? '18px 16px' : '24px 28px',
        marginBottom: 16,
        transition: 'box-shadow 0.2s, border-color 0.2s',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = '0 4px 24px rgba(108,99,255,0.10)';
        e.currentTarget.style.borderColor = '#C8C4FF';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = 'none';
        e.currentTarget.style.borderColor = '#E0E0E8';
      }}
    >
      {/* Row 1: Badges */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
        <PriorityBadge priority={question.priority} />
        <TypeBadge type={question.type} />
        <DifficultyTag difficulty={question.difficulty} />
        <span
          style={{
            fontFamily: "'DM Mono', monospace",
            fontSize: 11,
            color: '#6B6B80',
            background: '#F5F5F5',
            padding: '3px 10px',
            borderRadius: 999,
            border: '1px solid #E0E0E8',
            maxWidth: isMobile ? '100%' : 'auto',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
          title={question.topic}
        >
          📌 {question.topic}
        </span>
      </div>

      {/* Row 2: Question text */}
      <p
        style={{
          fontFamily: "'Sora', sans-serif",
          fontWeight: 600,
          fontSize: isMobile ? 14 : 15,
          color: '#0A0A0F',
          lineHeight: 1.6,
          margin: '14px 0 16px',
          wordBreak: 'break-word',
        }}
      >
        Q{index + 1}. {question.question}
      </p>

      {/* Row 3: Probability bar */}
      <div style={{ marginBottom: 16 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
          <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: '#6B6B80', letterSpacing: '0.06em' }}>
            EXAM PROBABILITY
          </span>
          <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 12, color: '#6C63FF', fontWeight: 500 }}>
            {Math.round(question.probability * 100)}%
          </span>
        </div>
        <div style={{ background: '#F0EEFF', borderRadius: 4, height: 6, overflow: 'hidden' }}>
          <div
            style={{
              width: `${Math.round(question.probability * 100)}%`,
              height: '100%',
              background: 'linear-gradient(90deg, #6C63FF, #A09AFF)',
              borderRadius: 4,
              transition: 'width 1s cubic-bezier(0.4,0,0.2,1)',
            }}
          />
        </div>
      </div>

      {/* Row 4: Solution toggle */}
      <div>
        <button
          onClick={() => setShowSolution(!showSolution)}
          style={{
            background: 'none',
            border: 'none',
            fontFamily: "'Sora', sans-serif",
            fontSize: 13,
            color: '#6C63FF',
            cursor: 'pointer',
            padding: 0,
            borderBottom: '1px solid transparent',
          }}
          onMouseEnter={(e) => (e.target.style.borderBottom = '1px dashed #C8C4FF')}
          onMouseLeave={(e) => (e.target.style.borderBottom = '1px solid transparent')}
        >
          {showSolution ? '▾ Hide Solution' : '▸ View Solution'}
        </button>

        <AnimatePresence>
          {showSolution && (
            <motion.div
              initial={{ height: 0, opacity: 0, marginTop: 0 }}
              animate={{ height: 'auto', opacity: 1, marginTop: 12 }}
              exit={{ height: 0, opacity: 0, marginTop: 0 }}
              style={{ overflow: 'hidden' }}
            >
              <div
                style={{
                  background: '#F8F8FF',
                  border: '1px solid #E0E0E8',
                  borderRadius: 10,
                  padding: isMobile ? '12px 14px' : '16px 18px',
                  fontFamily: "'Sora', sans-serif",
                  fontSize: isMobile ? 13 : 14,
                  color: '#3A3A5A',
                  lineHeight: 1.7,
                  whiteSpace: 'pre-wrap',
                  wordBreak: 'break-word',
                }}
              >
                {question.solution}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
