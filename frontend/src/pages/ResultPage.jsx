import { useState, useMemo, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import ModeBanner from '../components/ModeBanner';
import FilterBar from '../components/FilterBar';
import QuestionCard from '../components/QuestionCard';

const pageVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
};

function ArrowRightIcon({ size = 16, color = '#6C63FF' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M3.33 8H12.67M12.67 8L8.67 4M12.67 8L8.67 12" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function ResultPage() {
  const location = useLocation();
  const navigate = useNavigate();

  const getStoredData = () => {
    try {
      return JSON.parse(localStorage.getItem('prepzo_last_result') || '{}');
    } catch {
      return {};
    }
  };

  const rawState = location.state;
  const stored = getStoredData();

  const plan = rawState?.plan || stored?.plan || null;
  const subject = rawState?.subject || stored?.subject || '';
  const examDate = rawState?.examDate || stored?.examDate || '';

  useEffect(() => {
    if (!plan) navigate('/input', { replace: true });
  }, []);

  const [filters, setFilters] = useState({
    priority: [],
    difficulty: [],
    type: [],
  });

  const filteredQuestions = useMemo(() => {
    if (!plan?.questions) return [];
    return plan.questions.filter((q) => {
      const pMatch = filters.priority.length === 0 || filters.priority.includes(q.priority);
      const dMatch = filters.difficulty.length === 0 || filters.difficulty.includes(q.difficulty);
      const tMatch = filters.type.length === 0 || filters.type.includes(q.type);
      return pMatch && dMatch && tMatch;
    });
  }, [plan, filters]);

  if (!plan) return null;

  const modeColor = plan.mode === 'survival' ? '#E8341C' : plan.mode === 'balanced' ? '#D4910A' : '#0D9E6E';

  const handleOpenChat = () => {
    navigate('/chat', { state: { plan, subject, examDate } });
  };

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{ duration: 0.4 }}
      style={{
        background: '#F5F5F5',
        minHeight: '100vh',
      }}
    >
      <Navbar />

      <div
        style={{
          paddingTop: 100,
          paddingBottom: 80,
          maxWidth: 800,
          margin: '0 auto',
          paddingLeft: 24,
          paddingRight: 24,
        }}
      >
        <div style={{ marginBottom: 32 }}>
          <h1
            style={{
              fontFamily: "'Sora', sans-serif",
              fontWeight: 600,
              fontSize: 40,
              color: '#0A0A0F',
              letterSpacing: '-0.03em',
              marginBottom: 8,
            }}
          >
            Your <span style={{ color: modeColor, textTransform: 'capitalize' }}>{plan.mode}</span> Plan
          </h1>
          <p
            style={{
              fontFamily: "'DM Mono', monospace",
              fontSize: 13,
              color: '#6B6B80',
            }}
          >
            {subject} · {examDate}
          </p>
        </div>

        <ModeBanner mode={plan.mode} />

        <div
          style={{
            background: '#FFFFFF',
            border: '1.5px solid #E0E0E8',
            borderRadius: 16,
            padding: '24px 28px',
            marginBottom: 40,
          }}
        >
          <div style={{ marginBottom: 24 }}>
            <span
              style={{
                fontFamily: "'DM Mono', monospace",
                fontSize: 11,
                color: '#6B6B80',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                display: 'block',
                marginBottom: 12,
              }}
            >
              Strategy
            </span>
            <p
              style={{
                fontFamily: "'Sora', sans-serif",
                fontSize: 15,
                color: '#0A0A0F',
                lineHeight: 1.7,
              }}
            >
              {plan.strategy}
            </p>
          </div>

          <div>
            <span
              style={{
                fontFamily: "'DM Mono', monospace",
                fontSize: 11,
                color: '#6B6B80',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                display: 'block',
                marginBottom: 12,
              }}
            >
              Focus Topics
            </span>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {plan.focusTopics?.map((t, i) => (
                <span
                  key={i}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    background: '#EEEDFF',
                    border: '1px solid #C8C4FF',
                    color: '#4A44AA',
                    borderRadius: 999,
                    padding: '5px 14px',
                    fontFamily: "'Sora', sans-serif",
                    fontSize: 13,
                  }}
                >
                  {t}
                </span>
              ))}
            </div>
          </div>
        </div>

        <FilterBar filters={filters} setFilters={setFilters} />

        <div
          style={{
            borderTop: '1px solid #E0E0E8',
            paddingTop: 16,
            marginBottom: 24,
            fontFamily: "'DM Mono', monospace",
            fontSize: 13,
            color: '#6B6B80',
          }}
        >
          Showing {filteredQuestions.length} of {plan.questions?.length || 0} questions
        </div>

        <div>
          {filteredQuestions.map((q, i) => (
            <QuestionCard key={i} question={q} index={i} />
          ))}
          {filteredQuestions.length === 0 && (
            <div style={{ textAlign: 'center', padding: '40px 0', color: '#6B6B80', fontFamily: "'Sora', sans-serif" }}>
              No questions match the current filters.
            </div>
          )}
        </div>

        <div
          style={{
            background: '#1A1626',
            borderRadius: 20,
            padding: '28px 32px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginTop: 40,
            flexWrap: 'wrap',
            gap: 20,
          }}
        >
          <div>
            <p
              style={{
                fontFamily: "'Sora', sans-serif",
                fontWeight: 600,
                fontSize: 18,
                color: '#F0F0FF',
                letterSpacing: '-0.02em',
                marginBottom: 4,
              }}
            >
              Questions about your plan?
            </p>
            <p
              style={{
                fontFamily: "'Sora', sans-serif",
                fontSize: 14,
                color: 'rgba(240,240,255,0.55)',
              }}
            >
              Ask Prepzo to explain, simplify, or go deeper.
            </p>
          </div>
          <button
            onClick={handleOpenChat}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 12,
              background: '#FFFFFF',
              color: '#0A0A0F',
              fontSize: 15,
              fontFamily: "'Sora', sans-serif",
              fontWeight: 500,
              paddingLeft: 24,
              paddingRight: 6,
              paddingTop: 6,
              paddingBottom: 6,
              borderRadius: 999,
              cursor: 'pointer',
              border: 'none',
              transition: 'background-color 0.2s ease',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#EEEDFF')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#FFFFFF')}
          >
            Open Chat
            <span
              style={{
                background: '#F0EEFF',
                borderRadius: '50%',
                padding: 8,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <ArrowRightIcon size={16} />
            </span>
          </button>
        </div>
      </div>
    </motion.div>
  );
}
