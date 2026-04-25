'use client';

import React, { useEffect, useState } from 'react';

export default function CustomCursor() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [trailingPosition, setTrailingPosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Only run on non-touch devices
    if (window.matchMedia('(pointer: coarse)').matches) return;

    const handleMouseMove = (e: MouseEvent) => {
      setIsVisible(true);
      setPosition({ x: e.clientX, y: e.clientY });
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName.toLowerCase() === 'a' || target.tagName.toLowerCase() === 'button' || target.closest('a') || target.closest('button')) {
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);
    window.addEventListener('mouseover', handleMouseOver);

    // Initial position setup to avoid jump
    setTrailingPosition({ x: window.innerWidth / 2, y: window.innerHeight / 2 });

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('mouseover', handleMouseOver);
    };
  }, []);

  useEffect(() => {
    let animationFrameId: number;

    const updateTrailing = () => {
      setTrailingPosition(prev => {
        // Smooth easing for the trailing circle
        const dx = position.x - prev.x;
        const dy = position.y - prev.y;
        return {
          x: prev.x + dx * 0.15,
          y: prev.y + dy * 0.15
        };
      });
      animationFrameId = requestAnimationFrame(updateTrailing);
    };

    if (isVisible) {
      animationFrameId = requestAnimationFrame(updateTrailing);
    }

    return () => cancelAnimationFrame(animationFrameId);
  }, [position, isVisible]);

  if (!isVisible) return null;

  return (
    <>
      <div 
        className="custom-cursor-dot"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '8px',
          height: '8px',
          backgroundColor: 'var(--primary)',
          borderRadius: '50%',
          pointerEvents: 'none',
          transform: `translate3d(${position.x - 4}px, ${position.y - 4}px, 0)`,
          zIndex: 9999,
          boxShadow: '0 0 10px var(--primary)',
        }}
      />
      <div 
        className="custom-cursor-trail"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: isHovering ? '60px' : '36px',
          height: isHovering ? '60px' : '36px',
          border: `1px solid ${isHovering ? 'var(--accent)' : 'var(--primary)'}`,
          backgroundColor: isHovering ? 'rgba(221, 153, 51, 0.1)' : 'transparent',
          borderRadius: '50%',
          pointerEvents: 'none',
          transform: `translate3d(${trailingPosition.x - (isHovering ? 30 : 18)}px, ${trailingPosition.y - (isHovering ? 30 : 18)}px, 0)`,
          zIndex: 9998,
          transition: 'width 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275), height 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275), background-color 0.3s, border-color 0.3s',
        }}
      />
    </>
  );
}
