import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';

function Orb({ position, index }) {
  const meshRef = useRef();

  useFrame(({ clock }) => {
    if (meshRef.current) {
      const t = clock.getElapsedTime() + index * 1.5;
      meshRef.current.position.x = position[0] + Math.sin(t * 0.3) * 0.4;
      meshRef.current.position.y = position[1] + Math.cos(t * 0.25) * 0.3;
    }
  });

  return (
    <mesh ref={meshRef} position={position}>
      <sphereGeometry args={[0.3, 16, 16]} />
      <meshStandardMaterial
        color="#D0CEFF"
        transparent
        opacity={0.4}
      />
    </mesh>
  );
}

const orbPositions = [
  [-3, 2, -1],
  [3, -1.5, 0],
  [-2, -2, -2],
  [4, 1, -1],
  [0, 3, -2],
  [-4, 0, -1],
  [2, -3, 0],
  [1, 1.5, -3],
];

export default function FloatingOrbs() {
  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 0,
        pointerEvents: 'none',
        opacity: 0.6,
      }}
    >
      <Canvas camera={{ position: [0, 0, 6], fov: 50 }} gl={{ alpha: true }}>
        <ambientLight intensity={1} />
        {orbPositions.map((pos, i) => (
          <Orb key={i} position={pos} index={i} />
        ))}
      </Canvas>
    </div>
  );
}
