import React, { useEffect, useState, useRef } from "react";
import { FiArrowUp } from "react-icons/fi";
import { useLocation } from "react-router-dom";

export default function ScrollToTop() {
  const [visible, setVisible] = useState(false);
  const lastScrollY = useRef(0);
  const timerId = useRef(null);
  const location = useLocation();

  useEffect(() => {
    setVisible(false);
  }, [location.pathname]);

  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY;

      // Show when scrolled down more than 200px
      if (currentY > 200) {
        if (currentY > lastScrollY.current) {
          // Scrolling down
          setVisible(true);
        } else {
          // Scrolling up but still far down
          setVisible(true);
        }

        // Reset inactivity hide timer
        if (timerId.current) clearTimeout(timerId.current);
        timerId.current = setTimeout(() => {
          setVisible(false);
        }, 3500);
      } else {
        setVisible(false);
      }

      lastScrollY.current = currentY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (timerId.current) clearTimeout(timerId.current);
    };
  }, []);

  const handleScrollTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <button
      onClick={handleScrollTop}
      aria-label="Scroll to Top"
      className={`fixed bottom-6 left-6 z-[9999] p-3.5 sm:p-4 bg-emerald-500/10 hover:bg-emerald-500/20 active:bg-emerald-500/30 backdrop-blur-xl rounded-full border border-emerald-500/30 shadow-lg shadow-emerald-500/10 transition-all duration-300 hover:scale-110 ${
        visible ? "opacity-100 translate-y-0 pointer-events-auto" : "opacity-0 translate-y-8 pointer-events-none"
      }`}
    >
      <FiArrowUp className="text-emerald-400 text-xl sm:text-2xl" />
    </button>
  );
}
