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
        background: `${config.color}11`, // 7% opacity via hex is roughly 11
        padding: '16px 20px',
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        marginBottom: 32,
      }}
    >
      <span style={{ fontSize: 20 }}>{config.icon}</span>
      <span
        style={{
          fontFamily: "'Sora', sans-serif",
          fontSize: 15,
          color: '#0A0A0F',
        }}
      >
        {config.text}
      </span>
    </div>
  );
}
