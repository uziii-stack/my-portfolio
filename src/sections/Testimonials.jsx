import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

// ✅ Mobile Detection Hook
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

export default function Testimonials() {
    const isMobile = useIsMobile();

    const testimonials = [
        {
            name: "Hamza Khan",
            role: "Software Engineer at Systems Limited",
            review:
                "Uzair is an exceptional developer. His eye for detail and ability to solve complex problems made our project a huge success.",
        },
        {
            name: "Ayesha Ahmed",
            role: "UI/UX Designer at CreativeHive",
            review:
                "Working with Uzair was a delight. He blends functionality and aesthetics like a true professional. Highly recommended!",
        },
        {
            name: "Bilal Sheikh",
            role: "Project Manager at TechnoSoft",
            review:
                "Uzair handled our entire platform revamp with absolute perfection. His dedication and quality of work are unmatched.",
        },
        {
            name: "Sadia Tariq",
            role: "CTO at VisionX",
            review:
                "Our outdated system looks brand new thanks to Uzair. His work is modern, fast, and visually stunning.",
        },
        {
            name: "Ali Raza",
            role: "Founder at Raza Digital",
            review:
                "Uzair delivered exactly what we envisioned — and even better. His professionalism and creativity impressed our whole team.",
        },
        {
            name: "Mahnoor Fatima",
            role: "Product Designer at NexGen Labs",
            review:
                "From planning to execution, Uzair managed everything flawlessly. One of the best developers I’ve collaborated with.",
        },
    ];

    const [activeIndex, setActiveIndex] = useState(0);

    const next = () => setActiveIndex((prev) => (prev + 1) % testimonials.length);
    const prev = () =>
        setActiveIndex((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));

    useEffect(() => {
        const autoSlide = setInterval(() => next(), 5000);
        return () => clearInterval(autoSlide);
    }, []);

    return (
        <section
            id="testimonials"
            className="relative w-full min-h-screen bg-black text-white py-20 flex flex-col items-center justify-center overflow-hidden"
        >
            {/* ✅ Mobile + Desktop Responsive BLOBS */}
            <div className="absolute inset-0 pointer-events-none z-0">
                {/* TOP LEFT BLOB */}
                <div
                    className="absolute rounded-full bg-gradient-to-r from-green-600 via-emerald-500 to-teal-400 animate-pulse"
                    style={{
                        width: isMobile ? "120vw" : "40vw",
                        height: isMobile ? "120vw" : "40vw",
                        maxWidth: isMobile ? "600px" : "500px",
                        maxHeight: isMobile ? "600px" : "500px",
                        top: isMobile ? "-200px" : "-160px",
                        left: isMobile ? "-200px" : "-160px",
                        opacity: isMobile ? 0.22 : 0.18,
                        filter: `blur(${isMobile ? 130 : 150}px)`,
                    }}
                />

                {/* BOTTOM RIGHT BLOB */}
                <div
                    className="absolute rounded-full bg-gradient-to-r from-teal-400 via-emerald-500 to-green-600 animate-pulse"
                    style={{
                        width: isMobile ? "100vw" : "38vw",
                        height: isMobile ? "100vw" : "38vw",
                        maxWidth: isMobile ? "550px" : "480px",
                        maxHeight: isMobile ? "550px" : "480px",
                        bottom: isMobile ? "-220px" : "-130px",
                        right: isMobile ? "-220px" : "-130px",
                        opacity: isMobile ? 0.25 : 0.2,
                        filter: `blur(${isMobile ? 130 : 140}px)`,
                    }}
                />
            </div>

            <h2 className="text-3xl sm:text-4xl font-bold mb-10 z-10">Testimonials</h2>

            {/* Slider */}
            <div className="relative z-10 w-full max-w-4xl px-6 flex items-center justify-center gap-6">
                <button
                    onClick={prev}
                    className="hidden sm:flex bg-white/10 backdrop-blur-lg border border-white/20 w-12 h-12 rounded-full items-center justify-center hover:scale-110 transition-all text-2xl"
                >
                    ‹
                </button>

                <motion.div
                    key={activeIndex}
                    initial={{ opacity: 0, x: 60 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -60 }}
                    transition={{ duration: 0.5 }}
                    className="bg-white/10 backdrop-blur-2xl border border-white/20 p-7 rounded-3xl shadow-[0_25px_65px_-12px_rgba(0,0,0,0.7)] w-full text-center"
                >
                    <h3 className="text-2xl font-semibold mb-1">{testimonials[activeIndex].name}</h3>
                    <p className="text-sm text-white/70 mb-4">{testimonials[activeIndex].role}</p>
                    <p className="text-white/90 leading-relaxed italic text-lg">
                        {testimonials[activeIndex].review}
                    </p>
                </motion.div>

                <button
                    onClick={next}
                    className="hidden sm:flex bg-white/10 backdrop-blur-lg border border-white/20 w-12 h-12 rounded-full items-center justify-center hover:scale-110 transition-all text-2xl"
                >
                    ›
                </button>
            </div>

            {/* Dots */}
            <div className="mt-8 flex gap-2 z-10">
                {testimonials.map((_, i) => (
                    <div
                        key={i}
                        onClick={() => setActiveIndex(i)}
                        className={`w-3 h-3 rounded-full cursor-pointer transition-all duration-300 ${i === activeIndex ? "bg-white scale-125" : "bg-white/40"
                            }`}
                    ></div>
                ))}
            </div>
        </section>
    );
}