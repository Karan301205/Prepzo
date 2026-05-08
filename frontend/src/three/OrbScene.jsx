import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';

function PulsingOrb() {
  const meshRef = useRef();

  useFrame(({ clock }) => {
    if (meshRef.current) {
      const s = 1 + 0.05 * Math.sin(clock.getElapsedTime() * 2);
      meshRef.current.scale.set(s, s, s);
    }
  });

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[1, 32, 32]} />
      <meshStandardMaterial
        color="#6C63FF"
        emissive="#6C63FF"
        emissiveIntensity={0.6}
        transparent
        opacity={0.85}
      />
    </mesh>
  );
}

export default function OrbScene() {
  return (
    <div
      style={{
        width: 200,
        height: 200,
        borderRadius: '50%',
        boxShadow: '0 0 60px #6C63FF44',
        overflow: 'hidden',
      }}
    >
      <Canvas
        camera={{ position: [0, 0, 3], fov: 50 }}
        gl={{ alpha: true }}
        style={{ background: 'transparent' }}
      >
        <ambientLight intensity={0.4} />
        <pointLight position={[3, 3, 3]} intensity={1} color="#6C63FF" />
        <PulsingOrb />
      </Canvas>
    </div>
  );
}
