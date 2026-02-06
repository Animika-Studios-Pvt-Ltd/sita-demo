const express = require("express")
const cors = require("cors")
const mongoose = require("mongoose")
const compression = require("compression")
const http = require("http")
const { Server } = require("socket.io")
const cookieParser = require("cookie-parser");
require("dotenv").config()

const User = require('./src/users/user.model')
const Review = require("./src/review/review.model")
const Book = require("./src/books/book.model")

const app = express()
const port = process.env.PORT || 5000

// Force restart for new routes
// ============================================
// PERFORMANCE OPTIMIZATIONS
// ============================================

// 1. Enable GZIP compression (reduces response size by 70%)
app.use(compression())

// 2. Set NODE_ENV to production ONLY if not already set (defaults to development for safety)
// process.env.NODE_ENV = process.env.NODE_ENV || 'production' <--- REMOVED THIS LINE
console.log(`🌍 Environment: ${process.env.NODE_ENV}`);

// 3. Parse JSON with size limits
app.use(express.json({ limit: '10mb' }))
app.use(cookieParser());

// 4. CORS optimization
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://admin.localhost:5173",
      "http://127.0.0.1:5500",
      "http://localhost:5500",
      "https://sita-demo-front.onrender.com",
      "https://frontend-production-3916b.up.railway.app",
      "https://sitashakti.com",
      "https://www.sitashakti.com",
      "https://admin.sitashakti.com",
      "https://sita-frontend.pages.dev"
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
)

// ============================================
// IP & DEVICE TRACKING MIDDLEWARE (SIMPLIFIED)
// ============================================

/**
 * Get client IP address (handles proxies)
 */
function getClientIP(req) {
  return req.headers['cf-connecting-ip'] ||
    req.headers['x-render-forwarded-for']?.split(',')[0].trim() ||
    req.headers['x-forwarded-for']?.split(',')[0].trim() ||
    req.headers['x-real-ip'] ||
    req.socket.remoteAddress
}

/**
 * Extract device name from User-Agent (simplified)
 */
function getDeviceName(ua) {
  if (!ua) return 'Unknown'

  // Mobile devices
  const mobile = ua.match(/iPhone|SM-[A-Z]\d+|OnePlus|Redmi|POCO|Pixel|Moto|OPPO|vivo|Realme/i)?.[0]
  if (mobile) {
    if (/iPhone/i.test(mobile)) return 'iPhone'
    if (/SM-S/i.test(mobile)) return 'Samsung Galaxy S'
    if (/SM-A/i.test(mobile)) return 'Samsung Galaxy A'
    return mobile
  }

  // Tablets
  if (/iPad/i.test(ua)) return 'iPad'

  // Desktop
  if (/Windows/i.test(ua)) return 'Windows PC'
  if (/Mac/i.test(ua)) return 'Mac'
  if (/Linux/i.test(ua)) return 'Linux PC'

  return 'Unknown Device'
}

/**
 * Get OS and Browser (simplified)
 */
function getDeviceInfo(ua) {
  const os = /Windows/i.test(ua) ? 'Windows' :
    /Mac/i.test(ua) ? 'macOS' :
      /Android/i.test(ua) ? 'Android' :
        /iOS|iPhone|iPad/i.test(ua) ? 'iOS' : 'Unknown'

  const browser = /Edg/i.test(ua) ? 'Edge' :
    /Chrome/i.test(ua) ? 'Chrome' :
      /Safari/i.test(ua) ? 'Safari' :
        /Firefox/i.test(ua) ? 'Firefox' : 'Unknown'

  return { os, browser }
}

/**
 * Page-specific logging middleware
 */
app.use((req, res, next) => {
  // Pages to track
  const tracked = ['/api/books', '/api/blogs',
    '/api/orders', '/api/reviews', '/api/pages']

  // Skip if not tracked or health check
  if (!tracked.some(r => req.path.startsWith(r)) || req.path === '/api/health') {
    return next()
  }

  const ip = getClientIP(req)
  const ua = req.headers['user-agent'] || ''
  const device = getDeviceName(ua)
  const { os, browser } = getDeviceInfo(ua)
  const time = new Date().toLocaleString('en-IN', {
    timeZone: 'Asia/Kolkata',
    dateStyle: 'short',
    timeStyle: 'short'
  })

  // Simple log
  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  console.log(`📄 ${req.method} ${req.path}`)
  console.log(`🌐 IP: ${ip}`)
  console.log(`📱 ${device} | ${os} | ${browser}`)
  console.log(`⏰ ${time}`)
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n')

  next()
})


const server = http.createServer(app)
const io = new Server(server, {
  cors: {
    origin: [
      "http://localhost:5173",
      "http://admin.localhost:5173",
      "http://127.0.0.1:5500",
      "http://localhost:5500",
      "https://sita-demo-front.onrender.com",
      "https://frontend-production-3916b.up.railway.app",
      "https://sitashakti.com",
      "https://www.sitashakti.com",
      "https://admin.sitashakti.com",
      "https://sita-frontend.pages.dev"
    ],
    methods: ["GET", "POST", "PATCH", "DELETE"],
  },
})

io.on("connection", (socket) => {
  console.log("✅ Admin connected via socket:", socket.id)
  socket.on("disconnect", () => {
    console.log("❌ Socket disconnected:", socket.id)
  })
})

// ============================================
// OAuth2 callback route to handle Google redirection
// ============================================
app.get('/oauth2callback', async (req, res) => {
  console.log('OAuth2 callback received query:', req.query);
  const code = req.query.code
  if (!code) {
    return res.status(400).json({ error: 'Missing authorization code' })
  }

  try {
    const { tokens } = await oAuth2Client.getToken(code)
    console.log('OAuth2 tokens received:', tokens)
    res.send('Authorization successful! You can close this tab.')
  } catch (error) {
    console.error('OAuth2 token exchange error:', error)
    res.status(500).json({ error: 'Failed to exchange authorization code' })
  }
})

// ============================================
// HEALTH CHECK ENDPOINT (CRITICAL)
// ============================================
app.get('/api/health', async (req, res) => {
  try {
    const dbState = mongoose.connection.readyState
    const isDbConnected = dbState === 1

    if (!isDbConnected) {
      return res.status(503).json({
        status: 'degraded',
        message: 'Database not connected',
        timestamp: new Date().toISOString()
      })
    }

    await mongoose.connection.db.admin().ping()

    res.status(200).json({
      status: 'ok',
      database: 'connected',
      timestamp: new Date().toISOString(),
      service: 'Sita Backend'
    })
  } catch (error) {
    console.error('Health check failed:', error)
    res.status(503).json({
      status: 'error',
      message: error.message,
      timestamp: new Date().toISOString()
    })
  }
})

// ============================================
// ROUTE IMPORTS
// ============================================
// ============================================
// ROUTE IMPORTS
// ============================================
const bookRoutes = require("./src/books/book.route")
const orderRoutes = require("./src/orders/order.route")
const userRoutes = require("./src/users/user.route")
const adminRoutes = require("./src/stats/admin.stats")
const blogRoutes = require("./src/blogs/blog.route")
const letterRoutes = require("./src/letters/letter.route")
const reviewRoutes = require("./src/review/review.routes")
const pageRoutes = require("./src/pages/pages.routes")
const trustRoutes = require("./src/trust/trust.route")
const adminAuthRoutes = require("./src/users/auth.routes")
const paymentRoutes = require('./src/payments/payment.route')
const smsRoutes = require("./src/sms/sms.route")
const shippingRoutes = require('./src/shipping/shipping.route')
const eventRoutes = require("./src/events/event.routes");
const articleRoutes = require("./src/articles/article.route");
const podcastRoutes = require("./src/podcasts/podcast.route");
app.use("/api/blocked-dates", require("./src/blockedDates/blockedDate.routes"));
app.use("/api/bookings", require("./src//booking/booking.routes"));

app.use('/api/shipping', shippingRoutes)

// ============================================
// ROUTE MOUNTING
// ============================================
app.use("/api/admin", adminRoutes)
app.use("/api/books", bookRoutes)
app.use("/api/orders", orderRoutes)
app.use("/api/users", userRoutes)
app.use("/api/reviews", reviewRoutes)
app.use("/api/blogs", blogRoutes)
app.use("/api/pages", pageRoutes)
app.use("/api/cms/pages", pageRoutes) // For listing and management
app.use("/api/cms", pageRoutes) // For /upload
app.use("/api/trust-certificates", trustRoutes)
app.use("/api/admin-auth", adminAuthRoutes)
app.use('/api/payment', paymentRoutes)
app.use("/api/sms", smsRoutes)
app.use("/api/events", eventRoutes);
app.use("/api/articles", articleRoutes);
app.use("/api/podcasts", podcastRoutes);

// ============================================
// ROOT ENDPOINT
// ============================================
app.get("/", (req, res) => {
  res.json({
    message: "📚 Sita API is running!",
    environment: process.env.NODE_ENV,
    version: "2.0.0",
    endpoints: {
      health: "GET /api/health",
      userSync: "POST /api/users/sync",
      userProfile: "GET /api/users/:uid",
      userUpdate: "PUT /api/users/:uid",
      adminLogin: "POST /api/admin-auth/admin",
      tokenVerify: "GET /api/admin-auth/verify"
    },
    timestamp: new Date().toISOString()
  })
})

// ============================================
// 404 HANDLER
// ============================================
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
    path: req.originalUrl,
    method: req.method,
    timestamp: new Date().toISOString()
  })
})

// ============================================
// GLOBAL ERROR HANDLER
// ============================================
app.use((err, req, res, next) => {
  console.error('❌ Global error handler:', err.stack)

  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  })
})

// ============================================
// OPTIMIZED MONGODB CONNECTION
// ============================================
async function main() {
  try {
    await mongoose.connect(process.env.DB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    })

    mongoose.set('bufferCommands', false)

    const setupCronJobs = require("./src/services/cron");

    // ... inside main function ...
    console.log("✅ MongoDB connected successfully!")
    console.log(`📊 Database: ${mongoose.connection.name}`)

    // Initialize Cron Jobs
    setupCronJobs();

    server.listen(port, '0.0.0.0', () => {
      console.log(`🚀 Server running on port ${port} (${process.env.NODE_ENV})`)
      console.log(`📍 Health check: http://localhost:${port}/api/health`)
      console.log(`🔐 Admin login: http://localhost:${port}/api/admin-auth/admin`)
      console.log(`✅ Token verify: http://localhost:${port}/api/admin-auth/verify`)
      console.log(`⏰ Server started at: ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}`)
    })
  } catch (error) {
    console.error("❌ MongoDB connection error:", error)
    process.exit(1)
  }
}

// ============================================
// GRACEFUL SHUTDOWN
// ============================================
process.on('SIGTERM', () => {
  console.log('👋 SIGTERM signal received: closing HTTP server')
  server.close(() => {
    console.log('💤 HTTP server closed')
    mongoose.connection.close(false, () => {
      console.log('💤 MongoDB connection closed')
      process.exit(0)
    })
  })
})

process.on('SIGINT', () => {
  console.log('👋 SIGINT signal received: closing HTTP server')
  server.close(() => {
    console.log('💤 HTTP server closed')
    mongoose.connection.close(false, () => {
      console.log('💤 MongoDB connection closed')
      process.exit(0)
    })
  })
})

// ============================================
// START SERVER
// ============================================
main()

// Export for testing
module.exports = { app, server, io }
