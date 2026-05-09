/**
 * Reusable error banner with an optional retry button.
 * Keeps error UX consistent across all pages.
 */
export default function ErrorState({ message, onRetry, icon = '⚠️' }) {
  return (
    <div
      style={{
        background: '#FEF0EE',
        border: '1px solid #E8341C',
        borderRadius: 12,
        padding: '16px 20px',
        display: 'flex',
        alignItems: 'flex-start',
        gap: 12,
        marginBottom: 24,
      }}
    >
      <span style={{ fontSize: 18, flexShrink: 0 }}>{icon}</span>
      <div style={{ flex: 1, minWidth: 0 }}>
        <p
          style={{
            fontFamily: "'Sora', sans-serif",
            fontSize: 14,
            color: '#E8341C',
            lineHeight: 1.5,
            marginBottom: onRetry ? 10 : 0,
            wordBreak: 'break-word',
          }}
        >
          {message}
        </p>
        {onRetry && (
          <button
            onClick={onRetry}
            style={{
              background: 'none',
              border: '1px solid #E8341C',
              borderRadius: 999,
              padding: '5px 14px',
              fontFamily: "'Sora', sans-serif",
              fontSize: 12,
              color: '#E8341C',
              cursor: 'pointer',
              transition: 'background 0.2s',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = '#FEF0EE')}
            onMouseLeave={(e) => (e.currentTarget.style.background = 'none')}
          >
            Try Again
          </button>
        )}
      </div>
    </div>
  );
}
