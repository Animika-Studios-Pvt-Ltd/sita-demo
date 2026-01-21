📚 Langshott Foundation Book Store - Backend
RESTful API backend for the Langshott Foundation Book Store, built with Node.js, Express, and MongoDB.

🚀 Tech Stack
Runtime: Node.js (v16+)

Framework: Express.js

Database: MongoDB with Mongoose ODM

Authentication: Auth0, JWT

File Storage: Cloudinary, Google Drive API

Payment Gateways: Razorpay, Cashfree

Communication: Nodemailer (Email)

Deployment: Vercel

✨ Features
Core Functionality
📚 Complete book management system

🛒 Order processing and tracking

💳 Multi-gateway payment integration

🔐 Multi-strategy authentication (Auth0/JWT)

📧 Email notifications

📱 SMS notifications

☁️ Cloud file storage (Cloudinary/Drive)

📊 Admin statistics and analytics

Content Management
📝 Blog management

💌 Letters from Langshott

🎨 Inspiration board

👤 Author profiles

📄 Dynamic pages

🏛️ Foundation content

🕌 Sufi Corner

⭐ Reader reviews and testimonials

Security Features
🔒 JWT token authentication

🛡️ Role-based access control (Admin/User)

🔐 Multi-factor authentication support

🚫 CORS protection

🔑 API key validation

📋 Prerequisites
Node.js >= 16.x

MongoDB Atlas account or local MongoDB

Auth0 account

Cloudinary account

Payment gateway accounts (Razorpay/Cashfree)

Google Drive API credentials (optional)

🛠️ Installation
Download the repository

bash
cd backend

Install dependencies

bash
npm install

Configure environment variables

Create a .env file in the backend root directory:

text
# Server Configuration
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173

# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/bookstore?retryWrites=true&w=majority

# JWT Secret
JWT_SECRET=your_super_secret_jwt_key_min_32_chars
JWT_REFRESH_SECRET=your_refresh_token_secret
JWT_EXPIRES_IN=7d
JWT_REFRESH_EXPIRES_IN=30d

# Auth0 Configuration
AUTH0_DOMAIN=your-tenant.auth0.com
AUTH0_CLIENT_ID=your_auth0_client_id
AUTH0_CLIENT_SECRET=your_auth0_client_secret
AUTH0_AUDIENCE=your_api_identifier

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Payment Gateway - Razorpay
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_secret

# Payment Gateway - Cashfree
CASHFREE_APP_ID=your_cashfree_app_id
CASHFREE_SECRET_KEY=your_cashfree_secret
CASHFREE_API_VERSION=2023-08-01
CASHFREE_ENV=sandbox  # or 'production'

# Email Configuration (Nodemailer)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_specific_password
EMAIL_FROM=Langshott Foundation <noreply@langshott.com>

# Google Drive API (Optional)
GOOGLE_DRIVE_CLIENT_EMAIL=your_service_account@project.iam.gserviceaccount.com
GOOGLE_DRIVE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour_Key\n-----END PRIVATE KEY-----\n"
GOOGLE_DRIVE_FOLDER_ID=your_drive_folder_id

# Shipping API (NimbusPost or similar)
SHIPPING_API_KEY=your_shipping_api_key
SHIPPING_API_URL=https://api.nimbuspost.com/v1

# Admin Configuration
ADMIN_EMAIL=admin@langshott.com
ADMIN_PASSWORD=SecureAdminPassword123!

# CORS
ALLOWED_ORIGINS=http://localhost:5173,https://yourdomain.com

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000  # 15 minutes
RATE_LIMIT_MAX_REQUESTS=100

Place your Drive API credentials in:

text
src/config/drive-key.json

Initialize the database

bash
# Create admin user
node src/admin/createAdmin.js

Start the server

bash
# Development mode with auto-reload
npm run dev

# Production mode
npm start
Server will be available at http://localhost:5000

📁 Project Structure
text
backend/
├── src/
│   ├── admin/                  # Admin management
│   │   ├── admin.model.js
│   │   ├── admin.routes.js
│   │   └── createAdmin.js
│   ├── author/                 # Author profiles
│   ├── blogs/                  # Blog management
│   ├── books/                  # Book catalog
│   ├── config/                 # Configuration files
│   │   ├── auth0.js
│   │   ├── cloudinary.js
│   │   └── *.json (credentials)
│   ├── contact/                # Contact form
│   ├── foundation/             # Foundation content
│   ├── home/                   # Home page components
│   │   ├── banner/
│   │   ├── corners/
│   │   └── ReaderThoughts/
│   ├── inspiration/            # Inspiration board
│   ├── letters/                # Letters management
│   ├── middlewares/            # Authentication & validation
│   │   ├── verifyAuth0Token.js
│   │   ├── verifyAdminToken.js
│   │   └── upload.middleware.js
│   ├── orders/                 # Order processing
│   ├── pages/                  # Dynamic pages
│   ├── payments/               # Payment processing
│   ├── precepts/               # Precepts content
│   ├── review/                 # Book reviews
│   ├── services/               # External services
│   │   ├── emailService.js
│   │   ├── smsService.js
│   │   └── drive.service.js
│   ├── shipping/               # Shipping integration
│   ├── stats/                  # Analytics & statistics
│   ├── trust/                  # Trust certificates
│   └── users/                  # User management
├── public/                     # Static files
├── .env                        # Environment variables (not in git)
├── .gitignore
├── index.js                    # Entry point
├── package.json
├── vercel.json                 # Deployment config
└── README.md

🔌 API Endpoints

Authentication
text
POST   /api/auth/register        # User registration
POST   /api/auth/login           # User login
POST   /api/auth/refresh         # Refresh token
POST   /api/auth/logout          # User logout
GET    /api/auth/verify          # Verify token

Books
text
GET    /api/books                # Get all books
GET    /api/books/:id            # Get single book
POST   /api/books                # Create book (Admin)
PUT    /api/books/:id            # Update book (Admin)
DELETE /api/books/:id            # Delete book (Admin)
GET    /api/books/search         # Search books

Orders
text
GET    /api/orders               # Get user orders
GET    /api/orders/:id           # Get order details
POST   /api/orders               # Create order
PUT    /api/orders/:id/status    # Update status (Admin)
GET    /api/admin/orders         # Get all orders (Admin)

Payments
text
POST   /api/payment/razorpay/create-order
POST   /api/payment/razorpay/verify
POST   /api/payment/cashfree/create-order
POST   /api/payment/cashfree/callback

Admin
text
GET    /api/admin/stats          # Dashboard statistics
GET    /api/admin/users          # Get all users
PUT    /api/admin/users/:id      # Update user
DELETE /api/admin/users/:id      # Delete user

Content Management
text
# Blogs
GET    /api/blogs
POST   /api/blogs                # Admin only
PUT    /api/blogs/:id            # Admin only
DELETE /api/blogs/:id            # Admin only

# Pages
GET    /api/pages
POST   /api/pages                # Admin only
PUT    /api/pages/:id            # Admin only

# Reviews
GET    /api/reviews
POST   /api/reviews              # Authenticated users
🔐 Authentication Flow
JWT Authentication
User logs in with credentials

Server validates and returns JWT access token

Client includes token in Authorization: Bearer <token> header

Server validates token on protected routes

Auth0 Integration
User authenticates via Auth0

Frontend receives Auth0 token

Backend validates token with Auth0

Creates/updates user in database

Creates/updates user in database

📦 Package Scripts
bash
# Development
npm run dev              # Start with nodemon (auto-reload)
npm start                # Start production server

# Database
npm run seed             # Seed database with sample data
npm run create-admin     # Create admin user

# Testing (if configured)
npm test                 # Run tests
npm run test:watch       # Run tests in watch mode

# Linting
npm run lint             # Check code quality
npm run lint:fix         # Fix linting issues
🚀 Deployment
Vercel Deployment
Install Vercel CLI

bash
npm i -g vercel
Deploy

bash
vercel --prod
Configure Environment Variables

Add all .env variables in Vercel dashboard

Set Node.js version to 16.x or higher

Update vercel.json (already configured)

json
{
  "version": 2,
  "builds": [
    {
      "src": "index.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "index.js"
    }
  ]
}

Alternative Deployment Options
Render:

bash
# Build Command: npm install
# Start Command: npm start
Railway:

bash
# Auto-detects Node.js and uses npm start
DigitalOcean App Platform:

bash
# HTTP Routes: /
# Run Command: npm start

🔧 Configuration
CORS Setup
Update index.js to configure allowed origins:

javascript
const corsOptions = {
  origin: process.env.ALLOWED_ORIGINS.split(','),
  credentials: true
};
app.use(cors(corsOptions));

Rate Limiting

javascript
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: process.env.RATE_LIMIT_WINDOW_MS,
  max: process.env.RATE_LIMIT_MAX_REQUESTS
});

app.use('/api/', limiter);

🐛 Troubleshooting

Common Issues
1. MongoDB Connection Failed

bash
# Check MongoDB URI
# Ensure IP whitelist includes your server IP
# Verify username/password are URL-encoded

2. Authentication Errors

bash
# Verify JWT_SECRET is set
# Ensure tokens are not expired

3. File Upload Issues

bash
# Verify Cloudinary credentials
# Check file size limits
# Ensure proper middleware order

4. Payment Gateway Errors

bash
# Verify API keys and secrets
# Check webhook URLs are configured
# Test in sandbox mode first

5. Email/SMS Not Sending

bash
# Check email SMTP settings
# Ensure service accounts have proper permissions

📊 Database Schema

User Model
javascript
{
  email: String,
  name: String,
  role: ['user', 'admin'],
  auth0Id: String,
  createdAt: Date
}

Order Model
javascript
{
  user: ObjectId,
  books: [{ book: ObjectId, quantity: Number }],
  totalAmount: Number,
  status: ['pending', 'confirmed', 'shipped', 'delivered'],
  paymentId: String,
  shippingAddress: Object,
  createdAt: Date
}

Book Model
javascript
{
  title: String,
  author: String,
  description: String,
  price: Number,
  coverImage: String,
  category: String,
  stock: Number,
  isbn: String,
  createdAt: Date
}

🔒 Security Best Practices
Environment Variables: Never commit .env file

JWT Secrets: Use strong, random secrets (min 32 characters)

HTTPS: Always use HTTPS in production

Rate Limiting: Implement on all public endpoints

Input Validation: Validate all user inputs

Password Hashing: Use bcrypt with salt rounds >= 10

CORS: Restrict to known origins only

File Uploads: Validate file types and sizes

SQL Injection: Use Mongoose ODM (prevents NoSQL injection)

XSS Protection: Sanitize user inputs

📈 Performance Optimization
javascript
// Database indexing
bookSchema.index({ title: 'text', author: 'text' });
bookSchema.index({ category: 1 });
orderSchema.index({ user: 1, createdAt: -1 });

// Caching with Redis (optional)
const redis = require('redis');
const client = redis.createClient();

// Query optimization
Book.find().select('title author price').lean();

🧪 Testing
bash
# Unit tests
npm run test:unit

# Integration tests
npm run test:integration

# API tests
npm run test:api

# Coverage report
npm run test:coverage

📝 Logging
Configure logging with Winston or similar:

javascript
const winston = require('winston');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});

🤝 Contributing
Create feature branch

Make changes with proper commit messages

Add tests for new features

Update documentation

Submit pull request

📄 License
Proprietary and confidential.

👤 Developer
Developed by [Lumos]

Email: [india.lumos@gmail.com]


📞 Support
For technical issues, contact:

Email: india.lumos@gmail.com

Last Updated: November 2025