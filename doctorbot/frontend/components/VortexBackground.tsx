"use client";

import { useRef, useMemo, useEffect, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

const PARTICLE_COUNT = 600;
const REDUCED_PARTICLE_COUNT = 250;

function Particles({ count }: { count: number }) {
  const meshRef = useRef<THREE.Points>(null);

  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2;
      const radius = 1.5 + Math.random() * 5;
      pos[i * 3] = Math.cos(theta) * radius;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 8;
      pos[i * 3 + 2] = Math.sin(theta) * radius;
    }
    return pos;
  }, [count]);

  const colors = useMemo(() => {
    const col = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const roll = Math.random();
      if (roll < 0.5) {
        // Amber/warm — dominant
        col[i * 3] = 0.7 + Math.random() * 0.13;
        col[i * 3 + 1] = 0.55 + Math.random() * 0.1;
        col[i * 3 + 2] = 0.35 + Math.random() * 0.1;
      } else if (roll < 0.8) {
        // TARDIS blue — cool accent
        col[i * 3] = 0.05 + Math.random() * 0.1;
        col[i * 3 + 1] = 0.25 + Math.random() * 0.15;
        col[i * 3 + 2] = 0.5 + Math.random() * 0.2;
      } else {
        // Faint white/silver
        const v = 0.5 + Math.random() * 0.3;
        col[i * 3] = v;
        col[i * 3 + 1] = v;
        col[i * 3 + 2] = v + 0.05;
      }
    }
    return col;
  }, [count]);

  useFrame((_, delta) => {
    if (!meshRef.current) return;
    meshRef.current.rotation.y += delta * 0.08;
    const pos = meshRef.current.geometry.attributes.position.array as Float32Array;
    for (let i = 0; i < count; i++) {
      pos[i * 3 + 1] += delta * (0.06 + Math.random() * 0.03);
      if (pos[i * 3 + 1] > 4) pos[i * 3 + 1] = -4;
    }
    meshRef.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={meshRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.03} vertexColors transparent opacity={0.5} sizeAttenuation />
    </points>
  );
}

export default function VortexBackground() {
  const [reducedMotion, setReducedMotion] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setReducedMotion(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
    setIsMobile(window.innerWidth < 768);

    let resizeTimer: ReturnType<typeof setTimeout>;
    const handleResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        setIsMobile(window.innerWidth < 768);
      }, 300);
    };
    window.addEventListener("resize", handleResize);
    return () => {
      clearTimeout(resizeTimer);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  if (reducedMotion) {
    return (
      <div
        className="fixed inset-0 -z-10"
        style={{
          background: "radial-gradient(ellipse at 30% 40%, rgba(11,18,33,1) 0%, rgba(7,11,20,1) 70%)",
        }}
      />
    );
  }

  const count = isMobile ? REDUCED_PARTICLE_COUNT : PARTICLE_COUNT;

  return (
    <div className="fixed inset-0 -z-10">
      {/* Deep space gradient base */}
      <div
        className="absolute inset-0"
        style={{
          background: "radial-gradient(ellipse at 25% 35%, rgba(0,59,111,0.08) 0%, rgba(7,11,20,1) 65%)",
        }}
      />
      <Canvas camera={{ position: [0, 0, 6], fov: 55 }}>
        <Particles count={count} />
      </Canvas>
    </div>
  );
}
