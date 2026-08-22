/**
 * Netlify Edge Function: blog-og-tags
 * Intercepts /blog and /blog/* requests for ALL visitors and crawlers to inject complete, dynamic,
 * valid SEO metadata, canonical URLs, JSON-LD structured data, and full semantic HTML directly into
 * the production HTML response before JavaScript execution, while preserving full React CSR execution
 * and interactivity in the browser.
 */

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

// Helper: Convert full markdown post content into safe semantic HTML
function renderMarkdownToHtml(markdown) {
  if (!markdown) return "";
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

    // Unordered lists (-, *, •)
    const lines = block.split("\n");
    const isUl = lines.length > 0 && lines.every(l => /^(\s*[-*•]\s+)/.test(l));
    if (isUl) {
      const items = lines.map(l => `<li>${renderInline(l.replace(/^\s*[-*•]\s+/, ""))}</li>`).join("");
      htmlBlocks.push(`<ul>${items}</ul>`);
      continue;
    }

    // Ordered lists (1. , 2. )
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

// Helper: Strip static index.html head tags and static Person JSON-LD
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

// Helper: Generate a genuine HTTP 404 response for invalid slugs
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
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }
    body {
      background-color: #000000;
      color: #ffffff;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 1.5rem;
      position: relative;
      overflow: hidden;
    }
    .glow {
      position: absolute;
      width: 450px;
      height: 450px;
      background: radial-gradient(circle, rgba(16, 185, 129, 0.15) 0%, rgba(6, 78, 59, 0.05) 50%, transparent 70%);
      filter: blur(60px);
      pointer-events: none;
      z-index: 0;
    }
    .card {
      position: relative;
      z-index: 1;
      max-width: 520px;
      width: 100%;
      background: rgba(255, 255, 255, 0.03);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 1.5rem;
      padding: 3rem 2rem;
      text-align: center;
      backdrop-filter: blur(16px);
      -webkit-backdrop-filter: blur(16px);
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.7);
    }
    .badge {
      display: inline-block;
      font-size: 0.875rem;
      font-weight: 700;
      letter-spacing: 0.1em;
      text-transform: uppercase;
      color: #10b981;
      background: rgba(16, 185, 129, 0.1);
      border: 1px solid rgba(16, 185, 129, 0.2);
      padding: 0.35rem 0.85rem;
      border-radius: 9999px;
      margin-bottom: 1.25rem;
    }
    h1 {
      font-size: 2rem;
      font-weight: 800;
      letter-spacing: -0.025em;
      margin-bottom: 1rem;
      color: #ffffff;
    }
    p {
      color: rgba(255, 255, 255, 0.65);
      font-size: 1rem;
      line-height: 1.6;
      margin-bottom: 2.25rem;
    }
    .actions {
      display: flex;
      flex-direction: row;
      gap: 0.75rem;
      justify-content: center;
      flex-wrap: wrap;
    }
    .btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      padding: 0.75rem 1.5rem;
      border-radius: 9999px;
      font-size: 0.875rem;
      font-weight: 600;
      text-decoration: none;
      transition: all 0.2s ease;
    }
    .btn-primary {
      background-color: #10b981;
      color: #000000;
    }
    .btn-primary:hover {
      background-color: #34d399;
      transform: translateY(-1px);
    }
    .btn-secondary {
      background: rgba(255, 255, 255, 0.06);
      color: #ffffff;
      border: 1px solid rgba(255, 255, 255, 0.15);
    }
    .btn-secondary:hover {
      background: rgba(255, 255, 255, 0.12);
      border-color: rgba(255, 255, 255, 0.25);
      transform: translateY(-1px);
    }
  </style>
</head>
<body>
  <div class="glow"></div>
  <main class="card">
    <span class="badge">404</span>
    <h1>Blog Post Not Found</h1>
    <p>The blog post you&#39;re looking for doesn&#39;t exist or may have been moved.</p>
    <div class="actions">
      <a href="/blog" class="btn btn-primary">Browse Blog</a>
      <a href="/" class="btn btn-secondary">Return Home</a>
    </div>
  </main>
</body>
</html>`;
}

export default async (request, context) => {
  const url = new URL(request.url);

  // 1. Normalize pathname and extract slug safely (handling trailing slashes)
  const cleanPath = url.pathname.replace(/\/+$/, "");
  const parts = cleanPath.split("/").filter(Boolean);

  // If path does not start with blog, pass through to normal SPA
  if (parts.length === 0 || parts[0] !== "blog") {
    return context.next();
  }

  const slug = parts.length >= 2 ? decodeURIComponent(parts[1]).trim() : "";

  // ==========================================
  // CASE 1: Blog Listing Page (/blog)
  // ==========================================
  if (!slug) {
    try {
      // Fetch all posts from the backend API (filtered to Uzair)
      let posts = [];
      try {
        const apiUrl = "https://my-blog-backend-phi.vercel.app/api/posts?author=admin";
        const apiResponse = await fetch(apiUrl);
        if (apiResponse.ok) {
          const data = await apiResponse.json();
          posts = Array.isArray(data) ? data : (data.posts || data.data || []);
        }
      } catch (fetchErr) {
        console.error("Error fetching blog posts for listing SSR:", fetchErr);
      }

      // Get the base SPA HTML response from Netlify
      const spaResponse = await context.next();
      const originalHtml = await spaResponse.text();

      const title = "Blog & Technical Articles | Uzair Baig";
      const description = "Explore technical articles on software engineering, backend architecture, system design, web performance, and modern development by Uzair Baig.";
      const canonicalUrl = "https://uzairbaig.netlify.app/blog";
      const ogImage = "https://uzairbaig.netlify.app/og-image.png";

      // Generate CollectionPage + ItemList Structured Data (JSON-LD)
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

      // Render server HTML for blog listing
      const postsHtml = validPosts.map((post) => {
        const postTitle = post.title || "Untitled Post";
        const postSlug = post.slug || "";
        const postLink = `/blog/${postSlug}`;
        const postImage = post.image || post.coverImage || post.thumbnail || post.ogImage || null;
        const postExcerpt = post.excerpt || (post.content ? post.content.substring(0, 160).replace(/[#*`_\[\]]/g, "").trim() : "");
        const dateVal = post.publishedAt || post.createdAt || post.date;
        let formattedDate = "";
        if (dateVal) {
          try {
            formattedDate = new Date(dateVal).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
          } catch (_) {}
        }

        return `
      <li>
        <article>
          <header>
            <h2><a href="${postLink}">${escapeHtml(postTitle)}</a></h2>
            ${post.category ? `<span>${escapeHtml(post.category)}</span>` : ""}
            ${dateVal ? `<time datetime="${escapeHtml(dateVal)}">${escapeHtml(formattedDate)}</time>` : ""}
          </header>
          ${postImage ? `<figure><a href="${postLink}"><img src="${escapeHtml(postImage)}" alt="${escapeHtml(postTitle)}" loading="lazy" /></a></figure>` : ""}
          ${postExcerpt ? `<p>${escapeHtml(postExcerpt)}</p>` : ""}
          <footer>
            <a href="${postLink}">Read more</a>
          </footer>
        </article>
      </li>`;
      }).join("\n");

      const listingHtml = `
  <main>
    <header>
      <h1>Blog &amp; Technical Articles</h1>
      <p>${escapeHtml(description)}</p>
    </header>
    <section aria-label="Articles">
      <ul>
${postsHtml}
      </ul>
    </section>
  </main>`;

      let modifiedHtml = stripStaticHeadTags(originalHtml);
      modifiedHtml = modifiedHtml.replace("</head>", `${dynamicHeadTags}\n</head>`);
      modifiedHtml = modifiedHtml.replace(
        /<div id=["']root["']>\s*<\/div>/is,
        `<div id="root">${listingHtml}</div>`
      );

      return new Response(modifiedHtml, {
        status: 200,
        headers: {
          "content-type": "text/html; charset=UTF-8",
          "cache-control": "public, max-age=0, must-revalidate",
        },
      });
    } catch (error) {
      console.error("Listing Edge Function Error:", error);
      return context.next();
    }
  }

  // ==========================================
  // CASE 2: Individual Blog Post (/blog/{slug}) - PRESERVED EXISTING SSR
  // ==========================================
  try {
    const apiUrl = `https://my-blog-backend-phi.vercel.app/api/posts/${encodeURIComponent(slug)}`;
    const apiResponse = await fetch(apiUrl);

    if (apiResponse.status === 404) {
      return new Response(generate404Html(slug), {
        status: 404,
        headers: { "content-type": "text/html; charset=UTF-8" },
      });
    }

    if (!apiResponse.ok) {
      return new Response(generate404Html(slug), {
        status: apiResponse.status >= 400 && apiResponse.status < 500 ? 404 : 502,
        headers: { "content-type": "text/html; charset=UTF-8" },
      });
    }

    const data = await apiResponse.json();
    const post = (data && data.success && data.post) ? data.post : (data && data.post ? data.post : data);

    if (!post || (!post._id && !post.title && !post.slug)) {
      return new Response(generate404Html(slug), {
        status: 404,
        headers: { "content-type": "text/html; charset=UTF-8" },
      });
    }

    // Get the base SPA HTML response from Netlify (contains compiled scripts & styles)
    const spaResponse = await context.next();
    const originalHtml = await spaResponse.text();

    // Extract and prepare dynamic metadata
    const title = post.ogTitle || post.title || "Blog Post";
    let description = post.ogDescription || post.excerpt || "";
    if (!description && post.content) {
      description = post.content.substring(0, 160).replace(/[#*`_\[\]]/g, "").trim();
    }

    const image = post.ogImage || post.coverImage || post.image || "https://uzairbaig.netlify.app/og-image.png";
    const canonicalUrl = `https://uzairbaig.netlify.app/blog/${slug}`;

    const authorName = post.author && typeof post.author === "object"
      ? (post.author.name || "Uzair Baig")
      : (post.author || "Uzair Baig");

    const publishedDate = post.publishedAt || post.createdAt || post.date || new Date().toISOString();
    const modifiedDate = post.updatedAt || publishedDate;

    // Render full article content
    const renderedContent = renderMarkdownToHtml(post.content || description);

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

    // Replace static default tags with dynamic blog tags in the HTML
    let modifiedHtml = stripStaticHeadTags(originalHtml);

    // Inject dynamic head tags before </head>
    modifiedHtml = modifiedHtml.replace("</head>", `${dynamicHeadTags}\n</head>`);

    // Inject full semantic article HTML inside <div id="root">...</div>
    const articleHtml = `
  <main>
    <article>
      <header>
        <h1>${escapeHtml(post.title || title)}</h1>
        ${post.publishedAt || post.createdAt ? `<time datetime="${escapeHtml(publishedDate)}">${escapeHtml(new Date(publishedDate).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }))}</time>` : ""}
        ${authorName ? `<address>By ${escapeHtml(authorName)}</address>` : ""}
        ${post.category ? `<p>Category: ${escapeHtml(post.category)}</p>` : ""}
      </header>

      ${image ? `<figure><img src="${escapeHtml(image)}" alt="${escapeHtml(post.title || title)}" /></figure>` : ""}

      <div class="article-content">
${renderedContent}
      </div>
    </article>
  </main>`;

    modifiedHtml = modifiedHtml.replace(
      /<div id=["']root["']>\s*<\/div>/is,
      `<div id="root">${articleHtml}</div>`
    );

    return new Response(modifiedHtml, {
      status: 200,
      headers: {
        "content-type": "text/html; charset=UTF-8",
        "cache-control": "public, max-age=0, must-revalidate",
      },
    });
  } catch (error) {
    console.error("Edge Function Error:", error);
    return new Response(generate404Html(slug), {
      status: 500,
      headers: { "content-type": "text/html; charset=UTF-8" },
    });
  }
};

export const config = {
  path: ["/blog", "/blog/*"],
};
