import React from "react";
import { Link, useLocation } from "react-router-dom";
import { FaFacebook, FaLinkedin, FaGithub, FaEnvelope, FaMapMarkerAlt, FaArrowUp, FaFileCode, FaCompass, FaExternalLinkAlt } from "react-icons/fa";
import { motion } from "framer-motion";

const socials = [
  { 
    Icon: FaGithub, 
    label: "GitHub", 
    href: "https://github.com/uziii-stack",
    color: "hover:text-white hover:border-white/40"
  },
  { 
    Icon: FaLinkedin, 
    label: "LinkedIn", 
    href: "https://linkedin.com/in/uzair-baig-22b983385",
    color: "hover:text-[#0a66c2] hover:border-[#0a66c2]/40"
  },
  { 
    Icon: FaFacebook, 
    label: "Facebook", 
    href: "https://www.facebook.com/share/1BqGxYS5NX/?mibextid=wwXIfr",
    color: "hover:text-[#1877f2] hover:border-[#1877f2]/40"
  },
  { 
    Icon: FaEnvelope, 
    label: "Email", 
    href: "mailto:uzairbaig040@gmail.com",
    color: "hover:text-emerald-400 hover:border-emerald-400/40"
  },
];

const mainNavLinks = [
  { name: "Home", href: "/#home" },
  { name: "About Me", href: "/#about" },
  { name: "Technical Skills", href: "/#skills" },
  { name: "Featured Projects", href: "/#projects" },
  { name: "Work Experience", href: "/#experience" },
  { name: "Client Testimonials", href: "/#testimonials" },
  { name: "Get in Touch", href: "/#contact" },
];

const resourceLinks = [
  { name: "All Blog Posts", href: "/blog", isInternal: true },
  { name: "Latest Insights", href: "/#blog", isInternal: false },
  { name: "HTML Sitemap", href: "/sitemap.html", isInternal: true, badge: "Pages Map" },
];

const featuredProjects = [
  { name: "nk studio", url: "https://www.nk.studio/", desc: "Creative Digital Studio" },
  { name: "Gamily", url: "https://gamilyapp.com/", desc: "Interactive Social Platform" },
  { name: "Hungry Tiger", url: "https://www.eathungrytiger.com/", desc: "Food & Beverage Brand" },
];

export default function Footer() {
  const location = useLocation();
  const isHomePage = location.pathname === "/";

  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const renderNavLink = (link) => {
    if (link.isInternal) {
      return (
        <Link
          to={link.href}
          className="text-white/70 hover:text-emerald-400 transition-colors duration-200 flex items-center justify-between group py-1 text-sm sm:text-base"
        >
          <span className="group-hover:translate-x-1 transition-transform duration-200">
            {link.name}
          </span>
          {link.badge && (
            <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              {link.badge}
            </span>
          )}
        </Link>
      );
    }

    if (link.isExternal) {
      return (
        <a
          href={link.href}
          target="_blank"
          rel="noopener noreferrer"
          className="text-white/70 hover:text-emerald-400 transition-colors duration-200 flex items-center justify-between group py-1 text-sm sm:text-base"
        >
          <span className="group-hover:translate-x-1 transition-transform duration-200">
            {link.name}
          </span>
          <FaExternalLinkAlt className="text-xs opacity-50 group-hover:opacity-100 transition-opacity" />
        </a>
      );
    }

    // Section anchor links
    const targetUrl = isHomePage ? link.href.replace("/", "") : link.href;
    return (
      <a
        href={targetUrl}
        className="text-white/70 hover:text-emerald-400 transition-colors duration-200 flex items-center group py-1 text-sm sm:text-base"
      >
        <span className="group-hover:translate-x-1 transition-transform duration-200">
          {link.name}
        </span>
      </a>
    );
  };

  return (
    <footer className="relative overflow-hidden bg-[#050508] border-t border-white/10 text-white">
      {/* Background Ambient Glows */}
      <div className="pointer-events-none absolute -top-40 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-[140px]" />
      <div className="pointer-events-none absolute bottom-0 right-1/4 w-96 h-96 bg-[#0d58cc]/15 rounded-full blur-[140px]" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12">
        {/* Main 4-Column Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8 pb-14 border-b border-white/10">
          {/* Brand Column (5 cols on lg) */}
          <div className="lg:col-span-4 space-y-5">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-[#0d58cc] p-[2px]">
                <div className="w-full h-full bg-black rounded-[10px] flex items-center justify-center font-black text-lg text-white">
                  UB
                </div>
              </div>
              <span className="text-2xl font-bold tracking-tight bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent">
                Uzair Baig
              </span>
            </div>

            <p className="text-white/60 text-sm leading-relaxed max-w-sm">
              Full-Stack Developer crafting high-performance, accessible web applications and immersive digital experiences.
            </p>

            {/* Availability Pill */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-xs text-emerald-400 font-medium">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              Available for Freelance & Full-time Roles
            </div>

            {/* Social Icons */}
            <div className="pt-2">
              <div className="text-xs uppercase tracking-wider text-white/40 mb-3 font-semibold">Connect with me</div>
              <div className="flex flex-wrap gap-2.5">
                {socials.map(({ Icon, label, href, color }) => (
                  <motion.a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    whileHover={{ scale: 1.1, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    className={`w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/80 transition-all duration-300 ${color}`}
                  >
                    <Icon className="text-lg" />
                  </motion.a>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Navigation Column (2 cols on lg) */}
          <div className="lg:col-span-3 space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
              Navigation
            </h3>
            <ul className="space-y-2">
              {mainNavLinks.map((link) => (
                <li key={link.name}>
                  {renderNavLink(link)}
                </li>
              ))}
            </ul>
          </div>

          {/* Pages & Resources Column (3 cols on lg) */}
          <div className="lg:col-span-3 space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
              Pages & Sitemap
            </h3>
            <ul className="space-y-2">
              {resourceLinks.map((link) => (
                <li key={link.name}>
                  {renderNavLink(link)}
                </li>
              ))}
            </ul>

            <div className="pt-3">
              <Link
                to="/sitemap.html"
                className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs font-medium transition-all group"
              >
                <FaCompass className="text-emerald-400 group-hover:rotate-45 transition-transform duration-300" />
                <span>Explore Full Site Map</span>
              </Link>
            </div>
          </div>

          {/* Featured Works / Quick Contact (2 cols on lg) */}
          <div className="lg:col-span-2 space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
              Live Projects
            </h3>
            <div className="space-y-2.5">
              {featuredProjects.map((p) => (
                <a
                  key={p.name}
                  href={p.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block p-2.5 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] border border-white/5 hover:border-emerald-500/30 transition-all group"
                >
                  <div className="flex items-center justify-between text-xs font-semibold text-white group-hover:text-emerald-400">
                    <span>{p.name}</span>
                    <FaExternalLinkAlt className="text-[10px] opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <div className="text-[11px] text-white/50 truncate mt-0.5">{p.desc}</div>
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Bar: Copyright, Links & Back to Top */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-white/50">
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-x-6 gap-y-2">
            <span>
              &copy; {new Date().getFullYear()} <span className="text-white font-medium">Uzair Baig</span>. All rights reserved.
            </span>
            <span className="hidden sm:inline text-white/20">•</span>
            <Link to="/sitemap.html" className="text-white/70 hover:text-emerald-400 transition-colors flex items-center gap-1.5">
              <FaFileCode className="text-[11px] text-emerald-400" />
              <span>Sitemap (HTML)</span>
            </Link>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-white/40">Built with React & Vite</span>
            <button
              onClick={handleScrollToTop}
              className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-white/80 hover:text-white transition-all text-xs"
              title="Scroll to Top"
            >
              <span>Top</span>
              <FaArrowUp className="text-[10px]" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}