/** Generic shimmer placeholder that mirrors a card's shape. */
export default function SkeletonCard({ height = 120, style = {} }) {
  return (
    <div
      className="shimmer"
      style={{
        borderRadius: 16,
        height,
        width: '100%',
        ...style,
      }}
    />
  );
}
