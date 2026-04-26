'use client';

import { useProgress } from "@react-three/drei";
import { useEffect, useRef, useState } from "react";

const CinematicOverlay = () => {
  const topRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const { progress } = useProgress();
  const [opened, setOpened] = useState(false);

  useEffect(() => {
    if (progress === 100 && !opened) {
      setOpened(true);
      setTimeout(() => {
        topRef.current?.classList.add('open');
        bottomRef.current?.classList.add('open');
      }, 1500);
    }
  }, [progress, opened]);

  return (
    <>
      <div className="vignette" />
      <div ref={topRef} className="letterbox-top" />
      <div ref={bottomRef} className="letterbox-bottom" />
    </>
  );
};

export default CinematicOverlay;
