import React, { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Clock, User, Tag, Search, BookOpen, Sparkles } from "lucide-react";
import { Helmet } from "react-helmet-async";

export default function AllBlogs() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const res = await fetch("https://my-blog-backend-phi.vercel.app/api/posts");
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
        // If category is comma-separated or full string
        p.category.split(",").forEach((c) => cats.add(c.trim()));
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

  return (
    <div className="min-h-screen bg-black text-white selection:bg-emerald-500 selection:text-black relative overflow-hidden">
      <Helmet>
        <title>Blog & Tech Insights | Uzair Baig</title>
        <meta
          name="description"
          content="Explore technical articles on software engineering, backend architecture, system design, web performance, and modern development by Uzair Baig."
        />
        <link rel="canonical" href="https://uzairbaig.netlify.app/blog" />

        {/* Open Graph */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://uzairbaig.netlify.app/blog" />
        <meta property="og:title" content="Blog & Tech Insights | Uzair Baig" />
        <meta
          property="og:description"
          content="Explore technical articles on software engineering, backend architecture, system design, and modern development by Uzair Baig."
        />
        <meta property="og:image" content="https://uzairbaig.netlify.app/og-image.png" />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:url" content="https://uzairbaig.netlify.app/blog" />
        <meta name="twitter:title" content="Blog & Tech Insights | Uzair Baig" />
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
            "name": "Blog & Tech Insights - Uzair Baig",
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

      {/* Glow Blobs */}
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

      <div className="relative z-10 max-w-7xl mx-auto px-6 pt-28 pb-24">
        {/* Navigation Button */}
        <div className="mb-10">
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/5 border border-white/10 text-white/70 hover:text-white hover:bg-white/10 hover:border-white/20 transition-all group backdrop-blur-sm"
          >
            <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
            <span className="font-medium">Back to Portfolio</span>
          </Link>
        </div>

        {/* Hero Header */}
        <header className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-semibold mb-6">
            <Sparkles size={16} />
            <span>Articles & Insights</span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 tracking-tight bg-gradient-to-r from-white via-gray-100 to-gray-400 bg-clip-text text-transparent">
            Technical Blog & Writing
          </h1>
          <p className="text-lg text-white/60 leading-relaxed">
            Thoughts, architectures, and practical breakdowns on software engineering, backend systems, APIs, cloud
            infrastructure, and modern web development.
          </p>
        </header>

        {/* Search & Category Filter Bar */}
        <div className="max-w-4xl mx-auto mb-14 space-y-6">
          {/* Search Input */}
          <div className="relative">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-white/40" size={20} />
            <input
              type="text"
              placeholder="Search articles by title, keyword, or topic..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-14 pr-6 py-4 rounded-2xl bg-white/5 border border-white/10 text-white placeholder-white/40 focus:outline-none focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/20 backdrop-blur-xl transition-all text-base"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-5 top-1/2 -translate-y-1/2 text-white/40 hover:text-white text-sm"
              >
                Clear
              </button>
            )}
          </div>

          {/* Categories Pill Filters */}
          {categories.length > 1 && (
            <div className="flex flex-wrap gap-2 justify-center">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-full text-xs sm:text-sm font-medium transition-all ${
                    selectedCategory === cat
                      ? "bg-emerald-500 text-black font-semibold shadow-lg shadow-emerald-500/20 scale-105"
                      : "bg-white/5 text-white/70 border border-white/10 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Content States */}
        {loading ? (
          <div className="w-full text-center py-28 flex flex-col items-center justify-center">
            <div className="w-12 h-12 rounded-full border-4 border-white/20 border-t-emerald-500 animate-spin mb-4" />
            <p className="text-white/60 text-lg animate-pulse">Loading all articles...</p>
          </div>
        ) : error ? (
          <div className="max-w-md mx-auto text-center py-20 bg-white/5 border border-white/10 rounded-3xl p-8">
            <p className="text-red-400 text-lg mb-6">Failed to load articles. Please try again later.</p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-2.5 bg-emerald-500 text-black font-bold rounded-full hover:scale-105 transition-all"
            >
              Retry
            </button>
          </div>
        ) : filteredPosts.length === 0 ? (
          <div className="max-w-md mx-auto text-center py-20 bg-white/5 border border-white/10 rounded-3xl p-8">
            <BookOpen className="mx-auto text-white/30 mb-4" size={40} />
            <h3 className="text-xl font-bold mb-2">No articles found</h3>
            <p className="text-white/60 mb-6">No articles match your current search or category filter.</p>
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("All");
              }}
              className="px-6 py-2.5 bg-white text-black font-semibold rounded-full hover:scale-105 transition-all"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPosts.map((post, idx) => {
              const postTitle = post.title || "Untitled Post";
              const postExcerpt =
                post.excerpt ||
                (post.content ? post.content.substring(0, 140) + "..." : "Read the full breakdown in this article.");
              const postImage = post.image || post.coverImage || post.thumbnail || null;
              const postLink = `/blog/${post.slug}`;
              const postDate = post.publishedAt || post.createdAt || post.date;

              return (
                <motion.article
                  key={post._id || post.slug || idx}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: idx * 0.05 }}
                  className="group flex flex-col rounded-3xl overflow-hidden backdrop-blur-xl bg-white/5 border border-white/10 hover:border-emerald-500/40 hover:bg-white/[0.08] shadow-[0_15px_45px_-12px_rgba(0,0,0,0.6)] transition-all duration-300 hover:-translate-y-2"
                >
                  {/* Card Cover Image */}
                  <Link to={postLink} className="block w-full h-52 overflow-hidden bg-black/40 relative">
                    {postImage ? (
                      <img
                        src={postImage}
                        alt={postTitle}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-emerald-900/40 to-teal-900/20 flex items-center justify-center">
                        <BookOpen className="text-white/30" size={40} />
                      </div>
                    )}
                    {post.category && (
                      <span className="absolute top-4 left-4 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-emerald-400 text-xs font-semibold">
                        {post.category.split(",")[0]}
                      </span>
                    )}
                  </Link>

                  {/* Card Body */}
                  <div className="p-6 flex flex-col flex-grow">
                    {/* Metadata Header */}
                    <div className="flex items-center gap-4 text-xs text-white/50 mb-4">
                      {postDate && (
                        <div className="flex items-center gap-1.5">
                          <Clock size={13} className="text-emerald-400" />
                          <span>
                            {new Date(postDate).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })}
                          </span>
                        </div>
                      )}
                      {post.author && (
                        <div className="flex items-center gap-1.5">
                          <User size={13} className="text-emerald-400" />
                          <span>{typeof post.author === "object" ? post.author.name : post.author}</span>
                        </div>
                      )}
                    </div>

                    {/* Post Title */}
                    <h2 className="text-xl font-bold mb-3 line-clamp-2 leading-snug group-hover:text-emerald-400 transition-colors">
                      <Link to={postLink}>{postTitle}</Link>
                    </h2>

                    {/* Excerpt */}
                    <p className="text-white/60 text-sm mb-6 line-clamp-3 leading-relaxed flex-grow">
                      {postExcerpt}
                    </p>

                    {/* Read More Footer */}
                    <div className="pt-4 border-t border-white/5 mt-auto flex items-center justify-between">
                      <Link
                        to={postLink}
                        className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-400 hover:text-emerald-300 group/link transition-colors"
                      >
                        <span>Read Article</span>
                        <span className="group-hover/link:translate-x-1 transition-transform">→</span>
                      </Link>
                    </div>
                  </div>
                </motion.article>
              );
            })}
          </div>
        )}

        {/* Footer Return Home */}
        <div className="mt-24 pt-12 border-t border-white/10 text-center">
          <Link
            to="/"
            className="inline-block px-8 py-3.5 bg-white text-black font-bold rounded-full hover:scale-105 transition-all shadow-lg hover:shadow-white/10"
          >
            Return to Portfolio Home
          </Link>
        </div>
      </div>
    </div>
  );
}
