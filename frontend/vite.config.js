import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import sitemap from 'vite-plugin-sitemap'

// Environment detection
const backendUrl = process.env.VITE_API_URL || 'http://localhost:5000';

// Fetch dynamic book routes
async function getDynamicBookRoutes() {
  try {
    const response = await fetch(`${backendUrl}/api/books`);
    const books = await response.json();

    return books
      .filter(book => !book.suspended) // Only active books
      .map(book => ({
        path: `/books/${book.slug}`,
        priority: 0.8,
        changefreq: 'weekly',
        lastmod: book.updatedAt || new Date().toISOString(),
      }));
  } catch (error) {
    console.warn('⚠️  Could not fetch book routes:', error.message);
    return [];
  }
}

// Fetch dynamic blog routes
async function getDynamicBlogRoutes() {
  try {
    const response = await fetch(`${backendUrl}/api/blogs`);
    const blogs = await response.json();

    return blogs.map(blog => ({
      path: `/blogs/${blog._id}`,
      priority: 0.7,
      changefreq: 'monthly',
      lastmod: blog.updatedAt || new Date().toISOString(),
    }));
  } catch (error) {
    console.warn('⚠️  Could not fetch blog routes:', error.message);
    return [];
  }
}

const staticRoutes = [
  '/',
];

// https://vitejs.dev/config/
export default defineConfig(async () => {
  // Fetch all dynamic routes
  const [bookRoutes, blogRoutes] = await Promise.all([
    getDynamicBookRoutes(),
    getDynamicBlogRoutes(),
  ]);

  // Combine all routes
  const allRoutes = [
    ...staticRoutes,
    ...bookRoutes,
    ...blogRoutes,
  ];

  console.log(`\n🗺️  Generating sitemap with ${allRoutes.length} routes`);
  console.log(`   - Static routes: ${staticRoutes.length}`);
  console.log(`   - Book routes: ${bookRoutes.length}`);
  console.log(`   - Blog routes: ${blogRoutes.length}\n`);

  return {
    plugins: [
      react(),
      sitemap({
        hostname: 'https://sitashakti.com',
        routes: allRoutes,
        exclude: [
          '/admin',
          '/dashboard',
          '/dashboard/*',
          '/cart',
          '/checkout',
          '/orders',
          '/my-profile',
          '/auth',
          '/ebook/*',
          '/books/preview/*',
        ],
        changefreq: 'weekly',
        priority: 0.7,
        lastmod: new Date().toISOString(),
        generateRobotsTxt: false, // Disable plugin generation, using manual public/robots.txt instead
      }),
    ],

    // Dev server configuration
    server: {
      port: 5173,
      proxy: {
        '/api': {
          target: backendUrl,
          changeOrigin: true,
          secure: false,
        },
      },
    },

    // ✅ Preview server configuration (same as dev)
    preview: {
      port: 4173,
      allowedHosts: true,
      proxy: {
        '/api': {
          target: backendUrl,
          changeOrigin: true,
          secure: false,
        },
      },
    },
  }
})
