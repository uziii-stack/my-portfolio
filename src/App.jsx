import React, { useState } from "react";
import { Routes, Route, useLocation } from "react-router-dom";

import IntroAnimation from "./components/IntroAnimation";
import CustomCursor from "./components/CustomCursor";
import Navbar from "./components/Navbar";
import Home from "./sections/Home";
import About from "./sections/About";
import Skills from "./sections/Skills";
import Projects from "./sections/Projects"; 
import LatestPosts from "./sections/LatestPosts";
import BlogPost from "./sections/BlogPost";
import AllBlogs from "./sections/AllBlogs";

import Experience from "./sections/Experience";
import Testimonials from "./sections/Testimonials";
import Contact from "./sections/Contact";
import Footer from "./sections/Footer";
import ScrollToTop from "./components/ScrollToTop";
import { Toaster } from "react-hot-toast";

import { HelmetProvider } from "react-helmet-async";

const MainContent = () => (
  <>
    <Home />
    <About />
    <Skills />
    <Projects />
    <LatestPosts />
    <Experience />
    <Testimonials />
    <Contact />
    <Footer />
  </>
);

export default function App() {
  const [showIntro, setShowIntro] = useState(true);

  return (
    <HelmetProvider>
      <div className="relative bg-black text-white overflow-x-hidden">
        {/* GLOBAL TOASTER */}
        <Toaster position="top-right" />

        {/*  INTRO ANIMATION (Auto hides after greetings) */}
        {showIntro && (
          <IntroAnimation onFinish={() => setShowIntro(false)} />
        )}

        {/* Custom Cursor */}
        <CustomCursor />

        {/* Navbar - Pass a prop or handle conditionally if needed, 
            but usually it should stay fixed */}
        <Navbar />

        <Routes>
          <Route path="/" element={<MainContent />} />
          <Route path="/blog" element={<AllBlogs />} />
          <Route path="/blogs" element={<AllBlogs />} />
          <Route path="/blog/:slug" element={<BlogPost />} />
        </Routes>

        <ScrollToTop />
      </div>
    </HelmetProvider>
  );
}
