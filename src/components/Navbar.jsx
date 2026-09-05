import React, { useEffect, useState, useRef } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import OverlayMenu from "./OverlayMenu";
import Logo from "../assets/Logo.png";
import { FiMenu } from "react-icons/fi";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [visible, setVisible] = useState(true);
  const [forceVisible, setForceVisible] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const isHomePage = location.pathname === "/";

  const lastScrollY = useRef(0);
  const timerId = useRef(null);

  // ---- RESET VISIBILITY ON ROUTE CHANGE ----
  useEffect(() => {
    setVisible(true);
    setMenuOpen(false);
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [location.pathname]);

  // ---- HOME SECTION VISIBILITY TRACK (ONLY ON ROOT) ----
  useEffect(() => {
    if (!isHomePage) {
      setForceVisible(false);
      return;
    }

    const homeSection = document.querySelector("#home");
    if (!homeSection) {
      setForceVisible(false);
      return;
    }

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
  }, [isHomePage]);

  // ---- NAVBAR AUTO-HIDE ON SCROLL ----
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Always show when near the very top
      if (currentScrollY < 60 || forceVisible) {
        setVisible(true);
        lastScrollY.current = currentScrollY;
        return;
      }

      if (currentScrollY > lastScrollY.current + 5) {
        setVisible(false); // scrolling down → hide
      } else if (currentScrollY < lastScrollY.current - 5) {
        setVisible(true); // scrolling up → show
      }

      // Hide after 3 seconds of inactivity if scrolled down
      if (timerId.current) clearTimeout(timerId.current);
      if (currentScrollY > 100) {
        timerId.current = setTimeout(() => {
          setVisible(false);
        }, 3000);
      }

      lastScrollY.current = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (timerId.current) clearTimeout(timerId.current);
    };
  }, [forceVisible]);

  const handleLogoClick = () => {
    if (isHomePage) {
      const homeSection = document.querySelector("#home");
      if (homeSection) {
        homeSection.scrollIntoView({ behavior: "smooth" });
      } else {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    } else {
      navigate("/");
    }
  };

  return (
    <>
      <nav
        className={`fixed top-0 left-0 w-full h-16 flex items-center justify-between px-6 py-4 z-[100010] transition-transform duration-300 backdrop-blur-md bg-black/40 border-b border-white/5 ${
          visible && !menuOpen ? "translate-y-0" : "-translate-y-full"
        }`}
      >
        {/* Logo + Name */}
        <button
          onClick={handleLogoClick}
          className="flex items-center space-x-2 cursor-pointer group text-left"
          aria-label="Go to Homepage"
        >
          <img src={Logo} alt="Logo" className="h-10 w-auto object-contain group-hover:scale-105 transition-transform" />
          <span className="text-xl sm:text-2xl font-bold text-white group-hover:text-emerald-400 transition-colors">
            Uzair Baig
          </span>
        </button>

        {/* Menu Button (Mobile Center) */}
        <div className="block lg:absolute lg:left-1/2 lg:-translate-x-1/2">
          <button
            className="text-2xl sm:text-3xl text-white hover:text-emerald-400 transition-colors focus:outline-none p-2"
            onClick={() => setMenuOpen(true)}
            aria-label="open menu"
          >
            <FiMenu />
          </button>
        </div>

        {/* Contact Button */}
        <div className="hidden lg:block">
          <a
            href={isHomePage ? "#contact" : "/#contact"}
            className="bg-gradient-to-r from-emerald-500 to-blue-600 hover:from-emerald-400 hover:to-blue-500 text-white px-5 py-2 rounded-full text-sm font-semibold shadow-lg shadow-emerald-500/10 hover:shadow-emerald-500/20 transition-all duration-300"
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
