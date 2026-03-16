export default async (request, context) => {
  const url = new URL(request.url);
  const userAgent = request.headers.get("user-agent") || "";
  const slug = url.pathname.split("/").pop();

  if (!slug || url.pathname === "/blog" || url.pathname === "/blog/") {
    return context.next();
  }

  // Detect social media bots and search engine crawlers
  const botRegex = /bot|crawler|spider|facebookexternalhit|twitterbot|linkedinbot|whatsapp|slackbot|discordbot/i;
  const isBot = botRegex.test(userAgent);

  // If it's a real user, pass them through to the SPA
  if (!isBot) {
    return context.next();
  }

  try {
    const apiUrl = `https://my-blog-backend-phi.vercel.app/api/posts/${slug}`;
    const response = await fetch(apiUrl);
    
    if (!response.ok) {
      return context.next();
    }

    const data = await response.json();
    const post = data.post || data;

    if (!post) {
      return context.next();
    }

    const title = post.ogTitle || post.title || "Blog Post";
    const description = post.ogDescription || post.excerpt || "";
    const image = post.ogImage || post.image || post.coverImage || "";
    const postUrl = `https://uzairbaig.netlify.app/blog/${slug}`;

    const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  
  <title>${title} | Uzair Baig</title>
  <meta name="description" content="${description}">

  <!-- Open Graph / Facebook -->
  <meta property="og:type" content="article">
  <meta property="og:url" content="${postUrl}">
  <meta property="og:title" content="${title}">
  <meta property="og:description" content="${description}">
  <meta property="og:image" content="${image}">

  <!-- Twitter -->
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:url" content="${postUrl}">
  <meta name="twitter:title" content="${title}">
  <meta name="twitter:description" content="${description}">
  <meta name="twitter:image" content="${image}">
</head>
<body>
  <h1>${title}</h1>
  <p>${description}</p>
</body>
</html>
    `;

    return new Response(html, {
      headers: { "content-type": "text/html" },
    });
  } catch (error) {
    console.error("Edge Function Error:", error);
    return context.next();
  }
};


export const config = {
  path: "/blog/*",
};
