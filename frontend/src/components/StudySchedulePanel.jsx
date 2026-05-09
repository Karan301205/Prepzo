import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useViewport } from '../hooks/useViewport';

const actionConfig = {
  learn: { icon: '📖', color: '#6C63FF', bg: '#EEEDFF', label: 'Learn' },
  review: { icon: '🔄', color: '#D4910A', bg: '#FFF8E8', label: 'Review' },
  practice: { icon: '✍️', color: '#0D9E6E', bg: '#EEFFF7', label: 'Practice' },
};

const priorityDot = {
  high: '🔴',
  medium: '🟡',
  low: '⚪',
};

function DayCard({ day, index, isMobile }) {
  const [expanded, setExpanded] = useState(index < 3);
  const learnCount = day.topics.filter((t) => t.action === 'learn').length;
  const reviewCount = day.topics.filter((t) => t.action === 'review').length;
  const practiceCount = day.topics.filter((t) => t.action === 'practice').length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04 }}
      style={{
        background: '#FFFFFF',
        border: '1.5px solid #E0E0E8',
        borderRadius: 14,
        marginBottom: 12,
        overflow: 'hidden',
        transition: 'border-color 0.2s, box-shadow 0.2s',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = '#C8C4FF';
        e.currentTarget.style.boxShadow = '0 2px 16px rgba(108,99,255,0.08)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = '#E0E0E8';
        e.currentTarget.style.boxShadow = 'none';
      }}
    >
      {/* Header */}
      <button
        onClick={() => setExpanded(!expanded)}
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: isMobile ? '12px 14px' : '14px 20px',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          fontFamily: "'Sora', sans-serif",
          gap: 8,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: isMobile ? 8 : 12, minWidth: 0, flex: 1 }}>
          <span
            style={{
              fontFamily: "'DM Mono', monospace",
              fontSize: 12,
              color: '#6C63FF',
              background: '#EEEDFF',
              padding: '3px 10px',
              borderRadius: 6,
              fontWeight: 500,
              whiteSpace: 'nowrap',
              flexShrink: 0,
            }}
          >
            {day.label}
          </span>
          {!isMobile && (
            <span style={{ fontSize: 12, color: '#6B6B80', fontFamily: "'DM Mono', monospace", whiteSpace: 'nowrap' }}>
              {day.date}
            </span>
          )}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: isMobile ? 6 : 10, flexShrink: 0 }}>
          {learnCount > 0 && (
            <span style={{ fontSize: 11, color: '#6C63FF', fontFamily: "'DM Mono', monospace" }}>
              📖{learnCount}
            </span>
          )}
          {reviewCount > 0 && (
            <span style={{ fontSize: 11, color: '#D4910A', fontFamily: "'DM Mono', monospace" }}>
              🔄{reviewCount}
            </span>
          )}
          {practiceCount > 0 && (
            <span style={{ fontSize: 11, color: '#0D9E6E', fontFamily: "'DM Mono', monospace" }}>
              ✍️{practiceCount}
            </span>
          )}
          <span style={{ fontSize: 11, color: '#6B6B80', fontFamily: "'DM Mono', monospace" }}>
            {day.totalMinutes}min
          </span>
          <span style={{
            fontSize: 14, color: '#6B6B80',
            transition: 'transform 0.2s',
            transform: expanded ? 'rotate(180deg)' : 'rotate(0)',
          }}>
            ▾
          </span>
        </div>
      </button>

      {/* Expandable Content */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            style={{ overflow: 'hidden' }}
          >
            <div style={{ padding: isMobile ? '0 14px 14px' : '0 20px 16px', borderTop: '1px solid #F0F0F5' }}>
              {day.topics.map((topic, ti) => {
                const cfg = actionConfig[topic.action] || actionConfig.learn;
                return (
                  <div
                    key={ti}
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      justifyContent: 'space-between',
                      flexWrap: 'wrap',
                      gap: 6,
                      padding: '10px 0',
                      borderBottom: ti < day.topics.length - 1 ? '1px solid #F8F8FF' : 'none',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 0, flex: 1 }}>
                      <span style={{ fontSize: 14, flexShrink: 0 }}>{priorityDot[topic.priority] || '⚪'}</span>
                      <span style={{
                        fontFamily: "'Sora', sans-serif",
                        fontSize: isMobile ? 13 : 14,
                        color: '#0A0A0F',
                        fontWeight: 500,
                        minWidth: 0,
                        wordBreak: 'break-word',
                      }}>
                        {topic.name}
                      </span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
                      <span
                        style={{
                          fontSize: 11,
                          background: cfg.bg,
                          color: cfg.color,
                          padding: '2px 8px',
                          borderRadius: 999,
                          fontFamily: "'DM Mono', monospace",
                          fontWeight: 500,
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {cfg.icon} {cfg.label}
                      </span>
                      <span style={{ fontSize: 11, color: '#6B6B80', fontFamily: "'DM Mono', monospace", whiteSpace: 'nowrap' }}>
                        {topic.duration_minutes}min
                      </span>
                    </div>
                  </div>
                );
              })}
              {/* Tip */}
              <div
                style={{
                  marginTop: 12,
                  padding: '10px 14px',
                  background: '#F8F8FF',
                  borderRadius: 8,
                  fontSize: 13,
                  color: '#4A44AA',
                  fontFamily: "'Sora', sans-serif",
                  lineHeight: 1.5,
                }}
              >
                {day.tip}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function StudySchedulePanel({ schedule }) {
  const { isMobile } = useViewport();

  if (!schedule || schedule.length === 0) return null;

  const totalDays = schedule.length;
  const totalStudyHours = Math.round(schedule.reduce((sum, d) => sum + d.totalMinutes, 0) / 60);

  return (
    <div
      style={{
        background: '#FFFFFF',
        border: '1.5px solid #E0E0E8',
        borderRadius: 16,
        padding: isMobile ? '18px 16px' : '24px 28px',
        marginBottom: 40,
      }}
    >
      {/* Panel header — stacks on mobile */}
      <div style={{
        display: 'flex',
        flexDirection: isMobile ? 'column' : 'row',
        alignItems: isMobile ? 'flex-start' : 'center',
        justifyContent: 'space-between',
        gap: 12,
        marginBottom: 20,
      }}>
        <div>
          <span
            style={{
              fontFamily: "'DM Mono', monospace",
              fontSize: 11,
              color: '#6B6B80',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              display: 'block',
              marginBottom: 4,
            }}
          >
            SM-2 Spaced Repetition Schedule
          </span>
          <span style={{ fontFamily: "'Sora', sans-serif", fontSize: 13, color: '#6B6B80' }}>
            Scientifically optimized for maximum retention
          </span>
        </div>
        <div style={{ display: 'flex', gap: 20, flexShrink: 0 }}>
          <div style={{ textAlign: 'center' }}>
            <span style={{ fontFamily: "'Sora', sans-serif", fontWeight: 700, fontSize: 22, color: '#6C63FF', display: 'block' }}>
              {totalDays}
            </span>
            <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: '#6B6B80' }}>DAYS</span>
          </div>
          <div style={{ textAlign: 'center' }}>
            <span style={{ fontFamily: "'Sora', sans-serif", fontWeight: 700, fontSize: 22, color: '#0D9E6E', display: 'block' }}>
              {totalStudyHours}h
            </span>
            <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: '#6B6B80' }}>TOTAL</span>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div style={{ display: 'flex', gap: 16, marginBottom: 16, flexWrap: 'wrap' }}>
        {Object.entries(actionConfig).map(([key, cfg]) => (
          <span
            key={key}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 4,
              fontSize: 11,
              fontFamily: "'DM Mono', monospace",
              color: cfg.color,
            }}
          >
            {cfg.icon} {cfg.label}
          </span>
        ))}
      </div>

      {/* Day Cards */}
      {schedule.map((day, i) => (
        <DayCard key={day.day} day={day} index={i} isMobile={isMobile} />
      ))}
    </div>
  );
}
