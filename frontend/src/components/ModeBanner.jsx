export default function ModeBanner({ mode }) {
  const configs = {
    survival: {
      color: '#E8341C',
      icon: '🔥',
      text: '3 days or less — High-impact topics only. No fluff.',
    },
    balanced: {
      color: '#D4910A',
      icon: '⚡',
      text: '4–7 days — Smart coverage across priority topics.',
    },
    full: {
      color: '#0D9E6E',
      icon: '🎯',
      text: '7+ days — Comprehensive preparation. Own the exam.',
    },
  };

  const config = configs[mode] || configs.balanced;

  return (
    <div
      style={{
        borderLeft: `4px solid ${config.color}`,
        borderRadius: 12,
        background: `${config.color}11`,
        padding: '14px 18px',
        display: 'flex',
        alignItems: 'flex-start',
        gap: 12,
        marginBottom: 32,
      }}
    >
      <span style={{ fontSize: 20, flexShrink: 0, marginTop: 1 }}>{config.icon}</span>
      <span
        style={{
          fontFamily: "'Sora', sans-serif",
          fontSize: 14,
          color: '#0A0A0F',
          lineHeight: 1.5,
        }}
      >
        {config.text}
      </span>
    </div>
  );
}
