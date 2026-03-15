import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Clock, User, Tag } from "lucide-react";
import { Helmet } from "react-helmet-async";

export default function BlogPost() {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        const apiUrl = `https://my-blog-backend-phi.vercel.app/api/posts/${slug}`;
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

      {/* Navigation */}
      <nav className="fixed top-0 left-0 w-full z-50 bg-black/50 backdrop-blur-xl border-b border-white/10 px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center">
          <Link to="/" className="flex items-center gap-2 text-white/70 hover:text-white transition-colors group">
            <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
            <span className="font-medium">Back to Portfolio</span>
          </Link>
        </div>
      </nav>

      <article className="pt-32 pb-20 px-6 max-w-4xl mx-auto">
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
                <span className="font-medium">{post.author}</span>
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
          <div 
            className="text-lg leading-relaxed text-white/80 space-y-6 blog-content"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
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
        .blog-content h2 { font-size: 2rem; font-weight: 700; margin-top: 2.5rem; margin-bottom: 1rem; color: #10b981; }
        .blog-content h3 { font-size: 1.5rem; font-weight: 600; margin-top: 2rem; margin-bottom: 0.75rem; color: #34d399; }
        .blog-content p { margin-bottom: 1.5rem; line-height: 1.8; }
        .blog-content ul { list-style-type: disc; padding-left: 1.5rem; margin-bottom: 1.5rem; }
        .blog-content ol { list-style-type: decimal; padding-left: 1.5rem; margin-bottom: 1.5rem; }
        .blog-content li { margin-bottom: 0.5rem; }
        .blog-content blockquote { border-left: 4px solid #10b981; padding-left: 1.5rem; font-style: italic; color: #d1d5db; margin: 2rem 0; }
        .blog-content img { border-radius: 1rem; margin: 2.5rem 0; border: 1px solid rgba(255,255,255,0.1); }
        .blog-content a { color: #10b981; text-decoration: underline; transition: color 0.2s; }
        .blog-content a:hover { color: #34d399; }
      `}} />
    </motion.div>
  );
}
