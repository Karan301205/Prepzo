/**
 * Skeleton for the ML insights panels (clustering & pattern analysis)
 * that appear after PDF upload. Prevents layout shift.
 */
export default function SkeletonInsights() {
  return (
    <div
      style={{
        background: '#FFFFFF',
        border: '1.5px solid #E0E0E8',
        borderRadius: 16,
        padding: '24px 28px',
        marginBottom: 24,
      }}
    >
      <div className="shimmer" style={{ height: 11, width: 220, borderRadius: 4, marginBottom: 6 }} />
      <div className="shimmer" style={{ height: 13, width: 300, borderRadius: 4, marginBottom: 20 }} />

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
          gap: 12,
        }}
      >
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            style={{
              background: '#FAFAFF',
              border: '1px solid #E0E0E8',
              borderRadius: 12,
              padding: 16,
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
              <div className="shimmer" style={{ height: 14, width: '55%', borderRadius: 4 }} />
              <div className="shimmer" style={{ height: 18, width: '30%', borderRadius: 999 }} />
            </div>
            <div className="shimmer" style={{ height: 5, borderRadius: 3, marginBottom: 8 }} />
            <div className="shimmer" style={{ height: 5, borderRadius: 3, marginBottom: 8 }} />
            <div className="shimmer" style={{ height: 5, borderRadius: 3 }} />
          </div>
        ))}
      </div>
    </div>
  );
}
