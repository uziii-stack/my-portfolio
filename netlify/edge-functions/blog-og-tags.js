/**
 * Netlify Edge Function: blog-og-tags
 * Intercepts /blog/* requests to serve complete, dynamic, valid SEO metadata and
 * full article semantic HTML to search engine crawlers and social media bots,
 * while passing normal human visitors through to the React CSR SPA.
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

// Helper: Generate a real HTTP 404 response for invalid slugs
function generate404Html(slug) {
  const safeSlug = escapeHtml(slug);
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>404 - Post Not Found | Uzair Baig</title>
  <meta name="robots" content="noindex, nofollow">
</head>
<body>
  <main>
    <h1>404 - Post Not Found</h1>
    <p>The blog post "${safeSlug}" could not be found.</p>
    <p><a href="/">Return to Home</a></p>
  </main>
</body>
</html>`;
}

export default async (request, context) => {
  const url = new URL(request.url);
  const userAgent = request.headers.get("user-agent") || "";

  // 1. Normalize pathname and extract slug safely (handling trailing slashes)
  const cleanPath = url.pathname.replace(/\/+$/, "");
  const parts = cleanPath.split("/").filter(Boolean);

  // If path is /blog or has no slug, pass through to SPA
  if (parts.length < 2 || parts[0] !== "blog") {
    return context.next();
  }

  const slug = decodeURIComponent(parts[1]).trim();
  if (!slug) {
    return context.next();
  }

  // 2. Detect bots, search engines, and social media crawlers
  const botRegex = /bot|crawler|spider|crawling|facebookexternalhit|twitterbot|linkedinbot|whatsapp|slackbot|discordbot|applebot|bingbot|yandex|duckduckbot|baiduspider/i;
  const isBot = botRegex.test(userAgent);

  // If it's a real human user, pass through to the React SPA
  if (!isBot) {
    return context.next();
  }

  // 3. Fetch blog post data from the backend API
  try {
    const apiUrl = `https://my-blog-backend-phi.vercel.app/api/posts/${encodeURIComponent(slug)}`;
    const response = await fetch(apiUrl);

    if (response.status === 404) {
      return new Response(generate404Html(slug), {
        status: 404,
        headers: { "content-type": "text/html; charset=UTF-8" },
      });
    }

    if (!response.ok) {
      return new Response(generate404Html(slug), {
        status: response.status >= 400 && response.status < 500 ? 404 : 502,
        headers: { "content-type": "text/html; charset=UTF-8" },
      });
    }

    const data = await response.json();
    const post = (data && data.success && data.post) ? data.post : (data && data.post ? data.post : data);

    if (!post || (!post._id && !post.title && !post.slug)) {
      return new Response(generate404Html(slug), {
        status: 404,
        headers: { "content-type": "text/html; charset=UTF-8" },
      });
    }

    // 4. Extract and prepare metadata
    const title = post.ogTitle || post.title || "Blog Post";
    let description = post.ogDescription || post.excerpt || "";
    if (!description && post.content) {
      description = post.content.substring(0, 160).replace(/[#*`_\[\]]/g, "").trim();
    }

    const image = post.ogImage || post.coverImage || post.image || "";
    const canonicalUrl = `https://uzairbaig.netlify.app/blog/${slug}`;

    const authorName = post.author && typeof post.author === "object"
      ? (post.author.name || "Uzair Baig")
      : (post.author || "Uzair Baig");

    const publishedDate = post.publishedAt || post.createdAt || post.date || new Date().toISOString();
    const modifiedDate = post.updatedAt || publishedDate;

    // 5. Render full article content
    const renderedContent = renderMarkdownToHtml(post.content || description);

    // 6. Generate BlogPosting Structured Data (JSON-LD)
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

    // 7. Construct complete, valid, semantic HTML document
    const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  
  <title>${escapeHtml(title)} | Uzair Baig</title>
  <meta name="description" content="${escapeHtml(description)}">
  <link rel="canonical" href="${escapeHtml(canonicalUrl)}">

  <!-- Open Graph / Facebook -->
  <meta property="og:type" content="article">
  <meta property="og:url" content="${escapeHtml(canonicalUrl)}">
  <meta property="og:title" content="${escapeHtml(title)}">
  <meta property="og:description" content="${escapeHtml(description)}">
  ${image ? `<meta property="og:image" content="${escapeHtml(image)}">` : ""}

  <!-- Twitter -->
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:url" content="${escapeHtml(canonicalUrl)}">
  <meta name="twitter:title" content="${escapeHtml(title)}">
  <meta name="twitter:description" content="${escapeHtml(description)}">
  ${image ? `<meta name="twitter:image" content="${escapeHtml(image)}">` : ""}

  <!-- Structured Data (JSON-LD) -->
  <script type="application/ld+json">
${JSON.stringify(schemaData, null, 2).replace(/</g, "\\u003c")}
  </script>
</head>
<body>
  <main>
    <article>
      <header>
        <h1>${escapeHtml(post.title || title)}</h1>
        ${post.publishedAt ? `<time datetime="${escapeHtml(publishedDate)}">${escapeHtml(new Date(publishedDate).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }))}</time>` : ""}
        ${authorName ? `<address>By ${escapeHtml(authorName)}</address>` : ""}
        ${post.category ? `<p>Category: ${escapeHtml(post.category)}</p>` : ""}
      </header>

      ${image ? `<figure><img src="${escapeHtml(image)}" alt="${escapeHtml(post.title || title)}" /></figure>` : ""}

      <div class="article-content">
${renderedContent}
      </div>
    </article>
  </main>
</body>
</html>`;

    return new Response(html, {
      status: 200,
      headers: {
        "content-type": "text/html; charset=UTF-8",
        "cache-control": "public, max-age=300, s-maxage=600",
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
  path: "/blog/*",
};
