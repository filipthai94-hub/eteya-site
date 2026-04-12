"use client";
import React, { useState, useEffect, useId, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";

export const LayoutTextFlip = ({
  text = "",
  words = ["Landing Pages", "Component Blocks", "Page Sections", "3D Shaders"],
  duration = 3000,
}: {
  text?: string;
  words: string[];
  duration?: number;
}) => {
  const id = useId();
  const [currentIndex, setCurrentIndex] = useState(0);
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % words.length);
    }, duration);

    return () => clearInterval(intervalId);
  }, [words.length, duration]);

  return (
    <motion.span
      layout
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        transform: 'translateY(4%)',
        fontFamily: 'var(--font-display)',
        color: '#080808',
        background: 'linear-gradient(180deg, #FFFFFF 0%, #F5F5F7 15%, #EBEBEF 50%, #DCDCE2 85%, #D4D4DC 100%), radial-gradient(circle at 50% 0%, rgba(255, 255, 255, 0.8) 0%, transparent 60%)',
        letterSpacing: '-0.04em',
        border: '1px solid rgba(235, 235, 240, 0.9)',
        boxShadow: '0 18px 55px rgba(0, 0, 0, 0.58), 0 9px 25px rgba(0, 0, 0, 0.38), 0 3px 10px rgba(0, 0, 0, 0.28), 0 0 2px rgba(255, 255, 255, 0.6), inset 0 2px 5px rgba(255, 255, 255, 1), inset 0 -3px 7px rgba(0, 0, 0, 0.14), inset 4px 0 9px rgba(0, 0, 0, 0.05), inset -4px 0 9px rgba(0, 0, 0, 0.05)',
        padding: '0.05rem 2rem',
        borderRadius: '12px',
        fontWeight: '600',
        textShadow: '0 1px 0 rgba(255, 255, 255, 0.3)',
      }}
      className="relative inline-flex rounded-2xl text-center text-[clamp(1.7rem,10.5vw,4.3rem)] font-[800] uppercase"
      key={words[currentIndex]}
    >
      <AnimatePresence mode="popLayout">
        <motion.div
          key={currentIndex}
          ref={textRef}
          layoutId={`word-${words[currentIndex]}-${id}`}
          className="inline-flex items-center justify-center"
          style={{ transition: 'opacity 0.3s ease' }}
        >
          {words[currentIndex].split('').map((letter, index) => (
            <motion.span
              key={index}
              initial={{ opacity: 0, filter: 'blur(10px)' }}
              animate={{ opacity: 1, filter: 'blur(0px)' }}
              transition={{ delay: index * 0.02 }}
              style={{ letterSpacing: '-0.04em' }}
            >
              {letter}
            </motion.span>
          ))}
        </motion.div>
      </AnimatePresence>
    </motion.span>
  );
};