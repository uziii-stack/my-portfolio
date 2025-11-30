import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const GREETINGS = [
  "Hello",
  "سلام",
  "Hola",
  "Bonjour",
  "नमस्ते",
  "Привет",
  "こんにちは",
];

export default function IntroAnimation({ onFinish }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showWhite, setShowWhite] = useState(false);

  useEffect(() => {
    if (currentIndex < GREETINGS.length) {
      const timer = setTimeout(() => setCurrentIndex((prev) => prev + 1), 300); // show each greeting 0.8s
      return () => clearTimeout(timer);
    } else {
      // After all greetings, show white flash
      const flashTimer = setTimeout(() => setShowWhite(true), 400);
      const finishTimer = setTimeout(() => {
        setShowWhite(false);
        onFinish && onFinish();
      }, 600);
      return () => {
        clearTimeout(flashTimer);
        clearTimeout(finishTimer);
      };
    }
  }, [currentIndex, onFinish]);

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black z-[9999] flex items-center justify-center"
        initial={{ opacity: 1 }}
        exit={{ opacity: 0, transition: { duration: 0.4 } }}
      >
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="text-white font-bold text-4xl sm:text-5xl md:text-6xl"
        >
          {currentIndex < GREETINGS.length ? GREETINGS[currentIndex] : null}
        </motion.div>

        {showWhite && (
          <motion.div
            className="fixed inset-0 bg-white"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.08 }}
          />
        )}
      </motion.div>
    </AnimatePresence>
  );
}
