// app/manifest.ts
import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Bank Sampah Digital",
    short_name: "Bank Sampah Digital",
    description: "A Progressive Web App untuk memonitoring sampah",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#000000",
    icons: [
      { src: "/small-icon.png", sizes: "192x192", type: "image/png" },
      { src: "/med-icon.png", sizes: "512x512", type: "image/png" },
    ],
  };
}
