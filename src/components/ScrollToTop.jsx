import React, { useEffect, useState, useRef } from "react";
import { FiArrowUp } from "react-icons/fi";

export default function ScrollToTop() {
    const [visible, setVisible] = useState(false);
    const lastScrollY = useRef(0);
    const forceHidden = useRef(true); // Home par ho → hide
    const timerId = useRef(null);

    // ---- TRACK HOME SECTION ----
    useEffect(() => {
        const home = document.querySelector("#home");
        if (!home) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    forceHidden.current = true;
                    setVisible(false);
                } else {
                    forceHidden.current = false;
                }
            },
            { threshold: 0.2 }
        );

        observer.observe(home);
        return () => observer.disconnect();
    }, []);

    // ---- SCROLL-BASED SHOW/HIDE + INACTIVITY HIDE ----
    useEffect(() => {
        const handleScroll = () => {
            if (forceHidden.current) {
                setVisible(false);
                return;
            }

            const currentY = window.scrollY;

            if (currentY > lastScrollY.current) {
                // scrolling DOWN → show
                setVisible(true);
            } else {
                // scrolling UP → hide
                setVisible(false);
            }

            // Reset hide timer
            if (timerId.current) clearTimeout(timerId.current);
            timerId.current = setTimeout(() => {
                setVisible(false);
            }, 3000);

            lastScrollY.current = currentY;
        };

        window.addEventListener("scroll", handleScroll, { passive: true });

        return () => {
            window.removeEventListener("scroll", handleScroll);
            if (timerId.current) clearTimeout(timerId.current);
        };
    }, []);

    return (
        <button
            onClick={() => {
                const home = document.querySelector("#home");
                if (home) home.scrollIntoView({ behavior: "smooth" });
            }}
            className={`fixed bottom-6 right-6 z-50 p-4 bg-white/10 backdrop-blur-lg 
      rounded-full border border-white/20 shadow-lg 
      transition-all duration-300 hover:bg-white/20
      ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10 pointer-events-none"}
      `}
        >
            <FiArrowUp className="text-white text-2xl" />
        </button>
    );
}
