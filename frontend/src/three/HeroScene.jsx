import { useRef, useMemo, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

const coinPositions = [
  [3, 2, -1],
  [4, -1, 0],
  [-3, 1, -2],
  [1, 3, 0],
  [-2, -2, 1],
  [5, 0, -3],
];

function Coin({ position, index }) {
  const meshRef = useRef();
  const baseY = position[1];
  const speedX = 0.004 + index * 0.001;
  const speedY = 0.003 + index * 0.0008;

  useFrame(({ clock }) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += speedX;
      meshRef.current.rotation.y += speedY;
      meshRef.current.position.y = baseY + Math.sin(clock.getElapsedTime() + index) * 0.2;
    }
  });

  return (
    <mesh ref={meshRef} position={position}>
      <cylinderGeometry args={[1.2, 1.2, 0.15, 64]} />
      <meshStandardMaterial
        color="#A09AFF"
        metalness={0.6}
        roughness={0.2}
      />
    </mesh>
  );
}

function CoinGroup() {
  const groupRef = useRef();
  const mouse = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      mouse.current.x = (e.clientX / window.innerWidth - 0.5) * 2;
      mouse.current.y = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.rotation.y = THREE.MathUtils.lerp(
        groupRef.current.rotation.y,
        mouse.current.x * 0.1,
        0.03
      );
      groupRef.current.rotation.x = THREE.MathUtils.lerp(
        groupRef.current.rotation.x,
        mouse.current.y * 0.1,
        0.03
      );
    }
  });

  return (
    <group ref={groupRef}>
      {coinPositions.map((pos, i) => (
        <Coin key={i} position={pos} index={i} />
      ))}
    </group>
  );
}

export default function HeroScene() {
  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        zIndex: 0,
        background: 'linear-gradient(135deg, #F0EEFF 0%, #F5F5F5 60%, #EEF0FF 100%)',
      }}
    >
      <Canvas
        camera={{ position: [0, 0, 8], fov: 45 }}
        gl={{ alpha: true, antialias: true }}
        style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}
      >
        <ambientLight intensity={0.8} color="#F0EEFF" />
        <directionalLight position={[5, 5, 5]} intensity={1.2} color="#FFFFFF" />
        <pointLight position={[-3, 2, 2]} intensity={0.6} color="#8B80FF" />
        <CoinGroup />
      </Canvas>
    </div>
  );
}
