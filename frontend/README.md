📚 Sita Book Store - Frontend
A modern, responsive React application for the Sita Book Store, built with Vite, Redux Toolkit, and Tailwind CSS.

🚀 Tech Stack
Framework: React 18+ with Vite

State Management: Redux Toolkit with RTK Query

Styling: Tailwind CSS

Authentication: Auth0

Payment Integration: Razorpay & Cashfree

Routing: React Router v6

API Client: Axios

Build Tool: Vite

Deployment: Vercel

✨ Features
User Features
📖 Browse and search books catalog

🛒 Shopping cart with real-time updates

💳 Multiple payment options (Razorpay/Cashfree)

📱 Responsive design for all devices

🔐 Secure authentication (Auth0)

📦 Order tracking and history

📝 Book reviews and ratings

📰 Blog and inspiration board

💌 Letters from Langshott

🎨 Sufi Corner content section

Admin Features
📊 Comprehensive dashboard

📚 Book inventory management

📦 Order management system

👥 User management

📝 CMS module for content management

📈 Sales analytics

🎫 Billing and invoice generation

🖼️ Inspiration board management

📄 Dynamic page creation

📋 Prerequisites
Node.js >= 16.x

npm or yarn

Backend API running (see backend README)

🛠️ Installation
Download the repository

bash
cd frontend

Install dependencies

bash
npm install

Configure environment variables

Create a .env file in the frontend root directory:

text
# API Configuration
VITE_API_BASE_URL=http://localhost:5000

# Auth0 Configuration
VITE_AUTH0_DOMAIN=your_auth0_domain
VITE_AUTH0_CLIENT_ID=your_auth0_client_id
VITE_AUTH0_AUDIENCE=your_auth0_audience

# Payment Gateway Configuration
VITE_RAZORPAY_KEY_ID=your_razorpay_key
VITE_CASHFREE_APP_ID=your_cashfree_app_id

# App Configuration
VITE_APP_NAME=Sita Book Store
VITE_APP_URL=http://localhost:5173
Start development server

bash
npm run dev
The application will be available at http://localhost:5173

📁 Project Structure
text
frontend/
├── public/                 # Static assets
│   ├── favicon.ico
│   ├── logos/
│   └── images/
├── src/
│   ├── api/               # API configuration
│   │   ├── axiosClient.js
│   │   └── bookApi.js
│   ├── assets/            # Fonts, images, icons
│   │   └── fonts/
│   ├── components/        # Reusable components
│   │   ├── AdminLogin.jsx
│   │   ├── Auth.jsx
│   │   ├── Navbar.jsx
│   │   ├── Footer.jsx
│   │   └── ...
│   ├── context/           # React Context providers
│   │   ├── AuthContext.jsx
│   │   └── DataContext.jsx
│   ├── hooks/             # Custom React hooks
│   │   └── useIdleTimeout.js
│   ├── pages/             # Page components
│   │   ├── home/
│   │   ├── books/
│   │   ├── blogs/
│   │   ├── dashboard/
│   │   └── ...
│   ├── redux/             # Redux store and slices
│   │   ├── store.js
│   │   └── features/
│   ├── routers/           # Route configurations
│   │   ├── router.jsx
│   │   ├── PrivateRoute.jsx
│   │   └── AdminRoute.jsx
│   ├── utils/             # Utility functions
│   │   ├── baseURL.js
│   │   └── getImgUrl.js
│   ├── App.jsx            # Root component
│   ├── main.jsx           # Entry point
│   └── index.css          # Global styles
├── .env                   # Environment variables (not in git)
├── .gitignore
├── package.json
├── tailwind.config.js
├── vite.config.js
└── README.md
🎨 Styling
This project uses Tailwind CSS with custom configurations:

Custom fonts: Figtree, Playfair Display

Responsive breakpoints

Custom color palette

Component-specific CSS modules

🔐 Authentication Flow
User Authentication:

Auth0 integration for OAuth providers

JWT token management

Auto logout on idle timeout

Admin Authentication:

Separate admin login flow

Role-based access control

Protected admin routes

MFA setup available

💳 Payment Integration
Razorpay
One-click checkout

Order confirmation via SMS/Email

Automatic order status updates

Cashfree
Secure payment gateway

Callback handling

Payment verification

📦 Available Scripts
bash
# Development
npm run dev              # Start development server
npm run dev:host         # Start with network access

# Build
npm run build            # Production build
npm run preview          # Preview production build

# Code Quality
npm run lint             # Run ESLint
npm run lint:fix         # Fix ESLint errors

# Testing (if configured)
npm run test             # Run tests
npm run test:ui          # Run tests with UI
🚀 Deployment
Vercel (Recommended)
Install Vercel CLI

bash
npm i -g vercel
Deploy

bash
vercel --prod
Environment Variables

Add all .env variables in Vercel dashboard

Configure build settings:

Build Command: npm run build

Output Directory: dist

Install Command: npm install

Manual Deployment
Build the project

bash
npm run build
Deploy the dist folder to your hosting service

🔧 Configuration Files
vite.config.js
Dev server configuration

Build optimizations

Plugin configurations

tailwind.config.js
Custom theme settings

Font configurations

Responsive breakpoints

vercel.json
Deployment settings

Routing rules

Headers configuration

🐛 Troubleshooting
Common Issues
1. API Connection Failed
bash
# Check if backend is running
# Verify VITE_API_BASE_URL in .env

2. Authentication Not Working
bash
# Verify Auth0 credentials in .env
# Check browser console for errors
# Clear localStorage and cookies

3. Payment Gateway Issues
bash
# Verify payment gateway credentials
# Check network tab for API errors
# Ensure callback URLs are configured

4. Build Errors
bash
# Clear cache and rebuild
rm -rf node_modules package-lock.json
npm install
npm run build
📱 Browser Support
Chrome (latest)

Firefox (latest)

Safari (latest)

Edge (latest)

Mobile browsers (iOS Safari, Chrome Mobile)

🤝 Contributing
Create a feature branch

Make your changes

Test thoroughly

Submit a pull request

📄 License
This project is proprietary and confidential.

👤 Developer
Developed by [Lumos]


📞 Support
For issues and questions, please contact:

Email: india.lumos@gmail.com

Website: [lumos.in]

Last Updated: November 2025