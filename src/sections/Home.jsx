import React, { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import ParticlesBackground from "../components/ParticlesBackground";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import avator from "../assets/avator.png";

const socials = [
  { Icon: FaLinkedin, label: "LinkedIn", href: "https://linkedin.com/in/uzair-baig-22b983385" },
  { Icon: FaGithub, label: "GitHub", href: "https://github.com/uziii-stack" },
];

const glowVariants = {
  initial: { scale: 1, y: 0, filter: "drop-shadow(0 0 0 rgba(0,0,0,0))" },
  hover: {
    scale: 1.2,
    y: -3,
    filter:
      "drop-shadow(0 0 8px rgba(13,88,204,0.9)) drop-shadow(0 0 18px rgba(16,185,129,0.8))",
    transition: { type: "spring", stiffness: 300, damping: 15 },
  },
  tap: { scale: 0.95, y: 0, transition: { duration: 0.08 } },
};

export default function Home() {
  const roles = useMemo(
    () => [
      "Frontend Engineer",
      "Full-Stack Ready",
      "React.js Expert",
      "Next.js Developer",
      "UI/UX Enthusiast",
      "Software Architect",
      "Database Schema",
    ],
    []
  );

  const [index, setIndex] = useState(0);
  const [subIndex, setSubIndex] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const current = roles[index];
    const timeout = setTimeout(() => {
      if (!deleting && subIndex < current.length) {
        setSubIndex((prev) => prev + 1);
      }

      else if (!deleting && subIndex === current.length) {
        setTimeout(() => setDeleting(true), 2000); // text deletion time
      }

      else if (deleting && subIndex > 0) {
        setSubIndex((prev) => prev - 1);
      }

      else if (deleting && subIndex === 0) {
        setDeleting(false);
        setIndex((prev) => (prev + 1) % roles.length);
      }

    }, deleting ? 40 : 120);

    return () => clearTimeout(timeout);
  }, [subIndex, deleting, index, roles]);

  return (
    <section id="home" className="w-full h-screen relative bg-black overflow-hidden">
      <ParticlesBackground />

      {/* Glow Blobs */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="
            absolute -top-32 -left-32
            w-[70vw] sm:w-[500vw] md:w-[40vw]
            h-[70vw] sm:h-[50vw] md:h-[40vw]
            max-w-[500px] max-h-[500px]
            rounded-full
            bg-gradient-to-r from-[#302b63] via-[#00bf8f] to-[#1cd8d2]
            opacity-30 sm:opacity-20 md:opacity-10
            blur-[100px] sm:blur-[130px] md:blur-[150px]
            animate-pulse
          "
        ></div>

        <div
          className="
            absolute bottom-0 right-0
            w-[70vw] sm:w-[500vw] md:w-[40vw]
            h-[70vw] sm:h-[50vw] md:h-[40vw]
            max-w-[500px] max-h-[500px]
            rounded-full
            bg-gradient-to-r from-[#302b63] via-[#00bf8f] to-[#1cd8d2]
            opacity-30 sm:opacity-20 md:opacity-10
            blur-[100px] sm:blur-[130px] md:blur-[150px]
            animate-pulse
          "
        ></div>
      </div>

      {/* Content */}
      <div className="relative z-10 h-full w-full max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-2">
        <div className="flex flex-col justify-center h-full text-center lg:text-left">
          <div className="w-full lg:pr-24 mx-auto max-w-[48rem]">

            {/* Typing Animation */}
            <motion.div
              className="mb-3 text-xl sm:text-2xl md:text-3xl font-semibold text-white tracking-wide min-h-[1.6em]"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <span>{roles[index].substring(0, subIndex)}</span>
              <span className="inline-block w-[2px] ml-1 bg-white animate-pulse align-middle"></span>
            </motion.div>

            {/* Title */}
            <motion.h1
              className="
                text-4xl sm:text-5xl md:text-6xl lg:text-6xl
                font-bold
                bg-gradient-to-r from-[#1cd8d2] via-[#00bf8f] to-[#302b63]
                bg-clip-text text-transparent
                mb-6
              "
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
            >
              Hello I'm
              <br />
              <span className="text-white font-bold text-5xl sm:text-6xl md:text-7xl lg:text-7xl">
                Uzair Baig
              </span>
            </motion.h1>

            {/* Description */}
            <motion.p
              className="mt-6 text-base sm:text-lg md:text-xl text-gray-300 max-w-2xl mx-auto lg:mx-0"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
            >
              I build fast, responsive, and modern web applications using{" "}
              <strong>React.js, Next.js, JS, WordPress</strong>. I focus on clean UI,
              smooth animations, and scalable code.
            </motion.p>

            {/* Buttons */}
            <motion.div
              className="mt-10 flex flex-wrap items-center justify-center gap-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.8 }}
            >
              {/* View Work */}
              <a
                href="#projects"
                className="px-6 py-3 rounded-full font-medium text-lg text-white bg-gradient-to-r from-[#1cd8d2] via-[#00bf8f] to-[#302b63] shadow-lg hover:scale-105 transition-all"
              >
                View My Work
              </a>

              {/* My Resume */}
              <a
                href="#"
                className="px-6 py-3 rounded-full text-lg text-black bg-white hover:bg-gray-200 shadow-lg hover:scale-105 transition-all"
              >
                My Resume
              </a>

              {/* ⭐ NEW CONTACT BUTTON (same style as Resume) */}
              <a
                href="#contact"
                className="px-6 py-3 rounded-full text-lg text-black bg-white hover:bg-gray-200 shadow-lg hover:scale-105 transition-all"
              >
                Contact Me
              </a>
            </motion.div>

            {/* Social Icons */}
            <div className="mt-10 flex gap-5 text-2xl justify-center lg:justify-start">
              {socials.map(({ Icon, label, href }) => (
                <motion.a
                  href={href}
                  key={label}
                  target="_blank"
                  rel="noopener noreferrer"
                  variants={glowVariants}
                  initial="initial"
                  whileHover="hover"
                  whileTap="tap"
                  className="text-gray-300"
                >
                  <Icon />
                </motion.a>
              ))}
            </div>
          </div>
        </div>

        {/* Right Side Avatar */}
        <div className="relative hidden lg:block">
          <div
            className="absolute top-1/2 -translate-y-1/2 pointer-events-none"
            style={{
              right: "10px",
              width: "min(22vw,420px)",
              height: "min(40vw,760px)",
              borderRadius: "50%",
              filter: "blur(38px)",
              opacity: 0.32,
              background:
                "conic-gradient(from 0deg, #1cd8d2 ,#00bf8f ,#302b63, #1cd8d2)",
            }}
          ></div>

          <motion.img
            src={avator}
            alt="Uzair Baig"
            className="absolute top-1/2 -translate-y-1/2 object-contain select-none pointer-events-none"
            style={{
              right: "-30px",
              width: "min(45vw,780px)",
              maxHeight: "90vh",
            }}
            initial={{ opacity: 0, y: 40, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
          />
        </div>
      </div>
    </section>
  );
}
