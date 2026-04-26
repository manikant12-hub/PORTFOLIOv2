'use client';

import { useEffect, useRef } from 'react';
import { isMobile } from 'react-device-detect';

const CursorGlow = () => {
  const glowRef = useRef<HTMLDivElement>(null);
  const outerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isMobile) return;

    const glow = glowRef.current;
    const outer = outerRef.current;
    if (!glow || !outer) return;

    let mouseX = 0;
    let mouseY = 0;
    let outerX = 0;
    let outerY = 0;

    const onMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      glow.style.left = `${mouseX}px`;
      glow.style.top = `${mouseY}px`;
    };

    const animate = () => {
      outerX += (mouseX - outerX) * 0.12;
      outerY += (mouseY - outerY) * 0.12;
      outer.style.left = `${outerX}px`;
      outer.style.top = `${outerY}px`;
      requestAnimationFrame(animate);
    };

    window.addEventListener('mousemove', onMouseMove);
    const raf = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  if (isMobile) return null;

  return (
    <>
      <div ref={glowRef} className="cursor-glow" />
      <div ref={outerRef} className="cursor-glow-outer" />
    </>
  );
};

export default CursorGlow;
