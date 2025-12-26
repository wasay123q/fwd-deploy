# 🌍 Pakistan Tourism Web Application

<div align="center">

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Node](https://img.shields.io/badge/node-%3E%3D16.0.0-brightgreen.svg)
![React](https://img.shields.io/badge/react-19.1.0-blue.svg)
![MongoDB](https://img.shields.io/badge/mongodb-8.15.1-green.svg)

A comprehensive full-stack tourism platform showcasing Pakistan's rich cultural heritage and breathtaking destinations with integrated booking, payment processing, and administrative management capabilities.

[Features](#-features) • [Tech Stack](#-tech-stack) • [Installation](#-installation) • [API Documentation](#-api-documentation) • [Contributing](#-contributing)

</div>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Prerequisites](#-prerequisites)
- [Installation](#-installation)
- [Environment Variables](#-environment-variables)
- [Running the Application](#-running-the-application)
- [API Documentation](#-api-documentation)
- [Database Schema](#-database-schema)
- [Authentication & Authorization](#-authentication--authorization)
- [Testing](#-testing)
- [Deployment](#-deployment)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🌟 Overview

The Pakistan Tourism Web Application is a modern, responsive platform designed to promote tourism in Pakistan by providing users with comprehensive information about popular destinations, seamless booking experiences, and secure payment processing. The application features role-based access control, enabling both user interactions and administrative oversight.

### Key Highlights

- **Destination Showcase**: Explore 10+ major cities and tourist attractions across Pakistan
- **User Authentication**: Secure JWT-based authentication with password recovery
- **Booking System**: Streamlined booking process with real-time availability
- **Payment Integration**: Secure payment gateway with transaction tracking
- **Admin Dashboard**: Comprehensive admin panel for user and booking management
- **Responsive Design**: Mobile-first design approach with modern UI/UX
- **Security First**: Implementation of industry-standard security practices

---

## ✨ Features

### User Features

#### 🔐 Authentication & Authorization
- User registration with email verification
- Secure login with JWT token-based authentication
- Password recovery via email with token expiration
- Google OAuth integration
- Protected routes with role-based access control

#### 🗺️ Destination Management
- Browse curated destinations across Pakistan
  - Multan, Islamabad, Karachi, Lahore, Peshawar, Quetta
  - Skardu, Hunza Valley, Badshahi Mosque, Saiful Malook
- Detailed destination pages with rich media
- Interactive destination cards with booking options
- Search and filter capabilities

#### 📅 Booking & Planning
- Multi-step booking process
- Date selection with availability checking
- Guest count and accommodation preferences
- Trip planning tools and itinerary builder
- Booking history and management

#### 💳 Payment Processing
- Secure payment gateway integration
- Multiple payment method support
- Real-time payment status tracking
- Transaction history and receipts
- Refund request functionality

#### 👤 User Dashboard
- Profile management
- Booking history
- Payment records
- Trip planning tools

### Admin Features

#### 📊 Admin Dashboard
- User management (view, suspend, activate)
- Booking overview and analytics
- Payment verification and refund processing
- System statistics and metrics
- Role-based access control

#### 🛡️ Security Features
- Rate limiting to prevent abuse
- CORS configuration
- Helmet.js security headers
- Input validation and sanitization
- Password encryption with bcrypt
- JWT token management

---

## 🛠️ Tech Stack

### Frontend

| Technology | Version | Purpose |
|-----------|---------|---------|
| **React** | 19.1.0 | UI framework |
| **React Router** | 7.6.0 | Client-side routing |
| **Bootstrap** | 5.3.6 | UI component library |
| **React Bootstrap** | 2.10.10 | React-Bootstrap integration |
| **Axios** | 1.9.0 | HTTP client |
| **JWT Decode** | 4.0.0 | Token decoding |
| **Day.js** | 1.11.13 | Date manipulation |
| **React Icons** | 5.5.0 | Icon library |
| **Google OAuth** | 0.12.2 | Google authentication |

### Backend

| Technology | Version | Purpose |
|-----------|---------|---------|
| **Node.js** | ≥16.0.0 | Runtime environment |
| **Express** | 5.1.0 | Web framework |
| **MongoDB** | 8.15.1 | Database |
| **Mongoose** | 8.15.1 | ODM |
| **JWT** | 9.0.2 | Authentication |
| **Bcrypt.js** | 3.0.3 | Password hashing |
| **Nodemailer** | 7.0.11 | Email service |
| **Helmet** | 8.1.0 | Security middleware |
| **CORS** | 2.8.5 | Cross-origin requests |
| **Express Rate Limit** | 8.2.1 | Rate limiting |
| **Dotenv** | 17.2.3 | Environment config |

---

## 📁 Project Structure

```
FWD-project/
│
├── client/                          # Frontend React application
│   ├── public/                      # Static assets
│   │   ├── index.html              # HTML template
│   │   ├── manifest.json           # PWA manifest
│   │   └── robots.txt              # SEO robots file
│   │
│   ├── src/
│   │   ├── components/             # Reusable components
│   │   │   ├── AdminRoute.js       # Admin route protection
│   │   │   ├── AuthModal.js        # Authentication modal
│   │   │   ├── Navigation.js       # Navigation bar
│   │   │   └── PrivateRoute.js     # User route protection
│   │   │
│   │   ├── context/                # React context
│   │   │   └── AuthContext.js      # Authentication context
│   │   │
│   │   ├── pages/                  # Page components
│   │   │   ├── admin/              # Admin pages
│   │   │   │   └── AdminDashboard.js
│   │   │   │
│   │   │   ├── auth/               # Authentication pages
│   │   │   │   ├── Login.js
│   │   │   │   ├── Signup.js
│   │   │   │   ├── ForgotPassword.js
│   │   │   │   └── ResetPassword.js
│   │   │   │
│   │   │   ├── core/               # Core pages
│   │   │   │   ├── Home.js
│   │   │   │   ├── Booking.js
│   │   │   │   ├── PaymentGateway.js
│   │   │   │   ├── PaymentStatus.js
│   │   │   │   └── Planning.js
│   │   │   │
│   │   │   └── destinations/       # Destination pages
│   │   │       ├── Destinations.js
│   │   │       ├── Multan.js
│   │   │       ├── Islamabad.js
│   │   │       ├── Karachi.js
│   │   │       ├── Lahore.js
│   │   │       ├── Peshawar.js
│   │   │       ├── Quetta.js
│   │   │       ├── SkarduPage.js
│   │   │       ├── HunzaPage.js
│   │   │       ├── BadshahiPage.js
│   │   │       └── SaifulPage.js
│   │   │
│   │   ├── styles/                 # Global styles
│   │   │   ├── animations.css
│   │   │   ├── design-system.css
│   │   │   ├── glassmorphism.css
│   │   │   └── utilities.css
│   │   │
│   │   ├── App.js                  # Main App component
│   │   ├── App.css                 # App styles
│   │   ├── index.js                # Entry point
│   │   └── index.css               # Global styles
│   │
│   ├── package.json                # Frontend dependencies
│   ├── .gitignore                  # Git ignore rules
│   └── README.md                   # Frontend documentation
│
├── server/                          # Backend Node.js application
│   ├── config/                     # Configuration files
│   │   └── db.js                   # Database connection
│   │
│   ├── controllers/                # Route controllers
│   │   ├── authController.js       # Authentication logic
│   │   ├── destinationController.js # Destination logic
│   │   ├── paymentController.js    # Payment logic
│   │   └── userController.js       # User management logic
│   │
│   ├── middleware/                 # Custom middleware
│   │   └── authMiddleware.js       # JWT verification
│   │
│   ├── models/                     # Database models
│   │   ├── Destination.js          # Destination schema
│   │   ├── Payment.js              # Payment schema
│   │   └── User.js                 # User schema
│   │
│   ├── routes/                     # API routes
│   │   ├── authRoutes.js           # Auth endpoints
│   │   ├── destinationRoutes.js    # Destination endpoints
│   │   ├── paymentRoutes.js        # Payment endpoints
│   │   └── userRoutes.js           # User endpoints
│   │
│   ├── utils/                      # Utility functions
│   │   └── sendEmail.js            # Email service
│   │
│   ├── index.js                    # Server entry point
│   ├── package.json                # Backend dependencies
│   ├── .gitignore                  # Git ignore rules
│   └── README.md                   # Backend documentation
│
├── .gitignore                       # Root git ignore
└── README.md                        # This file
```

---

## 🔧 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v16.0.0 or higher) - [Download](https://nodejs.org/)
- **MongoDB** (v4.4 or higher) - [Download](https://www.mongodb.com/try/download/community)
- **npm** (v8.0.0 or higher) or **yarn** (v1.22.0 or higher)
- **Git** - [Download](https://git-scm.com/downloads)

### Verify Installation

```bash
node --version
npm --version
mongod --version
git --version
```

---

## 📥 Installation

### 1. Clone the Repository

```bash
git clone https://github.com/wasay123q/FWD-project.git
cd FWD-project
```

### 2. Install Backend Dependencies

```bash
cd server
npm install
```

### 3. Install Frontend Dependencies

```bash
cd ../client
npm install
```

---

## 🔑 Environment Variables

### Backend Environment Variables

Create a `.env` file in the `server/` directory:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database
MONGO_URI=mongodb://localhost:27017/travelApp

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_here_change_in_production
JWT_EXPIRE=30d

# Email Configuration (Nodemailer)
EMAIL_SERVICE=gmail
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_specific_password

# Frontend URL (for CORS and email links)
CLIENT_URL=http://localhost:3000

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=200
```

### Frontend Environment Variables (Optional)

Create a `.env` file in the `client/` directory if needed:

```env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_GOOGLE_CLIENT_ID=your_google_oauth_client_id
```

### 📧 Email Setup (Gmail Example)

1. Enable 2-Factor Authentication on your Gmail account
2. Generate an App-Specific Password:
   - Go to Google Account → Security → 2-Step Verification → App passwords
   - Generate a new app password for "Mail"
3. Use the generated password in `EMAIL_PASSWORD`

---

## 🚀 Running the Application

### Method 1: Run Both Servers Separately

#### Terminal 1: Start Backend Server

```bash
cd server
node index.js
```

Server will run on `http://localhost:5000`

#### Terminal 2: Start Frontend Development Server

```bash
cd client
npm start
```

Frontend will run on `http://localhost:3000`

### Method 2: Using the Batch File (Windows)

```bash
cd server
./start-server.bat
```

### Verify the Setup

1. **Backend**: Visit `http://localhost:5000` - Should display "API is running..."
2. **Frontend**: Visit `http://localhost:3000` - Should display the home page

---

## 📚 API Documentation

### Base URL

```
http://localhost:5000/api
```

### Authentication Endpoints

#### Register User

```http
POST /auth/register
Content-Type: application/json

{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "SecurePass123"
}
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "60d5ec49f8d2a123abc12345",
    "username": "john_doe",
    "email": "john@example.com",
    "role": "user"
  }
}
```

#### Login User

```http
POST /auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "SecurePass123"
}
```

#### Forgot Password

```http
POST /auth/forgotpassword
Content-Type: application/json

{
  "email": "john@example.com"
}
```

#### Reset Password

```http
PUT /auth/resetpassword/:resetToken
Content-Type: application/json

{
  "password": "NewSecurePass123"
}
```

#### Get Current User

```http
GET /auth/me
Authorization: Bearer <token>
```

### Payment Endpoints

#### Create Payment

```http
POST /payments
Authorization: Bearer <token>
Content-Type: application/json

{
  "destination": "Hunza Valley",
  "amount": 50000,
  "paymentMethod": "credit_card",
  "bookingDetails": {
    "guests": 2,
    "checkIn": "2025-01-15",
    "checkOut": "2025-01-20"
  }
}
```

#### Get User Payments

```http
GET /payments
Authorization: Bearer <token>
```

#### Get Payment Status

```http
GET /payments/user/status
Authorization: Bearer <token>
```

#### Verify Payment (Admin Only)

```http
PUT /payments/:id/verify
Authorization: Bearer <admin_token>
```

#### Request Refund

```http
PUT /payments/:id/refund
Authorization: Bearer <token>
```

### User Management Endpoints

#### Get All Users (Admin Only)

```http
GET /users
Authorization: Bearer <admin_token>
```

#### Suspend User (Admin Only)

```http
PUT /users/:id/suspend
Authorization: Bearer <admin_token>
```

#### Delete User (Admin Only)

```http
DELETE /users/:id
Authorization: Bearer <admin_token>
```

### Destination Endpoints

#### Get All Destinations

```http
GET /destinations
```

#### Get Destination by ID

```http
GET /destinations/:id
```

#### Create Destination (Admin Only)

```http
POST /destinations
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "name": "Hunza Valley",
  "description": "A beautiful mountain valley...",
  "location": "Gilgit-Baltistan",
  "price": 50000,
  "images": ["url1", "url2"]
}
```

---

## 🗄️ Database Schema

### User Model

```javascript
{
  username: String (required, unique),
  email: String (required, unique),
  password: String (required, hashed),
  role: String (enum: ['user', 'admin'], default: 'user'),
  isSuspended: Boolean (default: false),
  resetPasswordToken: String,
  resetPasswordExpire: Date,
  createdAt: Date (default: Date.now)
}
```

### Payment Model

```javascript
{
  user: ObjectId (ref: 'User'),
  destination: String (required),
  amount: Number (required),
  paymentMethod: String,
  status: String (enum: ['pending', 'completed', 'failed', 'refunded']),
  bookingDetails: {
    guests: Number,
    checkIn: Date,
    checkOut: Date
  },
  transactionId: String,
  createdAt: Date (default: Date.now)
}
```

### Destination Model

```javascript
{
  name: String (required),
  description: String,
  location: String,
  price: Number,
  images: [String],
  rating: Number,
  reviews: [
    {
      user: ObjectId (ref: 'User'),
      comment: String,
      rating: Number
    }
  ],
  createdAt: Date (default: Date.now)
}
```

---

## 🔒 Authentication & Authorization

### JWT Token Flow

1. **User Registration/Login**: Server generates JWT token
2. **Token Storage**: Client stores token in localStorage
3. **Authenticated Requests**: Client includes token in Authorization header
4. **Token Verification**: Server middleware verifies token
5. **Role-Based Access**: Admin routes check for admin role

### Protected Routes

#### Frontend Protected Routes
- `/booking` - User authentication required
- `/paymentgateway` - User authentication required
- `/payment-status` - User authentication required
- `/planning` - User authentication required
- `/admin` - Admin authentication required

#### Backend Middleware
- `protect` - Verifies JWT token
- `admin` - Verifies admin role

### Password Security

- Passwords hashed using bcrypt (10 salt rounds)
- Password reset tokens expire after 10 minutes
- Rate limiting prevents brute force attacks

---

## 🧪 Testing

### Run Tests

```bash
# Backend tests
cd server
npm test

# Frontend tests
cd client
npm test
```

### Test API Endpoints

Use the provided test scripts:

```bash
cd server
node test_endpoints.js
node test_api.js
node verify_auth.js
node verify_backend.js
```

### Manual Testing with Postman

Import the API endpoints into Postman for manual testing. Ensure you:
1. Set environment variables for `token` and `baseUrl`
2. Include Authorization header for protected routes
3. Test error cases and edge cases

---

## 🌐 Deployment

### Backend Deployment (Railway/Render/Heroku)

1. **Set Environment Variables** on your hosting platform
2. **Update CORS Origins** to include your frontend URL
3. **Update MongoDB URI** to production database
4. **Deploy Command**: `node index.js` or `npm start`

### Frontend Deployment (Vercel/Netlify)

1. **Build the application**:
   ```bash
   cd client
   npm run build
   ```

2. **Configure Environment Variables** on hosting platform

3. **Update API URLs** to point to production backend

### MongoDB Atlas Setup

1. Create a free cluster on [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Whitelist your IP or allow access from anywhere (0.0.0.0/0)
3. Get connection string and update `MONGO_URI` in `.env`

### Production Checklist

- [ ] Set `NODE_ENV=production`
- [ ] Use strong `JWT_SECRET`
- [ ] Configure email service for production
- [ ] Enable HTTPS
- [ ] Set appropriate rate limits
- [ ] Configure CORS for production domains
- [ ] Set up monitoring and logging
- [ ] Configure backup strategies for database
- [ ] Review and update security headers

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/AmazingFeature
   ```
3. **Commit your changes**
   ```bash
   git commit -m 'Add some AmazingFeature'
   ```
4. **Push to the branch**
   ```bash
   git push origin feature/AmazingFeature
   ```
5. **Open a Pull Request**

### Coding Standards

- Follow existing code style
- Write meaningful commit messages
- Add comments for complex logic
- Update documentation as needed
- Test your changes thoroughly

---

## 📝 Scripts Reference

### Client Scripts

```bash
npm start          # Start development server
npm run build      # Build for production
npm test           # Run tests
npm run eject      # Eject from Create React App
```

### Server Scripts

```bash
node index.js              # Start server
node create_admin.js       # Create admin user
node migrate_bookings.js   # Run database migrations
node diagnostics.js        # Run system diagnostics
node verify_auth.js        # Verify authentication
node verify_backend.js     # Verify backend setup
```

---

## 🐛 Troubleshooting

### Common Issues

#### MongoDB Connection Error
```
❌ MongoDB Initial Connection Error: connect ECONNREFUSED
```
**Solution**: Ensure MongoDB is running
```bash
# Windows
net start MongoDB

# macOS/Linux
sudo systemctl start mongod
```

#### CORS Error
```
Access to fetch at 'http://localhost:5000' has been blocked by CORS policy
```
**Solution**: Verify `CLIENT_URL` in backend `.env` matches frontend URL

#### Port Already in Use
```
Error: listen EADDRINUSE: address already in use :::5000
```
**Solution**: Kill the process or use a different port
```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# macOS/Linux
lsof -ti:5000 | xargs kill
```

#### JWT Token Invalid
```
401 Unauthorized: Token is not valid
```
**Solution**: 
- Clear localStorage and login again
- Verify `JWT_SECRET` matches between requests
- Check token expiration

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👥 Authors

- **Wasay** - *Initial work* - [wasay123q](https://github.com/wasay123q)

---

## 🙏 Acknowledgments

- React team for the amazing frontend library
- Express.js for the robust backend framework
- MongoDB for the flexible database solution
- Bootstrap for the responsive UI components
- All contributors who have helped this project grow

---

## 📞 Support

For support, email wasay@example.com or create an issue in the GitHub repository.

---

## 🗺️ Roadmap

### Upcoming Features

- [ ] Real-time chat support
- [ ] Advanced search and filtering
- [ ] User reviews and ratings
- [ ] Multi-language support
- [ ] Mobile application (React Native)
- [ ] Social media integration
- [ ] Email notifications for bookings
- [ ] Analytics dashboard for admin
- [ ] Payment gateway integration (Stripe/PayPal)
- [ ] Booking reminders via SMS
- [ ] Weather information for destinations
- [ ] Interactive maps
- [ ] Virtual tours
- [ ] Loyalty program

---

<div align="center">

**Made with ❤️ for Pakistan Tourism**

⭐ Star this repository if you found it helpful!

[Report Bug](https://github.com/wasay123q/FWD-project/issues) • [Request Feature](https://github.com/wasay123q/FWD-project/issues)

</div>
