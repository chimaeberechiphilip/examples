import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
// import { sveltekit } from '@sveltejs/kit/vit';

// https://vite.dev/config/
// export default defineConfig({
//   plugins: [react()],
// })

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:3001",
        changeOrigin: true,
      },
    },
  },
});
