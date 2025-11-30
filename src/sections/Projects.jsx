import React, { useState, useEffect, useRef, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import VanillaTilt from "vanilla-tilt";

import img1 from "../assets/img1.JPG";
import img2 from "../assets/img2.JPG";
import img3 from "../assets/img3.JPG";

import photo1 from "../assets/photo1.JPG";
import photo2 from "../assets/photo2.PNG";
import photo3 from "../assets/photo3.png";

const useIsMobile = (query = "(max-width: 639px)") => {
    const [isMobile, setIsMobile] = useState(
        typeof window !== "undefined" && window.matchMedia(query).matches
    );
    useEffect(() => {
        if (typeof window === "undefined") return;
        const mql = window.matchMedia(query);
        const handler = (e) => setIsMobile(e.matches);
        mql.addEventListener("change", handler);
        return () => mql.removeEventListener("change", handler);
    }, [query]);
    return isMobile;
};

export default function Projects() {
    const isMobile = useIsMobile();
    const tiltRef = useRef(null);

    const projects = useMemo(() => [
        {
            title: "nk studio",
            link: "https://www.nk.studio/",
            image: isMobile ? photo1 : img1,
        },
        {
            title: "Gamily",
            link: "https://gamilyapp.com/",
            image: isMobile ? photo2 : img2,
        },
        {
            title: "Hungry Tiger",
            link: "https://www.eathungrytiger.com/",
            image: isMobile ? photo3 : img3,
        },
    ], [isMobile]);

    const [activeIndex, setActiveIndex] = useState(0);
    const [isPaused, setIsPaused] = useState(false);

    useEffect(() => {
        if (isPaused) return;
        const interval = setInterval(() => {
            setActiveIndex((prev) => (prev + 1) % projects.length);
        }, 4000);
        return () => clearInterval(interval);
    }, [projects.length, isPaused]);

    useEffect(() => {
        if (tiltRef.current) {
            VanillaTilt.init(tiltRef.current, {
                max: 12,
                speed: 400,
                glare: true,
                "max-glare": 0.25,
                scale: 1.03,
            });
        }
        return () => tiltRef.current?.vanillaTilt?.destroy();
    }, []);

    const handleNext = () => setActiveIndex((prev) => (prev + 1) % projects.length);
    const handlePrev = () =>
        setActiveIndex((prev) => (prev === 0 ? projects.length - 1 : prev - 1));

    const activeProject = projects[activeIndex];

    return (
        <section
            id="projects"
            className="w-full min-h-screen relative overflow-hidden bg-black text-white flex flex-col items-center justify-center py-20"
        >
            {/* ✅ Responsive Animated BLOBS (Fixed for mobile too) */}
            <div className="absolute inset-0 pointer-events-none z-0">
                {/* TOP LEFT BLOB */}
                <div
                    className="
            absolute rounded-full bg-gradient-to-r from-green-600 via-emerald-500 to-teal-400
            animate-pulse
          "
                    style={{
                        width: isMobile ? "120vw" : "40vw",
                        height: isMobile ? "120vw" : "40vw",
                        maxWidth: isMobile ? "600px" : "500px",
                        maxHeight: isMobile ? "600px" : "500px",
                        top: isMobile ? "-220px" : "-160px",
                        left: isMobile ? "-220px" : "-160px",
                        opacity: isMobile ? 0.22 : 0.18,
                        filter: `blur(${isMobile ? 140 : 150}px)`,
                        aspectRatio: "1/1",
                    }}
                />

                {/* BOTTOM RIGHT BLOB */}
                <div
                    className="
            absolute rounded-full bg-gradient-to-r from-teal-400 via-emerald-500 to-green-600
            animate-pulse
          "
                    style={{
                        width: isMobile ? "100vw" : "38vw",
                        height: isMobile ? "100vw" : "38vw",
                        maxWidth: isMobile ? "550px" : "480px",
                        maxHeight: isMobile ? "550px" : "480px",
                        bottom: isMobile ? "-230px" : "-130px",
                        right: isMobile ? "-230px" : "-130px",
                        opacity: isMobile ? 0.25 : 0.2,
                        filter: `blur(${isMobile ? 130 : 140}px)`,
                        aspectRatio: "1/1",
                    }}
                />
            </div>

            {/* Content */}
            <h2 className="text-2xl sm:text-4xl font-bold mb-14 text-center relative z-10">
                My Projects
            </h2>

            <div
                className="relative z-10 w-[90%] max-w-6xl flex items-center justify-center gap-6 sm:gap-10"
                onMouseEnter={() => setIsPaused(true)}
                onMouseLeave={() => setIsPaused(false)}
            >

                {/* LEFT BUTTON */}
                <button
                    onClick={handlePrev}
                    className="shrink-0 bg-white/10 backdrop-blur-lg border border-white/20 w-10 h-10 sm:w-14 sm:h-14 rounded-full flex items-center justify-center hover:scale-110 transition-all text-2xl"
                >
                    ‹
                </button>

                {/* SLIDER → Only photo/title card moves */}
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeProject?.title}
                        initial={{ opacity: 0, x: 90, scale: 0.96 }}
                        animate={{ opacity: 1, x: 0, scale: 1 }}
                        exit={{ opacity: 0, x: -90, scale: 0.96 }}
                        transition={{ duration: 0.6 }}
                        className="w-full flex flex-col items-center"
                    >
                        {/* TITLE */}
                        <h3 className="text-[clamp(1.6rem,5vw,3rem)] italic font-semibold mb-6 text-center">
                            {activeProject?.title}
                        </h3>

                        {/* PHOTO CARD */}
                        <div
                            ref={tiltRef}
                            className="rounded-2xl overflow-hidden backdrop-blur-xl bg-white/10 border border-white/20 shadow-[0_25px_65px_-12px_rgba(0,0,0,0.8)] w-full h-[50vh] sm:h-[60vh] max-w-[1300px]"
                        >
                            <img
                                src={activeProject?.image}
                                alt={activeProject?.title}
                                className="w-full h-full object-cover"
                                loading="lazy"
                            />
                        </div>
                    </motion.div>
                </AnimatePresence>

                {/* RIGHT BUTTON */}
                <button
                    onClick={handleNext}
                    className="shrink-0 bg-white/10 backdrop-blur-lg border border-white/20 w-10 h-10 sm:w-14 sm:h-14 rounded-full flex items-center justify-center hover:scale-110 transition-all text-2xl"
                >
                    ›
                </button>

            </div>

            {/* ✅ FIXED BUTTON — Stable (No slide animation) */}
            <div className="mt-12 sm:mt-16 relative z-20">
                <a
                    href={activeProject?.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-6 py-3 sm:px-8 sm:py-4 bg-white text-black font-semibold text-base sm:text-lg rounded-full shadow-xl hover:scale-105 transition-all"
                >
                    View Project
                </a>
            </div>
        </section>
    );
}
