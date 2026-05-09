/** Mimics a QuestionCard during plan-load skeleton state. */
export default function SkeletonQuestion() {
  return (
    <div
      style={{
        background: '#FFFFFF',
        border: '1.5px solid #E0E0E8',
        borderRadius: 16,
        padding: '24px 28px',
        marginBottom: 16,
      }}
    >
      <div style={{ display: 'flex', gap: 8, marginBottom: 14 }}>
        <div className="shimmer" style={{ width: 64, height: 22, borderRadius: 999 }} />
        <div className="shimmer" style={{ width: 52, height: 22, borderRadius: 999 }} />
        <div className="shimmer" style={{ width: 72, height: 22, borderRadius: 999 }} />
      </div>
      <div className="shimmer" style={{ height: 16, borderRadius: 6, marginBottom: 8, width: '90%' }} />
      <div className="shimmer" style={{ height: 16, borderRadius: 6, marginBottom: 20, width: '70%' }} />
      <div className="shimmer" style={{ height: 6, borderRadius: 4 }} />
    </div>
  );
}
