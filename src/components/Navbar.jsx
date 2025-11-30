import React, { useEffect, useState, useRef } from "react";
import OverlayMenu from "./OverlayMenu";
import Logo from "../assets/logo.png";
import { FiMenu } from "react-icons/fi";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [visible, setVisible] = useState(true);
  const [forceVisible, setForceVisible] = useState(false);

  const lastScrollY = useRef(0);
  const timerId = useRef(null);

  // ---- HOME SECTION VISIBILITY TRACK ----
  useEffect(() => {
    const homeSection = document.querySelector("#home");

    if (!homeSection) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setForceVisible(true);
        } else {
          setForceVisible(false);
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(homeSection);

    return () => observer.unobserve(homeSection);
  }, []);

  // ---- NAVBAR AUTO-HIDE ON SCROLL ----
  useEffect(() => {
    const handleScroll = () => {
      if (forceVisible) {
        setVisible(true);
        return;
      }

      const currentScrollY = window.scrollY;

      if (currentScrollY > lastScrollY.current) {
        setVisible(false); // scrolling down → hide
      } else {
        setVisible(true); // scrolling up → show
      }

      // hide after 3 sec
      if (timerId.current) clearTimeout(timerId.current);

      timerId.current = setTimeout(() => {
        setVisible(false);
      }, 3000);

      lastScrollY.current = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (timerId.current) clearTimeout(timerId.current);
    };
  }, [forceVisible]);

  return (
    <>
      <nav
        className={`fixed top-0 left-0 w-full h-16 flex items-center justify-between px-6 py-4 z-50 transition-transform duration-300 ${visible ? "translate-y-0" : "-translate-y-full"
          }`}
      >
        {/* Logo + Name */}
        <button
          onClick={() => {
            const homeSection = document.querySelector("#home");
            if (homeSection) homeSection.scrollIntoView({ behavior: "smooth" });
          }}
          className="flex items-center space-x-1 cursor-pointer"
        >
          <img src={Logo} alt="Logo" className="h-16.6 w-14" />
          <div className="text-2xl font-bold text-white">Uzair Baig</div>
        </button>
        {/* Menu Button (Mobile Center) */}
        <div className="block lg:absolute lg:left-1/2 lg:-translate-x-1/2">
          <button
            className="text-3xl text-white focus:outline-none"
            onClick={() => setMenuOpen(true)}
            aria-label="open menu"
          >
            <FiMenu />
          </button>
        </div>

        {/* Contact Button */}
        <div className="hidden lg:block">
          <a
            href="#contact"
            className="bg-linear-to-r from-pink-500 to-blue-500 text-white px-5 py-2 rounded-full font-medium shadow-lg hover:opacity-90 transition-opacity duration-300"
          >
            Reach Me Out
          </a>
        </div>
      </nav>

      {/* Overlay Menu */}
      <OverlayMenu isOpen={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  );
}
