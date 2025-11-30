import React from "react";
import { motion } from "framer-motion";
import p from "../assets/p.png";

export default function About() {
  return (
    <section
      id="about"
      className="relative w-full min-h-screen px-6 py-20 bg-[#0a0a0a] text-white overflow-hidden"
    >
      {/* Glow Blobs - SAME THEME AS SKILLS */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-10 left-10 w-[250px] h-[250px] bg-gradient-to-r from-[#302b63] via-[#00bf8f] to-[#1cd8d2] opacity-20 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-10 right-10 w-[250px] h-[250px] bg-gradient-to-r from-[#302b63] via-[#00bf8f] to-[#1cd8d2] opacity-20 blur-[120px] rounded-full animate-pulse delay-500" />
      </div>

      {/* MAIN CONTENT */}
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-start md:items-center gap-12 relative z-10">
        {/* LEFT — IMAGE */}
        <motion.img
          src={p}
          alt="Uzair Baig"
          className="w-40 h-40 md:w-48 md:h-48 rounded-xl object-cover shadow-lg border border-white/10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        />

        {/* RIGHT — TEXT */}
        <div className="flex-1">
          <motion.h1
            className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-[#1cd8d2] via-[#00bf8f] to-[#302b63] bg-clip-text text-transparent"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Uzair Baig
          </motion.h1>

          <motion.p
            className="text-base md:text-lg text-gray-300 mt-1"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            Full Stack Engineer
          </motion.p>

          <motion.p
            className="text-gray-400 max-w-2xl mt-3 leading-relaxed text-sm md:text-base"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            I build modern, scalable applications with a focus on clean
            architecture, performance, and user-first interfaces.
          </motion.p>

          {/* INFO BOXES */}
          <div className="flex flex-wrap gap-4 mt-6">
            <div className="px-5 py-3 rounded-xl bg-white/5 border border-white/10 text-xs md:text-sm shadow-md">
              <span className="text-gray-400 ">Experience</span>
              <p className="text-white font-semibold mt-1">4+ Years</p>
            </div>

            <div className="px-5 py-3 rounded-xl bg-white/5 border border-white/10 text-xs md:text-sm shadow-md">
              <span className="text-gray-400">Specialty</span>
              <p className="text-white font-semibold mt-1">Full Stack Engineer</p>
            </div>

            <div className="px-5 py-3 rounded-xl bg-white/5 border border-white/10 text-xs md:text-sm shadow-md">
              <span className="text-gray-400">Focus</span>
              <p className="text-white font-semibold mt-1">Performance UI & UX</p>
            </div>
          </div>

          {/* BUTTONS */}
          <div className="flex flex-col sm:flex-row gap-4 mt-8 w-full sm:w-auto">
            <a
              href="#projects"
              className="px-6 py-3 rounded-xl text-sm md:text-base bg-white text-black font-semibold shadow hover:bg-gray-200 transition text-center"
            >
              View Projects
            </a>

            <a
              href="#contact"
              className="px-6 py-3 rounded-xl text-sm md:text-base bg-white/10 border border-white/20 font-semibold hover:bg-white/20 transition text-center"
            >
              Get in Touch
            </a>
          </div>
        </div>
      </div>

      {/* ABOUT ME SECTION */}
      <div className="max-w-4xl mx-auto mt-20 relative z-10">
        <h2 className="text-2xl md:text-3xl font-bold mb-4">About Me</h2>

        <p className="text-gray-400 text-sm md:text-lg leading-relaxed">
          I'm a Software Developer passionate about building fast, resilient
          applications.
        </p>

        <p className="text-gray-400 text-sm md:text-lg leading-relaxed mt-4">
          I build scalable, modern applications with a strong focus on clean architecture, delightful UX, and performance. My toolkit spans Java, React, Next.js, TypeScript, Tailwind CSS, and Restful API—bringing ideas to life from concept to production with robust APIs and smooth interfaces.
        </p>
      </div>
    </section>
  );
}
