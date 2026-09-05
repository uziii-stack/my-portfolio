/**
 * Netlify Edge Function: sitemap
 * Dynamically generates a valid XML sitemap including the portfolio homepage
 * and all live published blog post URLs fetched from the backend API.
 */

function escapeXml(str) {
  if (!str) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export default async () => {
  try {
    const apiUrl = "https://my-blog-backend-phi.vercel.app/api/posts?author=admin";
    const res = await fetch(apiUrl);

    if (!res.ok) {
      return new Response("Failed to fetch posts from API", {
        status: 502,
        headers: { "content-type": "text/plain; charset=UTF-8" },
      });
    }

    const data = await res.json();
    const posts = Array.isArray(data) ? data : (data.posts || data.data || []);

    const now = new Date().toISOString().split("T")[0];

    let urlsXml = `  <url>
    <loc>https://uzairbaig.netlify.app/</loc>
    <lastmod>${now}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://uzairbaig.netlify.app/sitemap.html</loc>
    <lastmod>${now}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://uzairbaig.netlify.app/blog</loc>
    <lastmod>${now}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>\n`;

    for (const post of posts) {
      if (!post.slug) continue;
      const postUrl = `https://uzairbaig.netlify.app/blog/${encodeURIComponent(post.slug)}`;
      const dateVal = post.updatedAt || post.publishedAt || post.createdAt || post.date;
      let lastmod = now;
      if (dateVal) {
        try {
          const parsed = new Date(dateVal);
          if (!isNaN(parsed.getTime())) {
            lastmod = parsed.toISOString().split("T")[0];
          }
        } catch (_) {}
      }

      urlsXml += `  <url>
    <loc>${escapeXml(postUrl)}</loc>
    <lastmod>${escapeXml(lastmod)}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>\n`;
    }

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlsXml}</urlset>
`;

    return new Response(xml, {
      status: 200,
      headers: {
        "content-type": "application/xml; charset=UTF-8",
        "cache-control": "public, max-age=3600, s-maxage=3600",
      },
    });
  } catch (error) {
    console.error("Sitemap Generation Error:", error);
    return new Response("Internal Server Error generating sitemap", {
      status: 500,
      headers: { "content-type": "text/plain; charset=UTF-8" },
    });
  }
};

export const config = {
  path: "/sitemap.xml",
};
