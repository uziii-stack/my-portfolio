import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  base: import.meta.env.VITE_BASE_PATH || "/",
  plugins: [tailwindcss(), react()],
});
