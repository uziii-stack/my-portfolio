import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const useIsMobile = (query = "(max-width: 880px)") => {
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

export default function LatestPosts() {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const scrollRef = useRef(null);
    const isMobile = useIsMobile();

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                // Fetch directly from the absolute backend URL
                const apiUrl = "https://my-blog-backend-phi.vercel.app/api/posts";
                    
                const res = await fetch(apiUrl);
                if (!res.ok) throw new Error("Failed to fetch posts");
                const data = await res.json();
                
                // Handle different possible API response structures
                const postsArray = Array.isArray(data) ? data : (data.posts || data.data || []);
                
                // Slice the latest 6 posts
                setPosts(postsArray.slice(0, 6));
            } catch (err) {
                console.error("Error fetching posts:", err);
                setError(true);
            } finally {
                setLoading(false);
            }
        };

        fetchPosts();
    }, []);

    const slideLeft = () => {
        if (scrollRef.current) {
            scrollRef.current.scrollBy({ left: -320, behavior: 'smooth' });
        }
    };

    const slideRight = () => {
        if (scrollRef.current) {
            scrollRef.current.scrollBy({ left: 320, behavior: 'smooth' });
        }
    };

    // Auto-scroll effect for mobile viewing
    useEffect(() => {
        let interval;
        if (isMobile && posts.length > 0) {
            interval = setInterval(() => {
                if (scrollRef.current) {
                    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
                    // Check if reached the end (with a small buffer)
                    if (Math.ceil(scrollLeft + clientWidth) >= scrollWidth - 10) {
                        scrollRef.current.scrollTo({ left: 0, behavior: 'smooth' });
                    } else {
                        // Slide right by one card's width + gap (gap-4 is 16px)
                        const shift = scrollRef.current.children[0]?.clientWidth || 300;
                        scrollRef.current.scrollBy({ left: shift + 16, behavior: 'smooth' });
                    }
                }
            }, 3000); // 3 seconds per slide
        }
        return () => clearInterval(interval);
    }, [isMobile, posts]);

    return (
        <section
            id="blog"
            className="w-full min-h-[80vh] relative overflow-hidden bg-black text-white flex flex-col items-center justify-center py-20"
        >
            {/* Background Blobs (Complimentary colors to Projects section) */}
            <div className="absolute inset-0 pointer-events-none z-0">
                <div
                    className="absolute rounded-full bg-gradient-to-r from-green-600 via-emerald-500 to-teal-400 animate-pulse"
                    style={{
                        width: isMobile ? "120vw" : "40vw",
                        height: isMobile ? "120vw" : "40vw",
                        maxWidth: isMobile ? "600px" : "500px",
                        maxHeight: isMobile ? "600px" : "500px",
                        top: isMobile ? "-220px" : "-160px",
                        right: isMobile ? "-220px" : "-160px",
                        opacity: isMobile ? 0.18 : 0.15,
                        filter: `blur(${isMobile ? 140 : 150}px)`,
                        aspectRatio: "1/1",
                    }}
                />
            </div>

            <h2 className="text-2xl sm:text-4xl font-bold mb-14 text-center relative z-10">
                Latest Blog Posts
            </h2>

            <div className="relative z-10 w-full max-w-7xl flex items-center justify-center gap-2 sm:gap-6 px-0 sm:px-6 md:px-8">
                
                {/* Carousel Left Btn (Hidden on small screens) */}
                <button
                    onClick={slideLeft}
                    className="shrink-0 hidden min-[881px]:flex bg-white/10 backdrop-blur-lg border border-white/20 w-10 h-10 sm:w-14 sm:h-14 rounded-full items-center justify-center hover:scale-110 transition-all text-2xl z-20"
                >
                    ‹
                </button>

                {/* Cards Container */}
                <div 
                    ref={scrollRef}
                    className="flex overflow-x-auto gap-4 sm:gap-8 snap-x snap-mandatory scrollbar-hide py-8 px-4 w-full"
                    style={{ scrollbarWidth: 'none', msOverflowStyle: 'none', scrollBehavior: 'smooth' }}
                >
                    {loading ? (
                        <div className="w-full text-center py-20 text-white/60 text-lg flex flex-col items-center gap-4 cursor-default">
                            <div className="w-8 h-8 rounded-full border-4 border-white/20 border-t-white/80 animate-spin"></div>
                            Loading posts...
                        </div>
                    ) : error ? (
                        <div className="w-full text-center py-20 text-red-400 text-lg">
                            Failed to load posts. Please try again later.
                        </div>
                    ) : posts.length === 0 ? (
                        <div className="w-full text-center py-20 text-white/60 text-lg">
                            No posts available.
                        </div>
                    ) : (
                        posts.map((post, idx) => {
                            const postTitle = post.title || "Untitled Post";
                            // Extract excerpt, default to truncating content if excerpt is missing
                            const postExcerpt = post.excerpt || 
                                              (post.content ? post.content.substring(0, 120) + "..." : "Read more about this topic in the full post.");
                            const postImage = post.image || post.coverImage || post.thumbnail || null;
                            // Use internal SPA slug route
                            const postLink = post.slug 
                                ? `/blog/${post.slug}` 
                                : "#";

                            return (
                                <motion.div
                                    key={post._id || idx}
                                    initial={{ opacity: 0, scale: 0.95, y: 30 }}
                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                    transition={{ duration: 0.5, delay: idx * 0.15 }}
                                    className="min-w-[75vw] max-w-[320px] sm:min-w-[300px] sm:max-w-[360px] min-[881px]:min-w-[30%] min-[881px]:max-w-[400px] flex-1 snap-center flex flex-col rounded-2xl overflow-hidden backdrop-blur-xl bg-white/10 border border-white/20 shadow-[0_15px_45px_-12px_rgba(0,0,0,0.6)] transition-all hover:-translate-y-2 hover:bg-white/20"
                                >
                                    {/* Optional Image Area */}
                                    {postImage ? (
                                        <div className="w-full h-48 sm:h-52 overflow-hidden bg-black/40">
                                            <img 
                                                src={postImage} 
                                                alt={postTitle} 
                                                className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                                                loading="lazy"
                                            />
                                        </div>
                                    ) : (
                                        <div className="w-full h-32 sm:h-40 overflow-hidden bg-gradient-to-br from-white/10 to-transparent flex items-center justify-center">
                                            <span className="text-white/30 font-medium tracking-wider">ARTICLE</span>
                                        </div>
                                    )}

                                    {/* Card Content Area */}
                                    <div className="p-6 sm:p-8 flex flex-col flex-grow">
                                        <h3 className="text-xl sm:text-2xl font-semibold mb-3 line-clamp-2 leading-snug">
                                            {postTitle}
                                        </h3>
                                        <p className="text-white/60 text-sm sm:text-base mb-6 line-clamp-3 leading-relaxed flex-grow">
                                            {postExcerpt}
                                        </p>
                                        <Link 
                                            to={postLink}
                                            className="mt-auto self-start text-sm sm:text-base font-semibold text-white/90 group flex items-center gap-2 hover:text-white transition-colors"
                                        >
                                            <span className="bg-white/10 px-4 py-2 rounded-full border border-white/10 group-hover:bg-white/20 group-hover:border-white/30 transition-all">
                                                Read More
                                            </span>
                                        </Link>
                                    </div>
                                </motion.div>
                            );
                        })
                    )}
                </div>

                {/* Carousel Right Btn (Hidden on small screens) */}
                <button
                    onClick={slideRight}
                    className="shrink-0 hidden min-[881px]:flex bg-white/10 backdrop-blur-lg border border-white/20 w-10 h-10 sm:w-14 sm:h-14 rounded-full items-center justify-center hover:scale-110 transition-all text-2xl z-20"
                >
                    ›
                </button>
            </div>

            {/* View All Posts Button */}
            <div className="mt-12 sm:mt-16 relative z-20">
                <Link
                    to="/blog"
                    className="px-6 py-3 sm:px-8 sm:py-4 bg-white text-black font-semibold text-base sm:text-lg rounded-full shadow-lg hover:shadow-white/20 hover:scale-105 transition-all inline-block"
                >
                    View All Posts
                </Link>
            </div>

            {/* Inline styles for hiding the scrollbar while keeping functionality */}
            <style dangerouslySetInnerHTML={{__html: `
                .scrollbar-hide::-webkit-scrollbar {
                    display: none;
                }
            `}} />
        </section>
    );
}
