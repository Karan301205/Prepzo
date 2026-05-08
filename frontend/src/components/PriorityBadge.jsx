export default function PriorityBadge({ priority }) {
  const configs = {
    must: { bg: '#FEF0EE', border: '#E8341C', text: '#E8341C', label: '🔴 Must' },
    should: { bg: '#FFF8E7', border: '#D4910A', text: '#D4910A', label: '🟡 Should' },
    optional: { bg: '#F5F5F5', border: '#D0D0D8', text: '#6B6B80', label: '⚪ Optional' },
  };

  const config = configs[priority] || configs.should;

  return (
    <span
      style={{
        display: 'inline-block',
        background: config.bg,
        border: `1px solid ${config.border}`,
        color: config.text,
        borderRadius: 999,
        padding: '3px 10px',
        fontFamily: "'DM Mono', monospace",
        fontSize: 11,
        letterSpacing: '0.04em',
        textTransform: 'capitalize',
      }}
    >
      {config.label}
    </span>
  );
}
