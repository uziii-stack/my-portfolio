import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

// 🔥 SAME MOBILE HOOK LIKE TESTIMONIALS (Perfect Working)
const useIsMobile = (query = "(max-width: 639px)") => {
    const [isMobile, setIsMobile] = useState(
        typeof window !== "undefined" && window.matchMedia(query).matches
    );
    useEffect(() => {
        if (typeof window === "undefined") return;
        const media = window.matchMedia(query);
        const handler = (e) => setIsMobile(e.matches);
        media.addEventListener("change", handler);
        return () => media.removeEventListener("change", handler);
    }, [query]);
    return isMobile;
};

const experiences = [
    {
        role: "Web Developer",
        company: "Brain Mentors",
        duration: "2022",
        description:
            "Built high-performance apps, integrated AI features, improved engagement by 10%.",
    },
    {
        role: "Web Developer Intern",
        company: "Mobisoft Technologies",
        duration: "2022 - 2023",
        description: "Gained hands-on web development experience.",
    },
    {
        role: "Graduate Engineer",
        company: "HCL Technologies",
        duration: "2024 - 2025",
        description:
            "Built frontend of GenAI-powered PV Intake App with Next.js & TS for US client.",
    },
];

export default function Experience() {
    const isMobile = useIsMobile(); // 🔥 FIXED

    return (
        <section
            id="experience"
            className="relative w-full min-h-[70vh] bg-black text-white overflow-hidden py-12 px-6 flex flex-col items-center"
        >
            {/* 🔥 RESPONSIVE BLOB SYSTEM — now works perfectly */}
            <div className="absolute inset-0 pointer-events-none z-0">
                {/* TOP LEFT BLOB */}
                <div
                    className="absolute rounded-full bg-gradient-to-r from-green-600 via-emerald-500 to-teal-400 animate-pulse"
                    style={{
                        width: isMobile ? "120vw" : "28vw",
                        height: isMobile ? "120vw" : "24vw",
                        top: isMobile ? "-220px" : "-130px",
                        left: isMobile ? "-220px" : "-130px",
                        opacity: isMobile ? 0.22 : 0.16,
                        filter: `blur(${isMobile ? 140 : 150}px)`,
                    }}
                />

                {/* BOTTOM RIGHT BLOB */}
                <div
                    className="absolute rounded-full bg-gradient-to-r from-teal-400 via-emerald-500 to-green-600 animate-pulse"
                    style={{
                        width: isMobile ? "100vw" : "26vw",
                        height: isMobile ? "100vw" : "22vw",
                        bottom: isMobile ? "-220px" : "-120px",
                        right: isMobile ? "-220px" : "-120px",
                        opacity: isMobile ? 0.25 : 0.18,
                        filter: `blur(${isMobile ? 130 : 150}px)`,
                    }}
                />
            </div>

            <h2 className="text-4xl sm:text-5xl font-semibold mb-10 text-center relative z-50">
                Experience
            </h2>

            {/* DESKTOP TIMELINE */}
            <div className="hidden md:flex flex-col items-center relative z-[1] max-w-4xl mx-auto w-full">
                <div className="absolute left-1/2 top-0 bottom-0 w-[3px] bg-white/20 z-[9999]" />

                {experiences.map((exp, idx) => (
                    <motion.div
                        key={idx}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: idx * 0.1 }}
                        className={`relative w-full flex ${idx % 2 === 0 ? "justify-start" : "justify-end"
                            } mb-12`}
                    >
                        <div className="absolute left-1/2 -translate-x-1/2 top-4 w-5 h-5 bg-white rounded-full shadow z-[99999]" />

                        <div className="bg-gray-900/70 border border-gray-700/60 rounded-xl p-5 w-[300px] shadow-lg relative z-50">
                            <h3 className="text-lg font-semibold">{exp.role}</h3>
                            <p className="text-sm text-gray-400 mb-2">
                                {exp.company} • {exp.duration}
                            </p>
                            <p className="text-sm text-gray-300">{exp.description}</p>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* MOBILE TIMELINE */}
            <div className="md:hidden relative z-50 max-w-md mx-auto mt-4">
                <div className="absolute left-5 top-0 bottom-0 w-[3px] bg-white/20 rounded z-[900]" />

                {experiences.map((exp, idx) => (
                    <motion.div
                        key={idx}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.4 }}
                        className="relative flex gap-6 mb-10"
                    >
                        <div className="w-5 h-5 rounded-full bg-white shadow z-[999]" />

                        <div className="bg-gray-900/70 border border-gray-700/60 rounded-xl p-5 w-full shadow-lg relative z-50">
                            <h3 className="text-lg font-semibold">{exp.role}</h3>
                            <p className="text-sm text-gray-400 mb-2">
                                {exp.company} • {exp.duration}
                            </p>
                            <p className="text-sm text-gray-300">{exp.description}</p>
                        </div>
                    </motion.div>
                ))}
            </div>
        </section>
    );
}
