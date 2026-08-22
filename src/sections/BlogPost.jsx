import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Clock, User, Tag, Link as LinkIcon, Check } from "lucide-react";
import { Helmet } from "react-helmet-async";
import { FaLinkedin, FaTwitter, FaXTwitter } from "react-icons/fa6";
import { toast } from "react-hot-toast";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

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
    window.scrollTo(0, 0);
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-4">
        <div className="w-12 h-12 rounded-full border-4 border-white/20 border-t-emerald-500 animate-spin mb-4"></div>
        <p className="text-white/60 animate-pulse text-lg">Loading post...</p>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-4 text-center">
        <h1 className="text-4xl font-bold mb-4 text-emerald-500">Oops!</h1>
        <p className="text-white/60 text-xl mb-8">{error || "Post not found"}</p>
        <Link 
          to="/" 
          className="px-8 py-3 bg-white text-black font-bold rounded-full hover:scale-105 transition-transform"
        >
          Back to Portfolio
        </Link>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-black text-white selection:bg-emerald-500 selection:text-black"
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

      <article className="pt-24 pb-20 px-6 max-w-4xl mx-auto">
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
        {/* Header Section */}
        <header className="mb-12">
          {post.category && (
            <span className="inline-block px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-semibold mb-6">
              {post.category}
            </span>
          )}
          
          <h1 className="text-4xl md:text-6xl font-bold mb-8 leading-tight tracking-tight">
            {post.title}
          </h1>

          <div className="flex flex-wrap items-center gap-6 text-white/50 text-sm border-y border-white/5 py-6">
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
                <div className="flex gap-2">
                  {post.tags.map((tag, i) => (
                    <span key={i} className="hover:text-emerald-400 cursor-pointer transition-colors">#{tag}</span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Social Sharing Section */}
          <div className="flex items-center gap-4 mt-8">
            <span className="text-white/70 font-medium text-lg">Share:</span>
            <div className="flex gap-3">
              <button
                onClick={() => {
                  const url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`;
                  window.open(url, '_blank', 'noreferrer');
                }}
                className="w-11 h-11 flex items-center justify-center rounded-full bg-white/5 border border-white/10 text-white/70 hover:bg-[#0077b5] hover:text-white hover:scale-110 transition-all duration-300"
                title="Share on LinkedIn"
              >
                <FaLinkedin size={20} />
              </button>
              <button
                onClick={() => {
                  const url = `https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(post.title)}`;
                  window.open(url, '_blank', 'noreferrer');
                }}
                className="w-11 h-11 flex items-center justify-center rounded-full bg-white/5 border border-white/10 text-white/70 hover:bg-black hover:text-white hover:scale-110 transition-all duration-300"
                title="Share on X (Twitter)"
              >
                <FaXTwitter size={20} />
              </button>
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
                className="w-11 h-11 flex items-center justify-center rounded-full bg-white/5 border border-white/10 text-white/70 hover:bg-emerald-500 hover:text-white hover:scale-110 transition-all duration-300"
                title="Copy Link"
              >
                <LinkIcon size={20} />
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
          <div className="text-lg leading-relaxed text-white/80 blog-content">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {post.content}
            </ReactMarkdown>
          </div>
        </div>

        {/* Footer Navigation */}
        <div className="mt-20 pt-12 border-t border-white/10 flex flex-col items-center gap-8">
           <h3 className="text-2xl font-bold">Enjoyed this post?</h3>
           <Link 
            to="/" 
            className="group relative px-10 py-4 bg-emerald-500 text-black font-bold rounded-full overflow-hidden transition-all hover:scale-105 active:scale-95"
          >
            <span className="relative z-10">Explore My Portfolio</span>
            <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity" />
          </Link>
        </div>
      </article>

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
