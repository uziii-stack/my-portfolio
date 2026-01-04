// vite.config.js
import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default ({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  // Check for Netlify or GitHub Pages
  let base;

  if (env.VITE_BASE_PATH) {
    base = env.VITE_BASE_PATH; // from Netlify env variable
  } else if (process.env.GITHUB_ACTIONS) {
    base = "/my-portfolio/"; // GitHub Pages
  } else {
    base = "/"; // local dev
  }

  return defineConfig({
    base,
    plugins: [tailwindcss(), react()],
  });
};
