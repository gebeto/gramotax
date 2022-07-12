import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import svgr from "@honkhonk/vite-plugin-svgr";

export default defineConfig({
  server: {
    host: "0.0.0.0",
  },
  plugins: [react(), svgr()],
});
