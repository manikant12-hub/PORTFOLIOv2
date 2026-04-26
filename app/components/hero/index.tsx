'use client';

import { PointMaterial, Points, Text, useProgress } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import gsap from "gsap";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import CloudContainer from "../models/Cloud";
import FloatingObjects from "../models/FloatingObjects";
import StarsContainer from "../models/Stars";
import WindowModel from "../models/WindowModel";
import TextWindow from "./TextWindow";

// Foreground stardust particles that float past the camera
const StarDust = () => {
  const ref = useRef<THREE.Points>(null);

  const positions = useMemo(() => {
    const pos = new Float32Array(300 * 3);
    for (let i = 0; i < 300; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 20;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 20;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 15 - 2;
    }
    return pos;
  }, []);

  useFrame(({ clock }) => {
    if (ref.current) {
      ref.current.rotation.y = clock.elapsedTime * 0.01;
      ref.current.rotation.x = Math.sin(clock.elapsedTime * 0.02) * 0.05;
    }
  });

  return (
    <Points ref={ref} positions={positions} stride={3}>
      <PointMaterial
        transparent
        color="#d4d4ff"
        size={0.02}
        sizeAttenuation
        depthWrite={false}
        opacity={0.6}
      />
    </Points>
  );
};

// Pulsing backlight behind the hero name
const HeroBacklight = () => {
  const lightRef = useRef<THREE.PointLight>(null);

  useFrame(({ clock }) => {
    if (lightRef.current) {
      lightRef.current.intensity = 8 + Math.sin(clock.elapsedTime * 0.8) * 4;
    }
  });

  return (
    <pointLight
      ref={lightRef}
      position={[0, 2, -8]}
      color="#6366f1"
      intensity={8}
      distance={25}
      decay={2}
    />
  );
};

const Hero = () => {
  const titleRef = useRef<THREE.Mesh>(null);
  const taglineRef = useRef<THREE.Mesh>(null);
  const heroGroupRef = useRef<THREE.Group>(null);
  const { progress } = useProgress();
  const { camera } = useThree();
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    if (progress === 100 && !hasAnimated) {
      setHasAnimated(true);

      // Cinematic camera dolly — start pulled back and sweep in
      gsap.fromTo(camera.position,
        { z: 12 },
        { z: 5, duration: 4, ease: "power2.out" }
      );

      // Title: dramatic scale-up entrance from tiny + slide up
      if (titleRef.current) {
        gsap.fromTo(titleRef.current.scale,
          { x: 0.3, y: 0.3, z: 0.3 },
          { x: 1, y: 1, z: 1, duration: 3, ease: "power3.out", delay: 0.5 }
        );
        gsap.fromTo(titleRef.current.position,
          { y: -4 },
          { y: 0, duration: 3, ease: "power3.out", delay: 0.5 }
        );
        gsap.fromTo(titleRef.current,
          { fillOpacity: 0 },
          { fillOpacity: 1, duration: 2, delay: 0.8 }
        );
      }

      // Tagline: fade in after title lands
      if (taglineRef.current) {
        gsap.fromTo(taglineRef.current,
          { fillOpacity: 0 },
          { fillOpacity: 1, duration: 2.5, delay: 2.5, ease: "power2.inOut" }
        );
        gsap.fromTo(taglineRef.current.position,
          { y: 0.2 },
          { y: 0.6, duration: 2, delay: 2.5, ease: "power2.out" }
        );
      }

      // Whole hero group subtle float-in
      if (heroGroupRef.current) {
        gsap.fromTo(heroGroupRef.current.rotation,
          { y: -0.08 },
          { y: 0, duration: 4, ease: "power2.out" }
        );
      }
    }
  }, [progress, hasAnimated, camera]);

  const fontProps = {
    font: "./soria-font.ttf",
    fontSize: 1.2,
  };

  return (
    <>
      <group ref={heroGroupRef}>
        <Text
          position={[0, 2, -10]}
          {...fontProps}
          ref={titleRef}
          fillOpacity={0}
        >
          Hi, I am Manikant Hosur.
        </Text>
        <Text
          position={[0, 0.2, -10]}
          font="./Vercetti-Regular.woff"
          fontSize={0.3}
          color="#a5b4fc"
          anchorX="center"
          anchorY="top"
          fillOpacity={0}
          ref={taglineRef}
        >
          Engineering Intelligence. Automating the Future.
        </Text>
        <HeroBacklight />
      </group>

      <StarDust />
      <StarsContainer />
      <CloudContainer/>
      <FloatingObjects />
      <group position={[0, -25, 5.69]}>
        <pointLight castShadow position={[1, 1, -2.5]} intensity={60} distance={10}/>
        <WindowModel receiveShadow/>
        <TextWindow/>
      </group>
    </>
  );
};

export default Hero;
