export default async (request, context) => {
  const url = new URL(request.url);
  const slug = url.pathname.split("/").pop();

  if (!slug || url.pathname === "/blog" || url.pathname === "/blog/") {
    return;
  }

  try {
    const apiUrl = `https://my-blog-backend-phi.vercel.app/api/posts/${slug}`;
    const response = await fetch(apiUrl);
    
    if (!response.ok) {
      return;
    }

    const data = await response.json();
    const post = data.post || data;

    if (!post) {
      return;
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

  <script>
    // Redirect to the SPA root as requested
    window.location.href = "/";
  </script>
</head>
<body>
  <h1>${title}</h1>
  <p>Redirecting to the post...</p>
</body>
</html>
    `;

    return new Response(html, {
      headers: { "content-type": "text/html" },
    });
  } catch (error) {
    console.error("Edge Function Error:", error);
    return;
  }
};

export const config = {
  path: "/blog/*",
};
