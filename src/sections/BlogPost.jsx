import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Clock, User, Tag, Link as LinkIcon, Check, BookOpen, Share2 } from "lucide-react";
import { Helmet } from "react-helmet-async";
import { FaLinkedin, FaTwitter, FaXTwitter } from "react-icons/fa6";
import { toast } from "react-hot-toast";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import Footer from "./Footer";

function BlogPostSkeleton() {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col justify-between selection:bg-emerald-500 selection:text-black">
      {/* Background Ambient Glows */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div
          className="absolute rounded-full bg-gradient-to-r from-emerald-600 via-teal-500 to-cyan-400 opacity-10 blur-[160px]"
          style={{ width: "50vw", height: "50vw", top: "-100px", left: "-100px" }}
        />
      </div>

      <main className="flex-grow relative z-10">
        <article className="pt-24 pb-20 px-4 sm:px-6 max-w-4xl mx-auto">
          {/* Top Navigation Breadcrumbs Skeleton */}
          <div className="flex items-center justify-between gap-4 mb-10">
            <div className="flex items-center gap-3">
              <div className="h-9 w-24 rounded-full bg-white/10 animate-pulse" />
              <div className="h-9 w-28 rounded-full bg-white/10 animate-pulse" />
            </div>
            <div className="h-4 w-24 rounded bg-white/10 animate-pulse hidden sm:block" />
          </div>

          {/* Category Pill Skeleton */}
          <div className="h-7 w-28 rounded-full bg-emerald-500/20 border border-emerald-500/30 mb-6 animate-pulse" />

          {/* Headline Title Skeleton */}
          <div className="space-y-3 mb-8">
            <div className="h-10 sm:h-14 w-full sm:w-11/12 rounded-2xl bg-white/10 animate-pulse" />
            <div className="h-10 sm:h-14 w-3/4 rounded-2xl bg-white/10 animate-pulse" />
          </div>

          {/* Meta Row Skeleton */}
          <div className="flex flex-wrap items-center gap-6 py-6 border-y border-white/5 mb-8">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-white/10 animate-pulse" />
              <div className="h-4 w-24 rounded bg-white/10 animate-pulse" />
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-white/10 animate-pulse" />
              <div className="h-4 w-32 rounded bg-white/10 animate-pulse" />
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-white/10 animate-pulse" />
              <div className="h-4 w-20 rounded bg-white/10 animate-pulse" />
            </div>
          </div>

          {/* Share Buttons Row Skeleton */}
          <div className="flex items-center gap-4 mb-10">
            <div className="h-4 w-12 rounded bg-white/10 animate-pulse" />
            <div className="flex items-center gap-3">
              <div className="h-9 w-20 rounded-full bg-white/10 animate-pulse" />
              <div className="w-10 h-10 rounded-full bg-white/10 animate-pulse" />
              <div className="w-10 h-10 rounded-full bg-white/10 animate-pulse" />
              <div className="w-10 h-10 rounded-full bg-white/10 animate-pulse" />
            </div>
          </div>

          {/* Hero Featured Image Skeleton */}
          <div className="w-full aspect-video rounded-3xl bg-white/[0.07] border border-white/10 mb-12 animate-pulse" />

          {/* Article Body Content Skeleton */}
          <div className="space-y-6 max-w-none">
            <div className="space-y-3">
              <div className="h-4 w-full rounded bg-white/10 animate-pulse" />
              <div className="h-4 w-11/12 rounded bg-white/10 animate-pulse" />
              <div className="h-4 w-full rounded bg-white/10 animate-pulse" />
              <div className="h-4 w-4/5 rounded bg-white/10 animate-pulse" />
            </div>

            {/* Subheading Skeleton */}
            <div className="pt-4">
              <div className="h-8 w-2/5 rounded-xl bg-white/10 animate-pulse mb-4" />
              <div className="space-y-3">
                <div className="h-4 w-full rounded bg-white/10 animate-pulse" />
                <div className="h-4 w-5/6 rounded bg-white/10 animate-pulse" />
                <div className="h-4 w-10/12 rounded bg-white/10 animate-pulse" />
              </div>
            </div>

            {/* Blockquote / Code Skeleton */}
            <div className="p-6 rounded-2xl bg-white/[0.03] border-l-4 border-emerald-500/40 border border-white/5 my-8 space-y-2.5">
              <div className="h-4 w-11/12 rounded bg-white/10 animate-pulse" />
              <div className="h-4 w-4/5 rounded bg-white/10 animate-pulse" />
            </div>

            <div className="space-y-3">
              <div className="h-4 w-full rounded bg-white/10 animate-pulse" />
              <div className="h-4 w-9/12 rounded bg-white/10 animate-pulse" />
            </div>
          </div>

          {/* Bottom Share Box Skeleton */}
          <div className="mt-16 sm:mt-20 pt-10 border-t border-white/10">
            <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="space-y-2 w-full sm:w-1/2">
                <div className="h-5 w-36 rounded bg-white/10 animate-pulse" />
                <div className="h-3.5 w-60 rounded bg-white/10 animate-pulse" />
              </div>
              <div className="flex items-center gap-2.5">
                <div className="h-9 w-20 rounded-full bg-white/10 animate-pulse" />
                <div className="w-9 h-9 rounded-full bg-white/10 animate-pulse" />
                <div className="w-9 h-9 rounded-full bg-white/10 animate-pulse" />
              </div>
            </div>
          </div>
        </article>
      </main>

      <Footer />
    </div>
  );
}

export default function BlogPost() {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        const apiUrl = `https://my-blog-backend-phi.vercel.app/api/posts/${slug}?author=admin`;
        const res = await fetch(apiUrl);
        
        if (!res.ok) {
          if (res.status === 404) {
            throw new Error("Post not found");
          }
          throw new Error("Failed to fetch post");
        }
        
        const data = await res.json();
        if (data.success && data.post) {
          setPost(data.post);
        } else {
          setPost(data); // Fallback for old API if success field is missing
        }
      } catch (err) {
        console.error("Error fetching post:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [slug]);

  const handleNativeShare = async () => {
    const shareUrl = window.location.href;
    const shareTitle = post?.title || document.title;
    const shareText = post?.excerpt || `Check out this article "${post?.title}" by Uzair Baig`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: shareTitle,
          text: shareText,
          url: shareUrl,
        });
      } catch (err) {
        if (err.name !== "AbortError") {
          console.error("Error sharing:", err);
        }
      }
    } else {
      try {
        await navigator.clipboard.writeText(shareUrl);
        toast.success("Link copied to clipboard!", {
          style: {
            background: "#10b981",
            color: "#fff",
            borderRadius: "10px",
          },
        });
      } catch {
        toast.error("Failed to copy link");
      }
    }
  };

  if (loading) {
    return <BlogPostSkeleton />;
  }

  if (error || !post) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col justify-between">
        <div className="flex-grow flex flex-col items-center justify-center p-6 text-center">
          <h1 className="text-4xl font-bold mb-4 text-emerald-500">Oops!</h1>
          <p className="text-white/60 text-xl mb-8">{error || "Post not found"}</p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link 
              to="/blog" 
              className="px-8 py-3 bg-white text-black font-bold rounded-full hover:scale-105 transition-transform"
            >
              Browse All Blogs
            </Link>
            <Link 
              to="/" 
              className="px-8 py-3 bg-white/10 text-white font-bold rounded-full border border-white/20 hover:bg-white/20 transition-all"
            >
              Back to Home
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-black text-white selection:bg-emerald-500 selection:text-black flex flex-col justify-between"
    >
      <Helmet>
        <title>{post.ogTitle || post.title || "Blog Post"} | Uzair Baig</title>
        <meta name="description" content={post.ogDescription || post.excerpt || (post.content ? post.content.substring(0, 160).replace(/<[^>]*>?/gm, '') : "")} />
        <link rel="canonical" href={`https://uzairbaig.netlify.app/blog/${slug}`} />
        
        {/* OpenGraph / Facebook */}
        <meta property="og:type" content="article" />
        <meta property="og:url" content={`https://uzairbaig.netlify.app/blog/${slug}`} />
        <meta property="og:title" content={post.ogTitle || post.title} />
        <meta property="og:description" content={post.ogDescription || post.excerpt} />
        <meta property="og:image" content={post.ogImage || post.image || post.coverImage} />

        {/* Twitter */}
        <meta name="twitter:card" content={post.twitterCardType || "summary_large_image"} />
        <meta name="twitter:url" content={`https://uzairbaig.netlify.app/blog/${slug}`} />
        <meta name="twitter:title" content={post.ogTitle || post.title} />
        <meta name="twitter:description" content={post.ogDescription || post.excerpt} />
        <meta name="twitter:image" content={post.ogImage || post.image || post.coverImage} />
      </Helmet>

      <main className="flex-grow">
        <article className="pt-24 pb-20 px-4 sm:px-6 max-w-4xl mx-auto">
          {/* Navigation / Breadcrumb Buttons */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-10">
            <div className="flex items-center gap-3">
              <Link 
                to="/" 
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-white/70 hover:text-white hover:bg-white/10 hover:border-white/20 transition-all text-sm group backdrop-blur-sm"
              >
                <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                <span>Home</span>
              </Link>

              <Link 
                to="/blog" 
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-emerald-400 hover:text-emerald-300 hover:bg-white/10 hover:border-emerald-500/30 transition-all text-sm group backdrop-blur-sm"
              >
                <BookOpen size={16} />
                <span>All Blogs</span>
              </Link>
            </div>

            <Link
              to="/sitemap.html"
              className="text-xs text-white/50 hover:text-emerald-400 transition-colors"
            >
              View Sitemap
            </Link>
          </div>

          {/* Header Section */}
          <header className="mb-12">
            {post.category && (
              <span className="inline-block px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-semibold mb-6">
                {post.category}
              </span>
            )}
            
            <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold mb-8 leading-tight tracking-tight">
              {post.title}
            </h1>

            <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-white/50 text-sm border-y border-white/5 py-6">
              {post.author && (
                <div className="flex items-center gap-2">
                  <User size={16} className="text-emerald-500" />
                  <span className="font-medium">
                    {typeof post.author === 'object' ? post.author.name : post.author}
                  </span>
                </div>
              )}
              <div className="flex items-center gap-2">
                <Clock size={16} className="text-emerald-500" />
                <span>{new Date(post.createdAt || Date.now()).toLocaleDateString('en-US', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}</span>
              </div>
              {post.tags && post.tags.length > 0 && (
                <div className="flex items-center gap-2">
                  <Tag size={16} className="text-emerald-500" />
                  <div className="flex flex-wrap gap-2">
                    {post.tags.map((tag, i) => (
                      <span key={i} className="hover:text-emerald-400 cursor-pointer transition-colors">#{tag}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Social Sharing Section */}
            <div className="flex flex-wrap items-center gap-3 sm:gap-4 mt-8">
              <span className="text-white/70 font-medium text-sm sm:text-base">Share:</span>
              <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
                {/* Native OS Share Button */}
                <button
                  onClick={handleNativeShare}
                  className="inline-flex items-center gap-2 px-3.5 py-2 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500 hover:text-black hover:scale-105 active:scale-95 transition-all duration-300 text-xs sm:text-sm font-semibold shadow-sm"
                  title="Share via Native OS (Apps, AirDrop, Messages)"
                >
                  <Share2 size={15} />
                  <span>Share</span>
                </button>

                {/* LinkedIn */}
                <button
                  onClick={() => {
                    const url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`;
                    window.open(url, '_blank', 'noreferrer');
                  }}
                  className="w-10 h-10 flex items-center justify-center rounded-full bg-white/5 border border-white/10 text-white/70 hover:bg-[#0077b5] hover:text-white hover:scale-110 transition-all duration-300"
                  title="Share on LinkedIn"
                >
                  <FaLinkedin size={18} />
                </button>

                {/* X (Twitter) */}
                <button
                  onClick={() => {
                    const url = `https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(post.title)}`;
                    window.open(url, '_blank', 'noreferrer');
                  }}
                  className="w-10 h-10 flex items-center justify-center rounded-full bg-white/5 border border-white/10 text-white/70 hover:bg-black hover:text-white hover:scale-110 transition-all duration-300"
                  title="Share on X (Twitter)"
                >
                  <FaXTwitter size={18} />
                </button>

                {/* Copy Link */}
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(window.location.href);
                    toast.success("Link copied to clipboard!", {
                      style: {
                        background: '#10b981',
                        color: '#fff',
                        borderRadius: '10px',
                      }
                    });
                  }}
                  className="w-10 h-10 flex items-center justify-center rounded-full bg-white/5 border border-white/10 text-white/70 hover:bg-emerald-500 hover:text-white hover:scale-110 transition-all duration-300"
                  title="Copy Link"
                >
                  <LinkIcon size={18} />
                </button>
              </div>
            </div>
          </header>

          {/* Hero Image */}
          {(post.image || post.coverImage) && (
            <div className="w-full rounded-3xl overflow-hidden mb-12 shadow-2xl border border-white/10 aspect-video">
              <img 
                src={post.image || post.coverImage} 
                alt={post.title} 
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Content Section */}
          <div className="prose prose-invert prose-emerald max-w-none">
            <div className="text-base sm:text-lg leading-relaxed text-white/80 blog-content">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {post.content}
              </ReactMarkdown>
            </div>
          </div>

          {/* Bottom Share & Footer Callout */}
          <div className="mt-16 sm:mt-20 pt-10 border-t border-white/10 space-y-8">
            {/* Bottom Share Bar */}
            <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <h4 className="text-base font-semibold text-white">Share this article</h4>
                <p className="text-xs text-white/50">Pass along this insight with your network or friends.</p>
              </div>
              <div className="flex items-center gap-2.5">
                <button
                  onClick={handleNativeShare}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500 text-black hover:bg-emerald-400 font-bold text-xs transition-all hover:scale-105 shadow-md shadow-emerald-500/20"
                >
                  <Share2 size={14} />
                  <span>Share</span>
                </button>
                <button
                  onClick={() => {
                    const url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`;
                    window.open(url, '_blank', 'noreferrer');
                  }}
                  className="p-2.5 rounded-full bg-white/5 hover:bg-[#0077b5] text-white/80 hover:text-white border border-white/10 transition-all text-sm"
                  title="Share on LinkedIn"
                >
                  <FaLinkedin size={16} />
                </button>
                <button
                  onClick={() => {
                    const url = `https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(post.title)}`;
                    window.open(url, '_blank', 'noreferrer');
                  }}
                  className="p-2.5 rounded-full bg-white/5 hover:bg-black text-white/80 hover:text-white border border-white/10 transition-all text-sm"
                  title="Share on X"
                >
                  <FaXTwitter size={16} />
                </button>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(window.location.href);
                    toast.success("Link copied to clipboard!");
                  }}
                  className="p-2.5 rounded-full bg-white/5 hover:bg-emerald-500 hover:text-black text-white/80 border border-white/10 transition-all text-sm"
                  title="Copy Link"
                >
                  <LinkIcon size={16} />
                </button>
              </div>
            </div>

            {/* Navigation Callout */}
            <div className="flex flex-col items-center text-center gap-6">
              <div className="flex flex-wrap items-center justify-center gap-4">
                <Link 
                  to="/blog" 
                  className="px-8 py-3.5 bg-emerald-500 hover:bg-emerald-400 text-black font-bold rounded-full transition-all hover:scale-105 shadow-lg shadow-emerald-500/20 text-sm"
                >
                  Browse All Articles
                </Link>
                <Link 
                  to="/" 
                  className="px-8 py-3.5 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-full border border-white/15 transition-all hover:scale-105 text-sm"
                >
                  Explore Portfolio
                </Link>
              </div>
            </div>
          </div>
        </article>
      </main>

      {/* Global Revamped Footer */}
      <Footer />

      <style dangerouslySetInnerHTML={{ __html: `
        .blog-content h2 { font-size: 2rem; font-weight: 700; margin-top: 2.5rem; margin-bottom: 1.25rem; color: #10b981; }
        .blog-content h3 { font-size: 1.5rem; font-weight: 600; margin-top: 2rem; margin-bottom: 1rem; color: #34d399; }
        .blog-content p { margin-bottom: 1.75rem; line-height: 1.9; color: rgba(255, 255, 255, 0.85); white-space: pre-line; }
        .blog-content ul { list-style-type: none; padding-left: 0; margin-bottom: 2rem; }
        .blog-content li { position: relative; padding-left: 1.5rem; margin-bottom: 0.75rem; color: rgba(255, 255, 255, 0.8); }
        .blog-content li::before { content: "•"; position: absolute; left: 0; color: #10b981; font-weight: bold; }
        .blog-content ol { list-style-type: decimal; padding-left: 1.5rem; margin-bottom: 2rem; color: rgba(255, 255, 255, 0.8); }
        .blog-content blockquote { border-left: 4px solid #10b981; padding: 1rem 1.5rem; font-style: italic; color: #d1d5db; background: rgba(16, 185, 129, 0.05); border-radius: 0 0.5rem 0.5rem 0; margin: 2.5rem 0; }
        .blog-content img { border-radius: 1.5rem; margin: 3rem 0; border: 1px solid rgba(255,255,255,0.1); width: 100%; height: auto; box-shadow: 0 20px 40px rgba(0,0,0,0.4); }
        .blog-content a { color: #10b981; text-decoration: underline; text-underline-offset: 4px; transition: all 0.2s; }
        .blog-content a:hover { color: #34d399; opacity: 0.8; }
        .blog-content code { background: rgba(255,255,255,0.1); padding: 0.2rem 0.4rem; border-radius: 0.25rem; font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace; font-size: 0.9em; }
      `}} />
    </motion.div>
  );
}
