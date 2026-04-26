'use client';

import { Float, Sphere } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";

// A mini planet with a glowing atmosphere ring
const Planet = ({ position, size, color, ringColor, speed }: {
  position: [number, number, number]; size: number; color: string; ringColor: string; speed: number;
}) => {
  const groupRef = useRef<THREE.Group>(null);
  const ringRef = useRef<THREE.Mesh>(null);

  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * speed;
    }
    if (ringRef.current) {
      ringRef.current.rotation.x += delta * 0.15;
    }
  });

  return (
    <Float speed={0.8} rotationIntensity={0.1} floatIntensity={0.5}>
      <group ref={groupRef} position={position}>
        <Sphere args={[size, 32, 32]}>
          <meshStandardMaterial color={color} roughness={0.6} metalness={0.3} />
        </Sphere>
        {/* Atmosphere glow */}
        <Sphere args={[size * 1.15, 32, 32]}>
          <meshBasicMaterial color={color} transparent opacity={0.08} side={THREE.BackSide} />
        </Sphere>
        {/* Saturn-style ring */}
        <mesh ref={ringRef} rotation={[Math.PI / 3, 0.2, 0]}>
          <torusGeometry args={[size * 1.8, size * 0.08, 2, 64]} />
          <meshBasicMaterial color={ringColor} transparent opacity={0.4} side={THREE.DoubleSide} />
        </mesh>
      </group>
    </Float>
  );
};

// Orbiting moons around a center point
const OrbitingMoons = ({ position, radius, count, speed }: {
  position: [number, number, number]; radius: number; count: number; speed: number;
}) => {
  const groupRef = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = clock.elapsedTime * speed;
      groupRef.current.rotation.x = Math.sin(clock.elapsedTime * 0.3) * 0.2;
    }
  });

  const moons = useMemo(() => {
    return Array.from({ length: count }, (_, i) => {
      const angle = (i / count) * Math.PI * 2;
      return {
        x: Math.cos(angle) * radius,
        z: Math.sin(angle) * radius,
        size: 0.04 + Math.random() * 0.06,
      };
    });
  }, [count, radius]);

  return (
    <group position={position} ref={groupRef}>
      {moons.map((moon, i) => (
        <Sphere key={i} args={[moon.size, 12, 12]} position={[moon.x, 0, moon.z]}>
          <meshBasicMaterial color="#e2e8f0" transparent opacity={0.7} />
        </Sphere>
      ))}
    </group>
  );
};

// A galaxy spiral made of tiny points
const GalaxySpiral = ({ position, scale }: { position: [number, number, number]; scale: number }) => {
  const pointsRef = useRef<THREE.Points>(null);

  const geometry = useMemo(() => {
    const positions = [];
    const cols = [];
    const arms = 3;
    const particlesPerArm = 200;

    for (let a = 0; a < arms; a++) {
      const armAngleOffset = (a / arms) * Math.PI * 2;
      for (let i = 0; i < particlesPerArm; i++) {
        const t = i / particlesPerArm;
        const dist = t * 2;
        const angle = armAngleOffset + t * 4;
        const spread = 0.15 * t;

        positions.push(
          Math.cos(angle) * dist + (Math.random() - 0.5) * spread,
          (Math.random() - 0.5) * 0.1 * t,
          Math.sin(angle) * dist + (Math.random() - 0.5) * spread
        );

        const brightness = 1 - t * 0.5;
        if (a === 0) cols.push(0.6 * brightness, 0.5 * brightness, 1.0 * brightness);
        else if (a === 1) cols.push(1.0 * brightness, 0.6 * brightness, 0.7 * brightness);
        else cols.push(0.5 * brightness, 0.9 * brightness, 1.0 * brightness);
      }
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    geo.setAttribute('color', new THREE.Float32BufferAttribute(cols, 3));
    return geo;
  }, []);

  useFrame((_, delta) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y += delta * 0.08;
    }
  });

  return (
    <points ref={pointsRef} geometry={geometry} position={position} scale={scale}>
      <pointsMaterial size={0.03} vertexColors transparent opacity={0.8} sizeAttenuation />
    </points>
  );
};

// Shooting star / meteor that flies across the scene
const ShootingStar = ({ delay }: { delay: number }) => {
  const ref = useRef<THREE.Mesh>(null);
  const trailRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (ref.current && trailRef.current) {
      const t = ((clock.elapsedTime + delay) % 8) / 8;
      const x = -10 + t * 20;
      const y = 6 - t * 4 + Math.sin(t * 3) * 0.5;
      const z = -8 - Math.random() * 0.01;
      ref.current.position.set(x, y, z);
      trailRef.current.position.set(x - 0.3, y + 0.1, z);
      const opacity = t < 0.1 ? t * 10 : t > 0.7 ? (1 - t) * 3.3 : 1;
      (ref.current.material as THREE.MeshBasicMaterial).opacity = opacity * 0.9;
      (trailRef.current.material as THREE.MeshBasicMaterial).opacity = opacity * 0.3;
    }
  });

  return (
    <>
      <mesh ref={ref}>
        <sphereGeometry args={[0.04, 8, 8]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.9} />
      </mesh>
      <mesh ref={trailRef} rotation={[0, 0, Math.PI / 6]}>
        <planeGeometry args={[0.6, 0.015]} />
        <meshBasicMaterial color="#a5b4fc" transparent opacity={0.3} side={THREE.DoubleSide} />
      </mesh>
    </>
  );
};

// Nebula cloud — a glowing transparent sphere cluster
const Nebula = ({ position, color, size }: {
  position: [number, number, number]; color: string; size: number;
}) => {
  const ref = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (ref.current) {
      ref.current.rotation.y = clock.elapsedTime * 0.02;
      const s = size + Math.sin(clock.elapsedTime * 0.5) * size * 0.1;
      ref.current.scale.set(s, s, s);
    }
  });

  return (
    <group ref={ref} position={position}>
      <Sphere args={[1, 16, 16]}>
        <meshBasicMaterial color={color} transparent opacity={0.04} side={THREE.DoubleSide} />
      </Sphere>
      <Sphere args={[0.7, 16, 16]} position={[0.3, 0.2, -0.1]}>
        <meshBasicMaterial color={color} transparent opacity={0.06} side={THREE.DoubleSide} />
      </Sphere>
      <Sphere args={[0.5, 16, 16]} position={[-0.2, -0.1, 0.3]}>
        <meshBasicMaterial color={color} transparent opacity={0.05} side={THREE.DoubleSide} />
      </Sphere>
    </group>
  );
};

// Constellation — connected star dots
const Constellation = ({ position, scale }: { position: [number, number, number]; scale: number }) => {
  const groupRef = useRef<THREE.Group>(null);

  const { stars, lines } = useMemo(() => {
    const pts: [number, number, number][] = [
      [0, 0, 0], [0.5, 0.8, 0], [1.2, 0.6, 0], [1.8, 1.2, 0],
      [0.3, -0.5, 0], [1.0, -0.3, 0], [1.6, 0.1, 0],
    ];
    const connections = [[0,1],[1,2],[2,3],[0,4],[4,5],[5,6],[6,2]];
    const lineGeos = connections.map(([a, b]) => {
      const geo = new THREE.BufferGeometry();
      geo.setAttribute('position', new THREE.Float32BufferAttribute([
        ...pts[a], ...pts[b]
      ], 3));
      return geo;
    });
    return { stars: pts, lines: lineGeos };
  }, []);

  useFrame(({ clock }) => {
    if (groupRef.current) {
      groupRef.current.rotation.z = Math.sin(clock.elapsedTime * 0.1) * 0.05;
    }
  });

  return (
    <group ref={groupRef} position={position} scale={scale}>
      {stars.map((pos, i) => (
        <Sphere key={i} args={[0.03, 8, 8]} position={pos}>
          <meshBasicMaterial color="#ffffff" transparent opacity={0.8} />
        </Sphere>
      ))}
      {lines.map((geo, i) => (
        <lineSegments key={`l${i}`} geometry={geo}>
          <lineBasicMaterial color="#ffffff" transparent opacity={0.15} />
        </lineSegments>
      ))}
    </group>
  );
};

const FloatingObjects = () => {
  return (
    <group>
      {/* Saturn-like planet near hero */}
      <Planet position={[-6, 3, -12]} size={0.6} color="#7c6faa" ringColor="#c4b5fd" speed={0.15} />

      {/* Small red planet */}
      <Planet position={[7, 0, -10]} size={0.35} color="#b45454" ringColor="#fca5a5" speed={0.25} />

      {/* Tiny ice planet far away */}
      <Planet position={[4, 5, -16]} size={0.2} color="#5eead4" ringColor="#99f6e4" speed={0.1} />

      {/* Galaxy spiral behind hero text */}
      <GalaxySpiral position={[0, 2, -14]} scale={1.8} />

      {/* Orbiting moons around the first planet */}
      <OrbitingMoons position={[-6, 3, -12]} radius={1.4} count={5} speed={0.3} />

      {/* Shooting stars */}
      <ShootingStar delay={0} />
      <ShootingStar delay={3} />
      <ShootingStar delay={5.5} />

      {/* Nebula clouds */}
      <Nebula position={[-8, -3, -14]} color="#8b5cf6" size={2} />
      <Nebula position={[9, 4, -18]} color="#06b6d4" size={1.5} />
      <Nebula position={[3, -8, -10]} color="#f472b6" size={1.2} />

      {/* Constellations */}
      <Constellation position={[-4, 5, -11]} scale={0.8} />
      <Constellation position={[5, -2, -13]} scale={0.6} />

      {/* Mid-scroll space objects */}
      <Planet position={[-5, -15, 2]} size={0.4} color="#4f46e5" ringColor="#818cf8" speed={0.2} />
      <GalaxySpiral position={[4, -20, -5]} scale={1} />
      <Nebula position={[6, -12, -3]} color="#a78bfa" size={1} />
    </group>
  );
};

export default FloatingObjects;
