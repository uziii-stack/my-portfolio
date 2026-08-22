import React, { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Clock,
  User,
  Search,
  BookOpen,
  Sparkles,
  SlidersHorizontal,
  X,
  Heart,
  ChevronRight,
  Check,
} from "lucide-react";
import { Helmet } from "react-helmet-async";

// Vibrant category badge colors matching the reference design
const badgeStyles = [
  "bg-[#7c3aed] text-white", // Purple (New Article)
  "bg-[#ea580c] text-white", // Orange (Popular Read)
  "bg-[#0284c7] text-white", // Sky Blue
  "bg-[#059669] text-white", // Emerald
  "bg-[#db2777] text-white", // Pink
  "bg-[#4f46e5] text-white", // Indigo
];

function getCategoryColor(index) {
  return badgeStyles[index % badgeStyles.length];
}

function formatCategory(category) {
  if (!category) return "Article";
  // Get the primary category segment
  const primary = category.split(/[/,]/)[0].trim();
  return primary || "Article";
}

export default function AllBlogs() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [likedPosts, setLikedPosts] = useState({});

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const res = await fetch("https://my-blog-backend-phi.vercel.app/api/posts?author=admin");
        if (!res.ok) throw new Error("Failed to fetch blog posts");
        const data = await res.json();
        const postsArray = Array.isArray(data) ? data : (data.posts || data.data || []);
        setPosts(postsArray);
      } catch (err) {
        console.error("Error fetching posts:", err);
        setError(err.message || "Failed to load posts");
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
    window.scrollTo(0, 0);
  }, []);

  // Extract unique categories
  const categories = useMemo(() => {
    const cats = new Set(["All"]);
    posts.forEach((p) => {
      if (p.category) {
        p.category.split(/[/,]/).forEach((c) => {
          const trimmed = c.trim();
          if (trimmed) cats.add(trimmed);
        });
      }
    });
    return Array.from(cats);
  }, [posts]);

  // Filter posts by search query and category
  const filteredPosts = useMemo(() => {
    return posts.filter((post) => {
      const titleMatch = (post.title || "").toLowerCase().includes(searchQuery.toLowerCase());
      const excerptMatch = (post.excerpt || post.content || "").toLowerCase().includes(searchQuery.toLowerCase());
      const categoryMatch =
        selectedCategory === "All" ||
        (post.category && post.category.toLowerCase().includes(selectedCategory.toLowerCase()));
      return (titleMatch || excerptMatch) && categoryMatch;
    });
  }, [posts, searchQuery, selectedCategory]);

  const toggleLike = (e, slug) => {
    e.preventDefault();
    e.stopPropagation();
    setLikedPosts((prev) => ({
      ...prev,
      [slug]: !prev[slug],
    }));
  };

  return (
    <div className="min-h-screen bg-black text-white selection:bg-emerald-500 selection:text-black relative overflow-hidden">
      <Helmet>
        <title>Blog & Technical Articles | Uzair Baig</title>
        <meta
          name="description"
          content="Explore technical articles on software engineering, backend architecture, system design, web performance, and modern development by Uzair Baig."
        />
        <link rel="canonical" href="https://uzairbaig.netlify.app/blog" />

        {/* Open Graph */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://uzairbaig.netlify.app/blog" />
        <meta property="og:title" content="Blog & Technical Articles | Uzair Baig" />
        <meta
          property="og:description"
          content="Explore technical articles on software engineering, backend architecture, system design, and modern development by Uzair Baig."
        />
        <meta property="og:image" content="https://uzairbaig.netlify.app/og-image.png" />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:url" content="https://uzairbaig.netlify.app/blog" />
        <meta name="twitter:title" content="Blog & Technical Articles | Uzair Baig" />
        <meta
          name="twitter:description"
          content="Explore technical articles on software engineering, backend architecture, system design, and modern development by Uzair Baig."
        />
        <meta name="twitter:image" content="https://uzairbaig.netlify.app/og-image.png" />

        {/* Structured Data (CollectionPage / Blog) */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            "name": "Blog & Technical Articles - Uzair Baig",
            "url": "https://uzairbaig.netlify.app/blog",
            "description": "Technical articles, system design guides, and software engineering insights by Uzair Baig.",
            "publisher": {
              "@type": "Person",
              "name": "Uzair Baig",
              "url": "https://uzairbaig.netlify.app",
            },
          })}
        </script>
      </Helmet>

      {/* Background Glow Blobs */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div
          className="absolute rounded-full bg-gradient-to-r from-emerald-600 via-teal-500 to-cyan-400 opacity-15 blur-[160px]"
          style={{ width: "60vw", height: "60vw", top: "-200px", left: "-200px" }}
        />
        <div
          className="absolute rounded-full bg-gradient-to-r from-cyan-400 via-emerald-500 to-teal-600 opacity-15 blur-[160px]"
          style={{ width: "50vw", height: "50vw", bottom: "-150px", right: "-150px" }}
        />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 pt-24 pb-20">
        {/* Top Header Bar with Back Button */}
        <div className="flex items-center justify-between mb-8">
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-white/70 hover:text-white hover:bg-white/10 transition-all text-sm backdrop-blur-sm group"
          >
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
            <span>Portfolio</span>
          </Link>

          {/* Filter Modal Trigger Button */}
          <button
            onClick={() => setIsFilterModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 border border-white/15 text-white font-medium text-sm transition-all shadow-md active:scale-95"
          >
            <SlidersHorizontal size={15} className="text-emerald-400" />
            <span>Filters</span>
            {selectedCategory !== "All" && (
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            )}
          </button>
        </div>

        {/* Search Bar */}
        <div className="relative mb-8">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" size={18} />
          <input
            type="text"
            placeholder="Search articles..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-10 py-3.5 rounded-2xl bg-white/5 border border-white/10 text-white placeholder-white/40 focus:outline-none focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/20 backdrop-blur-xl transition-all text-sm sm:text-base"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white text-xs bg-white/10 px-2 py-1 rounded-md"
            >
              Clear
            </button>
          )}
        </div>

        {/* Active Filter Indicator */}
        {(selectedCategory !== "All" || searchQuery) && (
          <div className="flex items-center gap-2 flex-wrap mb-6 text-xs text-white/60">
            <span>Filtering by:</span>
            {selectedCategory !== "All" && (
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-medium">
                {selectedCategory}
                <X
                  size={12}
                  className="cursor-pointer hover:text-white"
                  onClick={() => setSelectedCategory("All")}
                />
              </span>
            )}
            {searchQuery && (
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-white/10 text-white/90 border border-white/20">
                "{searchQuery}"
                <X
                  size={12}
                  className="cursor-pointer hover:text-white"
                  onClick={() => setSearchQuery("")}
                />
              </span>
            )}
            <button
              onClick={() => {
                setSelectedCategory("All");
                setSearchQuery("");
              }}
              className="text-emerald-400 hover:underline ml-1"
            >
              Reset all
            </button>
          </div>
        )}

        {/* Content States */}
        {loading ? (
          <div className="flex flex-col gap-5 sm:gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="flex items-center gap-4 sm:gap-6 p-3 sm:p-4 rounded-3xl bg-white/[0.03] border border-white/5 animate-pulse shadow-lg backdrop-blur-md"
              >
                {/* Left Thumbnail Skeleton */}
                <div className="w-24 h-24 sm:w-32 sm:h-32 shrink-0 rounded-2xl bg-white/10" />

                {/* Right Content Skeleton */}
                <div className="flex flex-col justify-center flex-1 min-w-0 pr-2">
                  {/* Category Pill Skeleton */}
                  <div className="w-24 h-5 rounded-full bg-white/10 mb-2.5" />

                  {/* Title Skeleton Lines */}
                  <div className="w-4/5 h-4 sm:h-5 rounded-lg bg-white/10 mb-2" />
                  <div className="w-2/3 h-4 sm:h-5 rounded-lg bg-white/10 mb-3" />

                  {/* Read More Link Skeleton */}
                  <div className="w-20 h-3.5 rounded-md bg-white/5" />
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-16 bg-white/5 border border-white/10 rounded-2xl p-6">
            <p className="text-red-400 text-sm mb-4">Failed to load articles.</p>
            <button
              onClick={() => window.location.reload()}
              className="px-5 py-2 bg-emerald-500 text-black font-semibold text-xs rounded-full"
            >
              Retry
            </button>
          </div>
        ) : filteredPosts.length === 0 ? (
          <div className="text-center py-16 bg-white/5 border border-white/10 rounded-2xl p-6">
            <BookOpen className="mx-auto text-white/30 mb-3" size={32} />
            <h3 className="text-lg font-bold mb-1">No articles found</h3>
            <p className="text-white/50 text-xs mb-4">Try adjusting your search or category filter.</p>
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("All");
              }}
              className="px-5 py-2 bg-white text-black font-semibold text-xs rounded-full"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          /* List View matching the reference design */
          <div className="flex flex-col gap-5 sm:gap-6">
            {filteredPosts.map((post, idx) => {
              const postTitle = post.title || "Untitled Post";
              const postImage = post.image || post.coverImage || post.thumbnail || null;
              const postLink = `/blog/${post.slug}`;
              const postCategory = formatCategory(post.category);
              const badgeColor = getCategoryColor(idx);
              const isLiked = !!likedPosts[post.slug];

              return (
                <motion.article
                  key={post._id || post.slug || idx}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: idx * 0.04 }}
                  className="group relative flex items-center gap-4 sm:gap-6 p-3 sm:p-4 rounded-3xl bg-white/[0.04] border border-white/10 hover:border-white/20 hover:bg-white/[0.07] transition-all duration-300 shadow-lg backdrop-blur-md"
                >
                  {/* Left Side Thumbnail Image with Heart Icon */}
                  <Link
                    to={postLink}
                    className="relative w-24 h-24 sm:w-32 sm:h-32 shrink-0 rounded-2xl overflow-hidden bg-white/5 block shadow-md"
                  >
                    {postImage ? (
                      <img
                        src={postImage}
                        alt={postTitle}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-emerald-950 to-neutral-900 flex items-center justify-center">
                        <BookOpen className="text-white/30" size={24} />
                      </div>
                    )}

                    {/* Heart/Favorite Icon */}
                    <button
                      onClick={(e) => toggleLike(e, post.slug)}
                      className="absolute top-2 left-2 w-7 h-7 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center text-white/80 hover:text-rose-400 hover:scale-110 transition-all z-10"
                      title="Save article"
                    >
                      <Heart
                        size={14}
                        className={isLiked ? "fill-rose-500 text-rose-500" : "text-white/80"}
                      />
                    </button>
                  </Link>

                  {/* Right Side Content */}
                  <div className="flex flex-col justify-center flex-1 min-w-0 pr-1 sm:pr-2">
                    {/* Category / Status Pill Badge */}
                    <div className="mb-2 flex items-center">
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-[11px] sm:text-xs font-semibold tracking-wide shadow-sm max-w-[160px] sm:max-w-xs truncate whitespace-nowrap leading-tight ${badgeColor}`}
                        title={post.category || "Article"}
                      >
                        {postCategory}
                      </span>
                    </div>

                    {/* Article Title */}
                    <h2 className="text-sm sm:text-base md:text-lg font-bold text-white leading-snug line-clamp-2 mb-2 sm:mb-3 group-hover:text-emerald-400 transition-colors">
                      <Link to={postLink}>{postTitle}</Link>
                    </h2>

                    {/* Read More Action Link */}
                    <Link
                      to={postLink}
                      className="inline-flex items-center gap-1 text-xs sm:text-sm font-medium text-white/70 group-hover:text-white transition-colors"
                    >
                      <span>Read more</span>
                      <ChevronRight size={15} className="group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </motion.article>
              );
            })}
          </div>
        )}

        {/* Footer Return Home */}
        <div className="mt-16 pt-8 border-t border-white/10 text-center">
          <Link
            to="/"
            className="inline-block px-7 py-3 bg-white text-black font-semibold text-sm rounded-full hover:scale-105 transition-all shadow-lg"
          >
            Back to Portfolio Home
          </Link>
        </div>
      </div>

      {/* FILTER MODAL POPUP (Bottom Sheet / Centered Modal) */}
      <AnimatePresence>
        {isFilterModalOpen && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsFilterModalOpen(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
            />

            {/* Modal Content */}
            <motion.div
              initial={{ y: "100%", opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: "100%", opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative w-full sm:max-w-lg bg-[#111111] border border-white/15 rounded-t-3xl sm:rounded-3xl p-6 shadow-2xl z-10 max-h-[85vh] overflow-y-auto"
            >
              {/* Header */}
              <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-6">
                <div className="flex items-center gap-2">
                  <SlidersHorizontal size={18} className="text-emerald-400" />
                  <h3 className="text-lg font-bold text-white">Filter Articles</h3>
                </div>
                <button
                  onClick={() => setIsFilterModalOpen(false)}
                  className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/80 hover:text-white transition-colors"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Categories Section */}
              <div className="mb-6">
                <label className="block text-xs font-semibold uppercase tracking-wider text-white/50 mb-3">
                  Categories
                </label>
                <div className="flex flex-wrap gap-2">
                  {categories.map((cat) => {
                    const isSelected = selectedCategory === cat;
                    return (
                      <button
                        key={cat}
                        onClick={() => setSelectedCategory(cat)}
                        className={`flex items-center gap-1.5 px-4 py-2.5 rounded-full text-xs font-medium transition-all ${
                          isSelected
                            ? "bg-emerald-500 text-black font-bold shadow-lg shadow-emerald-500/20 scale-105"
                            : "bg-white/5 text-white/80 border border-white/10 hover:bg-white/10 hover:text-white"
                        }`}
                      >
                        {isSelected && <Check size={12} />}
                        <span>{cat}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3 pt-4 border-t border-white/10">
                <button
                  onClick={() => {
                    setSelectedCategory("All");
                    setSearchQuery("");
                  }}
                  className="flex-1 py-3 rounded-xl bg-white/5 border border-white/10 text-white/70 hover:text-white font-medium text-xs transition-colors"
                >
                  Reset
                </button>
                <button
                  onClick={() => setIsFilterModalOpen(false)}
                  className="flex-1 py-3 rounded-xl bg-emerald-500 text-black font-bold text-xs hover:bg-emerald-400 transition-colors shadow-lg shadow-emerald-500/20"
                >
                  Apply Filters ({filteredPosts.length})
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
