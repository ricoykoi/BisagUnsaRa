import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { VitePWA } from "vite-plugin-pwa";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      // --- General PWA Configuration ---
      registerType: "autoUpdate",

      // Assets that the PWA Service Worker should explicitly cache
      includeAssets: [
        "favicon.ico",
        "apple-touch-icon.png",
        "mask-icon.svg",
        "icon-192.png",
        "icon-512.png",
        "icon-maskable-192.png",
        "icon-maskable-512.png",
      ],

      // --- Web App Manifest Configuration ---
      manifest: {
        name: "Furfur App", // Updated name
        short_name: "furfur", // Updated short name
        description: "Your new personal health companion, furfur.", // Updated description
        theme_color: "#ffffff",
        background_color: "#ffffff",
        start_url: "/",
        display: "standalone",

        // Icon configurations (Ensure these files are in your public directory!)
        icons: [
          // Basic icons
          { src: "/furfurlogo.png", sizes: "192x192", type: "image/png" },
          { src: "/furfurlogo.png", sizes: "512x512", type: "image/png" },
          // Various icon sizes
          { src: "/furfurlogo.png", sizes: "144x144", type: "image/png" },
          { src: "/furfurlogo.png", sizes: "256x256", type: "image/png" },
          // Apple Touch Icon
          {
            src: "apple-touch-icon.png",
            sizes: "180x180",
            type: "image/png",
            purpose: "apple touch icon",
          },
          // Maskable icons (for Adaptive Icons on Android)
          {
            src: "icon-maskable-192.png",
            sizes: "192x192",
            type: "image/png",
            purpose: "maskable",
          },
          {
            src: "icon-maskable-512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "maskable",
          },
        ],
        orientation: "portrait",
        categories: ["health", "medical"],
      },

      // --- Workbox Configuration (Service Worker) ---
      workbox: {
        // Increases the maximum size of files that Workbox is allowed to cache
        maximumFileSizeToCacheInBytes: 5 * 1024 * 1024, // 5 MB limit

        // Patterns to match assets for precaching
        globPatterns: ["**/*.{js,css,html,ico,png,svg}"],

        // Runtime caching strategies for external resources (like APIs)
        runtimeCaching: [
          {
            // Caches any requests starting with https://api. (e.g., your backend)
            urlPattern: /^https:\/\/api\./,
            handler: "NetworkFirst", // Tries the network first, falls back to cache
            options: {
              cacheName: "api-cache",
              cacheableResponse: {
                statuses: [0, 200],
              },
            },
          },
        ],
      },

      // Development server options
      devOptions: {
        enabled: false, // Recommended to keep false unless you are actively debugging the Service Worker
      },
    }),
  ],

  // Build-specific configuration
  build: {
    // Increases the warning limit for chunk sizes
    chunkSizeWarningLimit: 2000, // 2000 KB = 2 MB
  },
});
