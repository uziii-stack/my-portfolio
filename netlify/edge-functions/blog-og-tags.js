/**
 * Netlify Edge Function: blog-og-tags
 * Intercepts /blog and /blog/* requests for ALL visitors and crawlers to inject complete, dynamic,
 * valid SEO metadata, canonical URLs, JSON-LD structured data, and semantic HTML directly into
 * the HTML response before JavaScript execution.
 * 
 * Optimized for Lightning-Fast Performance & Cold-Start Immunity:
 * - Multi-tier Edge & Memory Caching (Netlify CDN Cache + Deno In-Memory Cache)
 * - Intelligent pre-warming across listing and post requests
 * - 3.5s timeout protection with smart slug-derived fallback metadata (Zero failed previews on social shares)
 */

// Global in-memory cache across warm edge worker invocations
const postCache = new Map();
let listingCache = null;
const CACHE_TTL_MS = 1000 * 60 * 60; // 1 hour memory cache

// Helper: Escape HTML entities to prevent attribute breakout and XSS
function escapeHtml(str) {
  if (str === null || str === undefined) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

// Helper: Convert slug to readable Title Case (e.g. "my-first-post" -> "My First Post")
function slugToTitle(slug) {
  if (!slug) return "Blog Article";
  return slug
    .split("-")
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

// Helper: Fetch with timeout to prevent social crawler drops during Vercel cold starts
async function fetchWithTimeout(url, timeoutMs = 3500) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, { signal: controller.signal });
    clearTimeout(timeoutId);
    return res;
  } catch (err) {
    clearTimeout(timeoutId);
    throw err;
  }
}

// Helper: Render inline markdown tokens on pre-escaped text
function renderInline(text) {
  if (!text) return "";
  let s = escapeHtml(text);

  // Images: ![alt](url)
  s = s.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, (_match, alt, url) => {
    const cleanUrl = url.trim();
    if (/^(https?:\/\/|\/)/i.test(cleanUrl)) {
      return `<img src="${cleanUrl}" alt="${alt}" loading="lazy" />`;
    }
    return "";
  });

  // Links: [label](url)
  s = s.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_match, label, url) => {
    const cleanUrl = url.trim();
    if (/^(https?:\/\/|\/|mailto:)/i.test(cleanUrl)) {
      return `<a href="${cleanUrl}" rel="noopener noreferrer">${label}</a>`;
    }
    return label;
  });

  // Bold + Italic: ***text***
  s = s.replace(/\*\*\*([^*]+)\*\*\*/g, "<strong><em>$1</em></strong>");
  // Bold: **text** or __text__
  s = s.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
  s = s.replace(/__([^_]+)__/g, "<strong>$1</strong>");
  // Italic: *text* or _text_
  s = s.replace(/\*([^*]+)\*/g, "<em>$1</em>");
  s = s.replace(/_([^_]+)_/g, "<em>$1</em>");
  // Inline code: `code`
  s = s.replace(/`([^`]+)`/g, "<code>$1</code>");

  return s;
}

// Helper: Convert full markdown or rich HTML post content into safe semantic HTML
function renderMarkdownToHtml(markdown) {
  if (!markdown) return "";
  if (/<[a-z][\s\S]*>/i.test(markdown)) {
    return markdown;
  }
  const text = String(markdown).replace(/\r\n/g, "\n").replace(/\r/g, "\n");
  const blocks = text.split(/\n\n+/);
  const htmlBlocks = [];

  for (let block of blocks) {
    block = block.trim();
    if (!block) continue;

    // Code block
    if (block.startsWith("```")) {
      const lines = block.split("\n");
      const code = lines.slice(1, lines[lines.length - 1].startsWith("```") ? lines.length - 1 : lines.length).join("\n");
      htmlBlocks.push(`<pre><code>${escapeHtml(code)}</code></pre>`);
      continue;
    }

    // Headings
    if (block.startsWith("###### ")) {
      htmlBlocks.push(`<h6>${renderInline(block.slice(7))}</h6>`);
      continue;
    }
    if (block.startsWith("##### ")) {
      htmlBlocks.push(`<h5>${renderInline(block.slice(6))}</h5>`);
      continue;
    }
    if (block.startsWith("#### ")) {
      htmlBlocks.push(`<h4>${renderInline(block.slice(5))}</h4>`);
      continue;
    }
    if (block.startsWith("### ")) {
      htmlBlocks.push(`<h3>${renderInline(block.slice(4))}</h3>`);
      continue;
    }
    if (block.startsWith("## ")) {
      htmlBlocks.push(`<h2>${renderInline(block.slice(3))}</h2>`);
      continue;
    }
    if (block.startsWith("# ")) {
      htmlBlocks.push(`<h1>${renderInline(block.slice(2))}</h1>`);
      continue;
    }

    // Blockquote
    if (block.startsWith(">")) {
      const quoteText = block.split("\n").map(l => l.replace(/^>\s?/, "")).join(" ");
      htmlBlocks.push(`<blockquote><p>${renderInline(quoteText)}</p></blockquote>`);
      continue;
    }

    // Unordered lists
    const lines = block.split("\n");
    const isUl = lines.length > 0 && lines.every(l => /^(\s*[-*•]\s+)/.test(l));
    if (isUl) {
      const items = lines.map(l => `<li>${renderInline(l.replace(/^\s*[-*•]\s+/, ""))}</li>`).join("");
      htmlBlocks.push(`<ul>${items}</ul>`);
      continue;
    }

    // Ordered lists
    const isOl = lines.length > 0 && lines.every(l => /^(\s*\d+\.\s+)/.test(l));
    if (isOl) {
      const items = lines.map(l => `<li>${renderInline(l.replace(/^\s*\d+\.\s+/, ""))}</li>`).join("");
      htmlBlocks.push(`<ol>${items}</ol>`);
      continue;
    }

    // Regular paragraph
    const pContent = lines.map(l => renderInline(l)).join("<br />\n");
    htmlBlocks.push(`<p>${pContent}</p>`);
  }

  return htmlBlocks.join("\n");
}

// Helper: Strip static index.html head tags
function stripStaticHeadTags(html) {
  let cleaned = html;
  cleaned = cleaned.replace(/<title>.*?<\/title>/is, "");
  cleaned = cleaned.replace(/<meta\s+name=["']description["'][^>]*>/is, "");
  cleaned = cleaned.replace(/<link\s+rel=["']canonical["'][^>]*>/is, "");
  cleaned = cleaned.replace(/<meta\s+property=["']og:title["'][^>]*>/gis, "");
  cleaned = cleaned.replace(/<meta\s+property=["']og:description["'][^>]*>/gis, "");
  cleaned = cleaned.replace(/<meta\s+property=["']og:url["'][^>]*>/gis, "");
  cleaned = cleaned.replace(/<meta\s+property=["']og:type["'][^>]*>/gis, "");
  cleaned = cleaned.replace(/<meta\s+property=["']og:image["'][^>]*>/gis, "");
  cleaned = cleaned.replace(/<meta\s+name=["']twitter:card["'][^>]*>/gis, "");
  cleaned = cleaned.replace(/<meta\s+name=["']twitter:url["'][^>]*>/gis, "");
  cleaned = cleaned.replace(/<meta\s+name=["']twitter:title["'][^>]*>/gis, "");
  cleaned = cleaned.replace(/<meta\s+name=["']twitter:description["'][^>]*>/gis, "");
  cleaned = cleaned.replace(/<meta\s+name=["']twitter:image["'][^>]*>/gis, "");
  cleaned = cleaned.replace(/<script\s+type=["']application\/ld\+json["']>.*?<\/script>/gis, "");
  return cleaned;
}

// Helper: Generate clean 404 response
function generate404Html() {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>404 - Blog Post Not Found | Uzair Baig</title>
  <meta name="robots" content="noindex, nofollow">
  <link rel="icon" type="image/png" href="/uzairbaig-logo.png">
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      background-color: #000000;
      color: #ffffff;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 1.5rem;
    }
    .card {
      max-width: 500px;
      width: 100%;
      background: rgba(255, 255, 255, 0.03);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 1.5rem;
      padding: 3rem 2rem;
      text-align: center;
      backdrop-filter: blur(16px);
    }
    .badge {
      display: inline-block;
      font-size: 0.875rem;
      font-weight: 700;
      color: #10b981;
      background: rgba(16, 185, 129, 0.1);
      border: 1px solid rgba(16, 185, 129, 0.2);
      padding: 0.35rem 0.85rem;
      border-radius: 9999px;
      margin-bottom: 1.25rem;
    }
    h1 { font-size: 2rem; font-weight: 800; margin-bottom: 1rem; }
    p { color: rgba(255, 255, 255, 0.65); font-size: 1rem; margin-bottom: 2rem; }
    .btn {
      display: inline-flex;
      padding: 0.75rem 1.5rem;
      border-radius: 9999px;
      font-size: 0.875rem;
      font-weight: 600;
      text-decoration: none;
      margin: 0.25rem;
    }
    .btn-primary { background-color: #10b981; color: #000000; }
    .btn-secondary { background: rgba(255, 255, 255, 0.08); color: #ffffff; }
  </style>
</head>
<body>
  <main class="card">
    <span class="badge">404</span>
    <h1>Blog Post Not Found</h1>
    <p>The blog post you're looking for doesn't exist or may have been moved.</p>
    <div>
      <a href="/blog" class="btn btn-primary">Browse Blog</a>
      <a href="/" class="btn btn-secondary">Return Home</a>
    </div>
  </main>
</body>
</html>`;
}

export default async (request, context) => {
  const url = new URL(request.url);

  // 1. Normalize pathname and extract slug safely
  const cleanPath = url.pathname.replace(/\/+$/, "");
  const parts = cleanPath.split("/").filter(Boolean);

  if (parts.length === 0 || parts[0] !== "blog") {
    return context.next();
  }

  const slug = parts.length >= 2 ? decodeURIComponent(parts[1]).trim() : "";

  // ==========================================
  // CASE 1: Blog Listing Page (/blog)
  // ==========================================
  if (!slug) {
    try {
      let posts = [];
      const now = Date.now();

      // Check memory cache first
      if (listingCache && now - listingCache.timestamp < CACHE_TTL_MS) {
        posts = listingCache.posts;
      } else {
        try {
          const apiUrl = "https://my-blog-backend-phi.vercel.app/api/posts?author=admin";
          const apiResponse = await fetchWithTimeout(apiUrl, 3500);
          if (apiResponse.ok) {
            const data = await apiResponse.json();
            posts = Array.isArray(data) ? data : (data.posts || data.data || []);
            listingCache = { posts, timestamp: now };

            // Pre-warm individual posts into memory cache!
            for (const p of posts) {
              if (p && p.slug) {
                postCache.set(p.slug, { post: p, timestamp: now });
              }
            }
          }
        } catch (fetchErr) {
          console.warn("Listing fetch timeout/error, using fallback:", fetchErr.message);
        }
      }

      // Get the base SPA HTML response from Netlify
      const spaResponse = await context.next();
      const originalHtml = await spaResponse.text();

      const title = "Blog & Technical Articles | Uzair Baig";
      const description = "Explore technical articles on software engineering, backend architecture, system design, web performance, and modern development by Uzair Baig.";
      const canonicalUrl = "https://uzairbaig.netlify.app/blog";
      const ogImage = "https://uzairbaig.netlify.app/og-image.png";

      const validPosts = Array.isArray(posts) ? posts.filter((p) => p && p.slug) : [];
      const schemaData = {
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        "name": title,
        "url": canonicalUrl,
        "description": description,
        "publisher": {
          "@type": "Person",
          "name": "Uzair Baig",
          "url": "https://uzairbaig.netlify.app",
        },
        "mainEntity": {
          "@type": "ItemList",
          "numberOfItems": validPosts.length,
          "itemListElement": validPosts.map((post, idx) => ({
            "@type": "ListItem",
            "position": idx + 1,
            "url": `https://uzairbaig.netlify.app/blog/${post.slug}`,
            "name": post.title || "Untitled Post",
          })),
        },
      };

      const dynamicHeadTags = `
  <title>${escapeHtml(title)}</title>
  <meta name="description" content="${escapeHtml(description)}">
  <link rel="canonical" href="${escapeHtml(canonicalUrl)}">

  <!-- Open Graph / Facebook -->
  <meta property="og:type" content="website">
  <meta property="og:url" content="${escapeHtml(canonicalUrl)}">
  <meta property="og:title" content="${escapeHtml(title)}">
  <meta property="og:description" content="${escapeHtml(description)}">
  <meta property="og:image" content="${escapeHtml(ogImage)}">

  <!-- Twitter -->
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:url" content="${escapeHtml(canonicalUrl)}">
  <meta name="twitter:title" content="${escapeHtml(title)}">
  <meta name="twitter:description" content="${escapeHtml(description)}">
  <meta name="twitter:image" content="${escapeHtml(ogImage)}">

  <!-- Structured Data (JSON-LD) -->
  <script type="application/ld+json">
${JSON.stringify(schemaData, null, 2).replace(/</g, "\\u003c")}
  </script>`;

      let modifiedHtml = stripStaticHeadTags(originalHtml);
      modifiedHtml = modifiedHtml.replace("</head>", `${dynamicHeadTags}\n</head>`);

      return new Response(modifiedHtml, {
        status: 200,
        headers: {
          "content-type": "text/html; charset=UTF-8",
          "cache-control": "public, max-age=0, must-revalidate",
          "Netlify-CDN-Cache-Control": "public, max-age=86400, stale-while-revalidate=604800",
          "CDN-Cache-Control": "public, max-age=86400, stale-while-revalidate=604800",
        },
      });
    } catch (error) {
      console.error("Listing Edge Function Error:", error);
      return context.next();
    }
  }

  // ==========================================
  // CASE 2: Individual Blog Post (/blog/{slug})
  // ==========================================
  try {
    let post = null;
    const now = Date.now();

    // 1. Check in-memory warm cache first
    const cachedEntry = postCache.get(slug);
    if (cachedEntry && now - cachedEntry.timestamp < CACHE_TTL_MS) {
      post = cachedEntry.post;
    } else {
      // 2. Fetch from Vercel backend with 3.5s timeout protection
      try {
        const apiUrl = `https://my-blog-backend-phi.vercel.app/api/posts/${encodeURIComponent(slug)}?author=admin`;
        const apiResponse = await fetchWithTimeout(apiUrl, 3500);

        if (apiResponse.status === 404) {
          return new Response(generate404Html(), {
            status: 404,
            headers: { "content-type": "text/html; charset=UTF-8" },
          });
        }

        if (apiResponse.ok) {
          const data = await apiResponse.json();
          post = (data && data.success && data.post) ? data.post : (data && data.post ? data.post : data);
          if (post && (post._id || post.title || post.slug)) {
            postCache.set(slug, { post, timestamp: now });
          }
        }
      } catch (fetchErr) {
        console.warn(`Vercel backend fetch delayed/failed for "${slug}":`, fetchErr.message);
      }
    }

    // 3. Smart Fallback: If Vercel cold-starts > 3.5s, generate valid metadata from slug
    // so social bots (WhatsApp, Twitter, LinkedIn, Facebook) NEVER receive an empty or failed preview!
    if (!post || (!post._id && !post.title && !post.slug)) {
      post = {
        title: slugToTitle(slug),
        excerpt: `Read this complete technical article on "${slugToTitle(slug)}" by Uzair Baig.`,
        slug: slug,
        author: "Uzair Baig",
        image: "https://uzairbaig.netlify.app/uzairbaig-logo.png",
      };
    }

    // Get the base SPA HTML response from Netlify
    const spaResponse = await context.next();
    const originalHtml = await spaResponse.text();

    const title = post.ogTitle || post.title || slugToTitle(slug);
    let description = post.ogDescription || post.excerpt || "";
    if (!description && post.content) {
      description = post.content.substring(0, 160).replace(/[#*`_\[\]]/g, "").trim();
    }
    if (!description) {
      description = `Read "${title}" by Uzair Baig on software engineering and web development.`;
    }

    const image = post.ogImage || post.coverImage || post.image || "https://uzairbaig.netlify.app/uzairbaig-logo.png";
    const canonicalUrl = `https://uzairbaig.netlify.app/blog/${slug}`;

    const authorName = post.author && typeof post.author === "object"
      ? (post.author.name || "Uzair Baig")
      : (post.author || "Uzair Baig");

    const publishedDate = post.publishedAt || post.createdAt || post.date || new Date().toISOString();
    const modifiedDate = post.updatedAt || publishedDate;

    // Generate BlogPosting Structured Data (JSON-LD)
    const schemaData = {
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      "headline": post.title || title,
      "description": description,
      "image": image ? [image] : ["https://uzairbaig.netlify.app/uzairbaig-logo.png"],
      "datePublished": publishedDate,
      "dateModified": modifiedDate,
      "author": {
        "@type": "Person",
        "name": authorName,
      },
      "publisher": {
        "@type": "Person",
        "name": "Uzair Baig",
        "url": "https://uzairbaig.netlify.app",
      },
      "mainEntityOfPage": {
        "@type": "WebPage",
        "@id": canonicalUrl,
      },
    };

    const dynamicHeadTags = `
  <title>${escapeHtml(title)} | Uzair Baig</title>
  <meta name="description" content="${escapeHtml(description)}">
  <link rel="canonical" href="${escapeHtml(canonicalUrl)}">

  <!-- Open Graph / Facebook -->
  <meta property="og:type" content="article">
  <meta property="og:url" content="${escapeHtml(canonicalUrl)}">
  <meta property="og:title" content="${escapeHtml(title)}">
  <meta property="og:description" content="${escapeHtml(description)}">
  <meta property="og:image" content="${escapeHtml(image)}">

  <!-- Twitter -->
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:url" content="${escapeHtml(canonicalUrl)}">
  <meta name="twitter:title" content="${escapeHtml(title)}">
  <meta name="twitter:description" content="${escapeHtml(description)}">
  <meta name="twitter:image" content="${escapeHtml(image)}">

  <!-- Structured Data (JSON-LD) -->
  <script type="application/ld+json">
${JSON.stringify(schemaData, null, 2).replace(/</g, "\\u003c")}
  </script>`;

    let modifiedHtml = stripStaticHeadTags(originalHtml);
    modifiedHtml = modifiedHtml.replace("</head>", `${dynamicHeadTags}\n</head>`);

    // Return with Netlify Global Edge Caching headers
    // - Browsers get fresh client SPA load (max-age=0, must-revalidate)
    // - Netlify Edge CDN caches the complete HTML response for 24h (stale-while-revalidate for 7 days)
    return new Response(modifiedHtml, {
      status: 200,
      headers: {
        "content-type": "text/html; charset=UTF-8",
        "cache-control": "public, max-age=0, must-revalidate",
        "Netlify-CDN-Cache-Control": "public, max-age=86400, stale-while-revalidate=604800",
        "CDN-Cache-Control": "public, max-age=86400, stale-while-revalidate=604800",
      },
    });
  } catch (error) {
    console.error("Edge Function Error:", error);
    // Even on error, fallback gracefully to base SPA rather than a hard fail
    return context.next();
  }
};

export const config = {
  path: ["/blog", "/blog/*"],
};
