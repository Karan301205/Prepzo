import { motion } from 'framer-motion';

const typeConfigs = {
  MCQ: { icon: '🔵', color: '#2563EB', bg: '#EEF6FF' },
  coding: { icon: '🟢', color: '#15803D', bg: '#F0FDF4' },
  theory: { icon: '🟣', color: '#4A44AA', bg: '#EEEDFF' },
};

function ConfidenceBar({ label, value, color }) {
  return (
    <div style={{ marginBottom: 6 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
        <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: '#6B6B80', textTransform: 'capitalize' }}>
          {label}
        </span>
        <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color }}>
          {Math.round(value * 100)}%
        </span>
      </div>
      <div style={{ background: '#F0F0F5', borderRadius: 3, height: 4, overflow: 'hidden' }}>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${Math.round(value * 100)}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          style={{ height: '100%', background: color, borderRadius: 3 }}
        />
      </div>
    </div>
  );
}

export default function TopicInsightsPanel({ topicInsights }) {
  if (!topicInsights || Object.keys(topicInsights).length === 0) return null;

  const entries = Object.entries(topicInsights);

  return (
    <div
      style={{
        background: '#FFFFFF',
        border: '1.5px solid #E0E0E8',
        borderRadius: 16,
        padding: '24px 28px',
        marginBottom: 40,
      }}
    >
      <span
        style={{
          fontFamily: "'DM Mono', monospace",
          fontSize: 11,
          color: '#6B6B80',
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          display: 'block',
          marginBottom: 16,
        }}
      >
        ML Topic Insights — Naive Bayes Predictions
      </span>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 16 }}>
        {entries.map(([topic, insight], i) => {
          const config = typeConfigs[insight.predicted_type] || typeConfigs.theory;
          return (
            <motion.div
              key={topic}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              style={{
                background: '#FAFAFF',
                border: '1px solid #E0E0E8',
                borderRadius: 12,
                padding: '16px 18px',
                transition: 'border-color 0.2s, box-shadow 0.2s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#C8C4FF';
                e.currentTarget.style.boxShadow = '0 2px 12px rgba(108,99,255,0.08)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = '#E0E0E8';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                <span
                  style={{
                    fontFamily: "'Sora', sans-serif",
                    fontWeight: 600,
                    fontSize: 13,
                    color: '#0A0A0F',
                    maxWidth: '60%',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                  title={topic}
                >
                  {topic}
                </span>
                <span
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 4,
                    background: config.bg,
                    color: config.color,
                    borderRadius: 999,
                    padding: '2px 10px',
                    fontFamily: "'DM Mono', monospace",
                    fontSize: 10,
                    fontWeight: 500,
                    textTransform: 'capitalize',
                  }}
                >
                  {config.icon} {insight.predicted_type}
                </span>
              </div>
              <div>
                {insight.confidence && Object.entries(insight.confidence).map(([type, conf]) => {
                  const c = typeConfigs[type] || typeConfigs.theory;
                  return <ConfidenceBar key={type} label={type} value={conf} color={c.color} />;
                })}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
