import { motion, AnimatePresence } from "framer-motion";
import { FiX } from "react-icons/fi";
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";

const navItems = [
  { name: "Home", href: "/#home", isAnchor: true },
  { name: "About", href: "/#about", isAnchor: true },
  { name: "Skills", href: "/#skills", isAnchor: true },
  { name: "Projects", href: "/#projects", isAnchor: true },
  { name: "Experience", href: "/#experience", isAnchor: true },
  { name: "Testimonials", href: "/#testimonials", isAnchor: true },
  { name: "Blog", href: "/blog", isRoute: true },
  { name: "Contact", href: "/#contact", isAnchor: true },
  { name: "Sitemap", href: "/sitemap.html", isRoute: true },
];

export default function OverlayMenu({ isOpen, onClose }) {
  const [isMobile, setIsMobile] = useState(false);
  const [origin, setOrigin] = useState("50% 8%");
  const location = useLocation();
  const isHome = location.pathname === "/";

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 1024;
      setIsMobile(mobile);
      setOrigin(mobile ? "95% 8%" : "50% 8%");
    };

    handleResize(); // initial check
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 flex items-center justify-center z-[100000] overflow-y-auto py-12"
          style={{ backgroundColor: "rgba(0,0,0,0.96)" }}
          initial={{ opacity: 0, clipPath: `circle(0% at ${origin})` }}
          animate={{ opacity: 1, clipPath: `circle(150% at ${origin})` }}
          exit={{ opacity: 0, clipPath: `circle(0% at ${origin})` }}
          transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-6 right-6 text-3xl text-white p-2 rounded-full hover:bg-white/10 transition-colors"
            aria-label="Close menu"
          >
            <FiX />
          </button>

          {/* Menu Items */}
          <ul className="space-y-4 sm:space-y-5 text-center my-auto">
            {navItems.map((item, index) => {
              const targetHref = item.isAnchor && isHome ? item.href.replace("/", "") : item.href;

              return (
                <motion.li
                  key={item.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  transition={{ delay: 0.15 + index * 0.05 }}
                >
                  {item.isRoute ? (
                    <Link
                      to={item.href}
                      onClick={onClose}
                      className="text-2xl sm:text-4xl text-white font-semibold hover:text-emerald-400 transition-colors duration-200 inline-block"
                    >
                      {item.name}
                    </Link>
                  ) : (
                    <a
                      href={targetHref}
                      onClick={onClose}
                      className="text-2xl sm:text-4xl text-white font-semibold hover:text-emerald-400 transition-colors duration-200 inline-block"
                    >
                      {item.name}
                    </a>
                  )}
                </motion.li>
              );
            })}
          </ul>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
