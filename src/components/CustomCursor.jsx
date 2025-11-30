import React, { useEffect, useRef } from "react";

export default function CustomCursor() {
  const cursorRef = useRef(null);
  const rafRef = useRef(null);

  useEffect(() => {
    const moveHandler = (e) => {
      if (!cursorRef.current) return;
      const x = e.clientX - 40;
      const y = e.clientY - 40;

      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(() => {
        cursorRef.current.style.transform = `translate(${x}px, ${y}px)`;
      });
    };

    window.addEventListener("mousemove", moveHandler);
    return () => {
      window.removeEventListener("mousemove", moveHandler);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <div ref={cursorRef} className="pointer-events-none fixed top-0 left-0 z-999">
      <div
        className="w-20 h-20 rounded-full bg-linear-to-r from-pink-500 to-blue-500 blur-3xl opacity-80"
      />
    </div>
  );
}
