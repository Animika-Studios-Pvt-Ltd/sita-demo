// src/sitemap.config.js
/**
 * Sitemap configuration for Langshott.in
 * Only public, SEO-friendly routes
 */

export default [
  {
    path: "/",
    priority: 1.0,
    changefreq: "daily",
  },
  {
    path: "/Anilkumar",
    priority: 0.9,
    changefreq: "monthly",
  },
  {
    path: "/publications",
    priority: 0.9,
    changefreq: "weekly",
  },
  {
    path: "/foundation",
    priority: 0.9,
    changefreq: "monthly",
  },
  {
    path: "/blogs",
    priority: 0.8,
    changefreq: "daily",
  },
  {
    path: "/letters",
    priority: 0.8,
    changefreq: "weekly",
  },
  {
    path: "/sufi-corner",
    priority: 0.8,
    changefreq: "weekly",
  },
  {
    path: "/contact",
    priority: 0.7,
    changefreq: "monthly",
  },
];
