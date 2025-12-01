import React, { useState } from "react";

import IntroAnimation from "./components/IntroAnimation";
import CustomCursor from "./components/CustomCursor";
import Navbar from "./components/Navbar";
import Home from "./sections/Home";
import About from "./sections/About";
import Skills from "./sections/Skills";
import Experience from "./sections/Experience";
import Projects from "./sections/Projects";
import Testimonials from "./sections/Testimonials";
import Contact from "./sections/Contact";
import Footer from "./sections/Footer";
import ScrollToTop from "./components/ScrollToTop";
import { Toaster } from "react-hot-toast";

export default function App() {
  const [showIntro, setShowIntro] = useState(true);

  return (
    <div className="relative bg-black text-white overflow-x-hidden">

      {/* GLOBAL TOASTER */}
      <Toaster position="top-right" />

      {/* 🔥 INTRO ANIMATION (Auto hides after greetings) */}
      {showIntro && (
        <IntroAnimation onFinish={() => setShowIntro(false)} />
      )}

      {/* Custom Cursor */}
      <CustomCursor />

      {/* Navbar */}
      <Navbar />

      {/* Sections */}
      <Home />
      <About />
      <Skills />

      <Projects />
      <Experience />
      <Testimonials />
      <Contact />
      <ScrollToTop />

      {/* Footer */}
      <Footer />
    </div>
  );
}
