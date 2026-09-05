import React, { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Helmet } from "react-helmet-async";
import { 
  ArrowLeft, 
  Search, 
  Globe, 
  FileText, 
  Layers, 
  ExternalLink, 
  Copy, 
  Check, 
  FolderTree, 
  Sparkles, 
  BookOpen, 
  Briefcase, 
  Mail, 
  Share2, 
  Compass, 
  CheckCircle2 
} from "lucide-react";
import { FaGithub, FaLinkedin, FaFacebook, FaCode, FaRobot, FaSitemap } from "react-icons/fa";
import { toast } from "react-hot-toast";
import Footer from "./Footer";

export default function Sitemap() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [copiedLink, setCopiedLink] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loadingPosts, setLoadingPosts] = useState(true);

  // Fetch blog posts for dynamic sitemap indexing
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoadingPosts(true);
        const res = await fetch("https://my-blog-backend-phi.vercel.app/api/posts?author=admin");
        if (res.ok) {
          const data = await res.json();
          const postsArray = Array.isArray(data) ? data : (data.posts || data.data || []);
          setPosts(postsArray);
        }
      } catch (err) {
        console.error("Failed to load blog posts for sitemap:", err);
      } finally {
        setLoadingPosts(false);
      }
    };

    fetchPosts();
    window.scrollTo(0, 0);
  }, []);

  const handleCopy = (url, label) => {
    const fullUrl = url.startsWith("http") ? url : `${window.location.origin}${url}`;
    navigator.clipboard.writeText(fullUrl);
    setCopiedLink(url);
    toast.success(`Copied: ${label}`);
    setTimeout(() => setCopiedLink(null), 2000);
  };

  // Core static pages and anchor sections
  const corePages = useMemo(() => [
    {
      title: "Portfolio Home",
      path: "/",
      type: "Page",
      category: "core",
      description: "Main portfolio landing page featuring introduction, hero visual, and full developer overview.",
      priority: "1.0",
      changefreq: "weekly"
    },
    {
      title: "About Me",
      path: "/#about",
      type: "Section",
      category: "core",
      description: "Background, technical philosophy, coding journey, and professional summary.",
      priority: "0.9",
      changefreq: "monthly"
    },
    {
      title: "Technical Skills & Stack",
      path: "/#skills",
      type: "Section",
      category: "core",
      description: "Comprehensive breakdown of frontend, backend, database, and devops proficiencies.",
      priority: "0.8",
      changefreq: "monthly"
    },
    {
      title: "Featured Projects",
      path: "/#projects",
      type: "Section",
      category: "core",
      description: "Curated collection of live client applications, platforms, and interactive works.",
      priority: "0.9",
      changefreq: "weekly"
    },
    {
      title: "Work Experience & Timeline",
      path: "/#experience",
      type: "Section",
      category: "core",
      description: "Professional career history, engineering milestones, and responsibilities.",
      priority: "0.8",
      changefreq: "monthly"
    },
    {
      title: "Client Testimonials",
      path: "/#testimonials",
      type: "Section",
      category: "core",
      description: "Client feedback, recommendations, and collaborative endorsements.",
      priority: "0.7",
      changefreq: "monthly"
    },
    {
      title: "Contact & Inquiries",
      path: "/#contact",
      type: "Section",
      category: "core",
      description: "Direct contact form, communication channels, and consultation inquiries.",
      priority: "0.8",
      changefreq: "monthly"
    },
    {
      title: "All Blog Articles Hub",
      path: "/blog",
      type: "Page",
      category: "blog",
      description: "Full directory of published tech insights, engineering tutorials, and articles.",
      priority: "0.9",
      changefreq: "daily"
    },
  ], []);

  // Live Projects
  const projectPages = useMemo(() => [
    {
      title: "nk studio",
      path: "https://www.nk.studio/",
      type: "External Project",
      category: "projects",
      description: "Modern digital agency and creative showcase website.",
      priority: "0.7",
      isExternal: true
    },
    {
      title: "Gamily App",
      path: "https://gamilyapp.com/",
      type: "External Project",
      category: "projects",
      description: "Interactive gaming and community-driven mobile/web application.",
      priority: "0.7",
      isExternal: true
    },
    {
      title: "Hungry Tiger",
      path: "https://www.eathungrytiger.com/",
      type: "External Project",
      category: "projects",
      description: "Brand website and digital ordering platform for culinary brand.",
      priority: "0.7",
      isExternal: true
    },
  ], []);

  // Social & External Channels
  const socialChannels = useMemo(() => [
    {
      title: "GitHub Profile",
      path: "https://github.com/uziii-stack",
      type: "Social Profile",
      category: "social",
      description: "Open source contributions, repositories, and development activity.",
      priority: "0.8",
      isExternal: true
    },
    {
      title: "LinkedIn Profile",
      path: "https://linkedin.com/in/uzair-baig-22b983385",
      type: "Social Profile",
      category: "social",
      description: "Professional networking, career updates, and verified credentials.",
      priority: "0.8",
      isExternal: true
    },
    {
      title: "Facebook Page",
      path: "https://www.facebook.com/share/1BqGxYS5NX/?mibextid=wwXIfr",
      type: "Social Profile",
      category: "social",
      description: "Social updates and media presence.",
      priority: "0.5",
      isExternal: true
    },
    {
      title: "Direct Email Inquiries",
      path: "mailto:uzairbaig040@gmail.com",
      type: "Direct Channel",
      category: "social",
      description: "Direct email contact for contract, freelance, and job opportunities.",
      priority: "0.8",
      isExternal: true
    },
  ], []);

  // Dynamic Blog Items
  const dynamicBlogItems = useMemo(() => {
    return posts.map((post) => ({
      title: post.title || "Untitled Blog Post",
      path: `/blog/${post.slug || post._id}`,
      type: "Blog Article",
      category: "blog",
      description: post.excerpt || (post.content ? post.content.substring(0, 110) + "..." : "Technical article and development guide."),
      tag: post.category || "Development",
      priority: "0.8",
      changefreq: "monthly",
      date: post.createdAt ? new Date(post.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" }) : null
    }));
  }, [posts]);

  // Combine all items
  const allItems = useMemo(() => {
    return [
      ...corePages,
      ...dynamicBlogItems,
      ...projectPages,
      ...socialChannels,
    ];
  }, [corePages, dynamicBlogItems, projectPages, socialChannels]);

  // Filter items based on activeTab and searchQuery
  const filteredItems = useMemo(() => {
    return allItems.filter((item) => {
      const matchesTab = 
        activeTab === "all" ? true :
        activeTab === "core" ? item.category === "core" :
        activeTab === "blog" ? item.category === "blog" :
        activeTab === "projects" ? item.category === "projects" :
        activeTab === "social" ? item.category === "social" : true;

      const q = searchQuery.toLowerCase().trim();
      const matchesSearch = 
        !q ||
        item.title.toLowerCase().includes(q) ||
        item.path.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        (item.tag && item.tag.toLowerCase().includes(q));

      return matchesTab && matchesSearch;
    });
  }, [allItems, activeTab, searchQuery]);

  const tabs = [
    { id: "all", label: "All Links", count: allItems.length },
    { id: "core", label: "Core Pages", count: corePages.length },
    { id: "blog", label: "Blog & Articles", count: dynamicBlogItems.length + 1 },
    { id: "projects", label: "Live Projects", count: projectPages.length },
    { id: "social", label: "Connect & Social", count: socialChannels.length },
  ];

  const getTypeBadgeColor = (type) => {
    switch (type) {
      case "Page":
        return "bg-purple-500/10 text-purple-400 border-purple-500/20";
      case "Section":
        return "bg-blue-500/10 text-blue-400 border-blue-500/20";
      case "Blog Article":
        return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
      case "External Project":
        return "bg-amber-500/10 text-amber-400 border-amber-500/20";
      case "Social Profile":
      case "Direct Channel":
        return "bg-pink-500/10 text-pink-400 border-pink-500/20";
      default:
        return "bg-cyan-500/10 text-cyan-400 border-cyan-500/20";
    }
  };

  return (
    <div className="min-h-screen bg-[#050508] text-white flex flex-col selection:bg-emerald-500 selection:text-black">
      <Helmet>
        <title>HTML Sitemap | Uzair Baig Portfolio & Resources</title>
        <meta 
          name="description" 
          content="Complete visual sitemap and index of all portfolio pages, technical skills, client projects, blog posts, and resources by Uzair Baig." 
        />
        <link rel="canonical" href="https://uzairbaig.netlify.app/sitemap.html" />
        <meta name="robots" content="index, follow" />
      </Helmet>

      {/* Hero & Header Section */}
      <header className="relative pt-24 pb-14 px-4 sm:px-6 lg:px-8 border-b border-white/10 overflow-hidden">
        {/* Glowing Background Ambience */}
        <div className="pointer-events-none absolute -top-20 -left-20 w-96 h-96 bg-emerald-500/15 rounded-full blur-[140px]" />
        <div className="pointer-events-none absolute top-1/2 -right-20 w-96 h-96 bg-blue-600/15 rounded-full blur-[140px]" />

        <div className="max-w-6xl mx-auto relative z-10">
          {/* Breadcrumbs & Home button */}
          <div className="flex items-center justify-between gap-4 mb-8">
            <Link
              to="/"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-white/80 hover:text-white transition-all text-sm group"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              <span>Back to Portfolio</span>
            </Link>

            <div className="hidden sm:flex items-center gap-2 text-xs text-white/50">
              <Link to="/" className="hover:text-emerald-400 transition-colors">Home</Link>
              <span>/</span>
              <span className="text-white/80 font-medium">Sitemap.html</span>
            </div>
          </div>

          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold uppercase tracking-wider">
              <FolderTree className="w-3.5 h-3.5" />
              Website Index & Navigation Map
            </div>

            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-white via-gray-100 to-gray-400 bg-clip-text text-transparent">
              HTML Sitemap Directory
            </h1>

            <p className="text-white/60 text-base sm:text-lg max-w-2xl leading-relaxed">
              Explore the complete hierarchy of pages, section anchors, technical articles, live projects, and public endpoints across this portfolio.
            </p>
          </div>

          {/* Key Stat Badges */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mt-8">
            <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 backdrop-blur-sm">
              <div className="text-xs text-white/50 mb-1">Total Indexed Items</div>
              <div className="text-2xl font-bold text-white flex items-center gap-2">
                {allItems.length}
                <Sparkles className="w-4 h-4 text-emerald-400" />
              </div>
            </div>
            <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 backdrop-blur-sm">
              <div className="text-xs text-white/50 mb-1">Core Sections</div>
              <div className="text-2xl font-bold text-purple-400">{corePages.length}</div>
            </div>
            <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 backdrop-blur-sm">
              <div className="text-xs text-white/50 mb-1">Published Articles</div>
              <div className="text-2xl font-bold text-emerald-400">
                {loadingPosts ? "..." : dynamicBlogItems.length}
              </div>
            </div>
            <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 backdrop-blur-sm">
              <div className="text-xs text-white/50 mb-1">Live Works & Connect</div>
              <div className="text-2xl font-bold text-blue-400">{projectPages.length + socialChannels.length}</div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-grow max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Search & Tabs Controls */}
        <div className="space-y-6 mb-10">
          {/* Search Input */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
            <input
              type="text"
              placeholder="Search by page name, keyword, route, or topic..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-white/5 border border-white/10 text-white placeholder-white/40 text-sm sm:text-base focus:outline-none focus:border-emerald-500/60 focus:ring-1 focus:ring-emerald-500/60 transition-all backdrop-blur-md"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-xs bg-white/10 hover:bg-white/20 text-white/70 px-2.5 py-1 rounded-full transition-colors"
              >
                Clear
              </button>
            )}
          </div>

          {/* Filter Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-medium whitespace-nowrap transition-all ${
                    isActive
                      ? "bg-emerald-500 text-black font-bold shadow-lg shadow-emerald-500/20"
                      : "bg-white/5 text-white/70 border border-white/10 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  <span>{tab.label}</span>
                  <span
                    className={`px-1.5 py-0.5 rounded-md text-[10px] ${
                      isActive ? "bg-black/20 text-black font-bold" : "bg-white/10 text-white/60"
                    }`}
                  >
                    {tab.count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Dynamic Category Grouping */}
        {filteredItems.length === 0 ? (
          <div className="py-20 text-center rounded-3xl bg-white/[0.02] border border-white/10">
            <Compass className="w-12 h-12 text-white/30 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-white mb-1">No links matched your search</h3>
            <p className="text-white/50 text-sm max-w-md mx-auto mb-6">
              Try searching with another keyword or reset the active filter tab.
            </p>
            <button
              onClick={() => {
                setSearchQuery("");
                setActiveTab("all");
              }}
              className="px-5 py-2.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-sm font-medium text-white transition-all"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <AnimatePresence>
              {filteredItems.map((item, idx) => {
                const isCopied = copiedLink === item.path;

                return (
                  <motion.div
                    key={`${item.path}-${idx}`}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.2, delay: idx * 0.03 }}
                    className="p-5 rounded-2xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/10 hover:border-emerald-500/30 transition-all duration-200 flex flex-col justify-between group backdrop-blur-sm"
                  >
                    <div>
                      {/* Card Header: Type Badge, Category & Priority */}
                      <div className="flex items-center justify-between gap-2 mb-3">
                        <span
                          className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${getTypeBadgeColor(
                            item.type
                          )}`}
                        >
                          {item.type}
                        </span>

                        <div className="flex items-center gap-2 text-[11px] text-white/40">
                          {item.priority && (
                            <span title="Indexing Priority">P: {item.priority}</span>
                          )}
                          {item.date && (
                            <span>• {item.date}</span>
                          )}
                        </div>
                      </div>

                      {/* Title & Description */}
                      <h3 className="text-lg font-bold text-white group-hover:text-emerald-400 transition-colors mb-2 flex items-center gap-2">
                        {item.title}
                        {item.isExternal && (
                          <ExternalLink className="w-3.5 h-3.5 opacity-50 group-hover:opacity-100 transition-opacity" />
                        )}
                      </h3>

                      <p className="text-white/60 text-xs sm:text-sm leading-relaxed mb-4">
                        {item.description}
                      </p>
                    </div>

                    {/* Card Footer: Target URL & Action Buttons */}
                    <div className="pt-3 border-t border-white/5 flex items-center justify-between gap-3">
                      <div className="text-[11px] font-mono text-emerald-400/80 truncate max-w-[200px] sm:max-w-[260px]">
                        {item.path}
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        {/* Copy Link Button */}
                        <button
                          onClick={() => handleCopy(item.path, item.title)}
                          className="p-2 rounded-lg bg-white/5 hover:bg-white/15 border border-white/10 text-white/70 hover:text-white transition-all text-xs"
                          title="Copy Link URL"
                        >
                          {isCopied ? (
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>

                        {/* Visit Button */}
                        {item.isExternal ? (
                          <a
                            href={item.path}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-xs font-semibold transition-all"
                          >
                            <span>Open</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        ) : item.path.startsWith("/#") ? (
                          <a
                            href={item.path}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-emerald-500 hover:text-black border border-white/10 text-white text-xs font-semibold transition-all"
                          >
                            <span>Jump</span>
                          </a>
                        ) : (
                          <Link
                            to={item.path}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500 text-black hover:bg-emerald-400 text-xs font-bold transition-all shadow-md shadow-emerald-500/20"
                          >
                            <span>Navigate</span>
                          </Link>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </main>

      {/* Reusable Revamped Footer */}
      <Footer />
    </div>
  );
}
