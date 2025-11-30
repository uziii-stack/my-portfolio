import { motion, useMotionValue } from "framer-motion";
import { useEffect, useState, useRef } from "react";
import { FaJava, FaReact } from "react-icons/fa";
import {
    SiNextdotjs, SiTypescript, SiTailwindcss, SiFastapi,
    SiPython, SiDocker, SiMongodb, SiAngular
} from "react-icons/si";
import { DiNodejsSmall } from "react-icons/di";
import { GrDatabase } from "react-icons/gr";   // ✅ NEW IMPORT

export default function Skills() {

    const skills = [
        { icon: <FaJava />, name: "Java" },
        { icon: <FaReact />, name: "React" },
        { icon: <SiNextdotjs />, name: "Next.js" },
        { icon: <SiTypescript />, name: "TypeScript" },
        { icon: <SiTailwindcss />, name: "Tailwind CSS" },
        { icon: <SiFastapi />, name: "FastAPI" },
        { icon: <SiPython />, name: "Python" },
        { icon: <SiDocker />, name: "Docker" },
        { icon: <DiNodejsSmall />, name: "Node.js" },
        { icon: <SiMongodb />, name: "MongoDB" },
        { icon: <SiAngular />, name: "Angular" },
        { icon: <GrDatabase />, name: "Database" },  // ✅ NEW SKILL
    ];

    const repeated = [...skills, ...skills];

    const [dir, setDir] = useState(-1);
    const [active, setActive] = useState(false);

    const sectionRef = useRef(null);
    const trackRef = useRef(null);
    const touchY = useRef(0);

    const x = useMotionValue(0);

    // SECTION OBSERVER
    useEffect(() => {
        const el = sectionRef.current;
        if (!el) return;

        const io = new IntersectionObserver(
            ([entry]) => setActive(entry.isIntersecting && entry.intersectionRatio > 0.1),
            { threshold: 0.1 }
        );

        io.observe(el);
        return () => io.disconnect();
    }, []);

    // WHEEL + TOUCH HANDLERS
    useEffect(() => {
        if (!active) return;

        const onWheel = (e) => setDir(e.deltaY > 0 ? -1 : 1);

        const onTouchStart = (e) => {
            touchY.current = e.touches[0].clientY;
        };

        const onTouchMove = (e) => {
            const y = e.touches[0].clientY;
            const dy = y - touchY.current;
            setDir(dy > 0 ? 1 : -1);
            touchY.current = y;
        };

        window.addEventListener("wheel", onWheel, { passive: true });
        window.addEventListener("touchstart", onTouchStart, { passive: true });
        window.addEventListener("touchmove", onTouchMove, { passive: true });

        return () => {
            window.removeEventListener("wheel", onWheel);
            window.removeEventListener("touchstart", onTouchStart);
            window.removeEventListener("touchmove", onTouchMove);
        };
    }, [active]);

    // AUTO SCROLL LOOP
    useEffect(() => {
        let id;
        let last = performance.now();
        const SPEED = 80;

        const tick = (now) => {
            const dt = (now - last) / 1000;
            last = now;

            let next = x.get() + dir * dt * SPEED;

            const loop = trackRef.current?.scrollWidth / 2 || 0;

            if (loop) {
                if (next <= -loop) next += loop;
                if (next >= 0) next -= loop;
            }

            x.set(next);
            id = requestAnimationFrame(tick);
        };

        id = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(id);

    }, [dir, x]);

    return (
        <section
            id="skills"
            ref={sectionRef}
            className="h-auto w-full py-20 flex flex-col items-center justify-center relative bg-black text-white overflow-hidden"
        >
            {/* Background Glow */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-1/4 left-0 w-[300px] h-[300px] bg-gradient-to-r 
                from-[#302b63] via-[#00bf8f] to-[#1cd8d2] opacity-20 blur-[120px] rounded-full animate-pulse" />

                <div className="absolute bottom-1/4 right-0 w-[300px] h-[300px] bg-gradient-to-r 
                from-[#302b63] via-[#00bf8f] to-[#1cd8d2] opacity-20 blur-[120px] rounded-full animate-pulse delay-500" />
            </div>

            {/* Heading */}
            <motion.h2
                className="text-4xl sm:text-5xl font-bold bg-gradient-to-r 
                from-[#1cd8d2] via-[#00bf8f] to-[#302b63] bg-clip-text text-transparent text-center z-10"
                initial={{ opacity: 0, y: -30 }}
                animate={{ opacity: 1, y: 0 }}
            >
                My Skills
            </motion.h2>

            {/* Description */}
            <motion.p
                className="mt-2 mb-8 text-white/90 text-base sm:text-lg z-10 text-center"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
            >
                Here are some of the modern technologies, tools, and frameworks I have experience with.
            </motion.p>

            {/* Auto Scroll Skill Track */}
            <div ref={trackRef} className="relative w-full overflow-hidden">
                <motion.div
                    style={{ x, whiteSpace: "nowrap", willChange: "transform" }}
                    className="flex gap-10 text-6xl text-[#1cd8d2]"
                >
                    {repeated.map((s, i) => (
                        <div
                            key={i}
                            className="flex flex-col items-center gap-2 min-w-[120px]"
                            aria-label={s.name}
                            title={s.name}
                        >
                            <span className="hover:scale-125 transition-transform duration-300">
                                {s.icon}
                            </span>
                            <p className="text-sm">{s.name}</p>
                        </div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}
