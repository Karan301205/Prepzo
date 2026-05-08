

export default function TopicChip({ label, onRemove }) {
  return (
    <div
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
        gap: 6,
        margin: '0 6px 6px 0',
      }}
    >
      <span>{label}</span>
      <button
        onClick={onRemove}
        style={{
          background: 'none',
          border: 'none',
          color: '#4A44AA',
          cursor: 'pointer',
          padding: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          opacity: 0.6,
        }}
        onMouseEnter={(e) => (e.target.style.opacity = 1)}
        onMouseLeave={(e) => (e.target.style.opacity = 0.6)}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </button>
    </div>
  );
}
