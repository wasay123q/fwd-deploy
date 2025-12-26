# 🖥️ BACKEND EXPLANATION - VIVA PREPARATION GUIDE

## 📋 Table of Contents
1. [Technology Stack Overview](#technology-stack-overview)
2. [Architecture & Design Patterns](#architecture--design-patterns)
3. [Folder Structure Deep Dive](#folder-structure-deep-dive)
4. [Database Design](#database-design)
5. [Authentication & Authorization](#authentication--authorization)
6. [API Endpoints Reference](#api-endpoints-reference)
7. [Middleware Implementation](#middleware-implementation)
8. [Security Implementations](#security-implementations)
9. [Error Handling Strategy](#error-handling-strategy)
10. [Email Service Integration](#email-service-integration)
11. [Code Practices & Patterns](#code-practices--patterns)
12. [Potential Viva Questions & Answers](#potential-viva-questions--answers)

---

## 🛠️ Technology Stack Overview

### Core Technologies & Versions

| Technology | Version | Purpose | Why This Choice? |
|-----------|---------|---------|------------------|
| **Node.js** | ≥16.0.0 | Runtime Environment | Async I/O, JavaScript everywhere, huge ecosystem |
| **Express.js** | 5.1.0 | Web Framework | Minimalist, flexible, middleware-based, industry standard |
| **MongoDB** | 8.15.1 | Database | Document-based, flexible schema, JSON-like storage |
| **Mongoose** | 8.15.1 | ODM | Schema validation, query builder, middleware support |
| **JWT** | 9.0.2 | Authentication | Stateless, scalable, industry standard for token auth |
| **Bcrypt.js** | 3.0.3 | Password Hashing | Slow by design (prevents brute force), salting built-in |
| **Nodemailer** | 7.0.11 | Email Service | SMTP support, HTML emails, attachment support |
| **Helmet** | 8.1.0 | Security Headers | Sets HTTP headers for security (XSS, CSP, etc.) |
| **CORS** | 2.8.5 | Cross-Origin Requests | Enables frontend-backend communication |
| **Express Rate Limit** | 8.2.1 | Rate Limiting | Prevents DDoS, brute force attacks |
| **Dotenv** | 17.2.3 | Environment Config | Keeps secrets out of code |
| **Axios** | 1.13.2 | HTTP Client | For external API calls if needed |

### Why This Stack?

**MERN Stack Benefits**:
1. **JavaScript Everywhere**: Same language for frontend and backend
2. **JSON Native**: Data flows as JSON from database to client
3. **Active Community**: Huge ecosystem, easy to find solutions
4. **Scalability**: Event-driven, non-blocking I/O
5. **Fast Development**: Rapid prototyping, hot reloading

---

## 🏗️ Architecture & Design Patterns

### Architectural Pattern: MVC (Model-View-Controller)

```
┌─────────────────────────────────────────────────────────┐
│                    Client (Frontend)                     │
└───────────────────┬─────────────────────────────────────┘
                    │ HTTP Requests (JSON)
                    ↓
┌─────────────────────────────────────────────────────────┐
│                 Express.js Server                        │
│                                                          │
│  ┌────────────────────────────────────────────────┐    │
│  │  Routes Layer (Routing)                        │    │
│  │  ├── /api/auth          → authRoutes.js        │    │
│  │  ├── /api/users         → userRoutes.js        │    │
│  │  ├── /api/payments      → paymentRoutes.js     │    │
│  │  └── /api/destinations  → destinationRoutes.js │    │
│  └────────────────────────────────────────────────┘    │
│                         ↓                                │
│  ┌────────────────────────────────────────────────┐    │
│  │  Middleware Layer (Request Processing)         │    │
│  │  ├── CORS                                       │    │
│  │  ├── Body Parser (JSON)                        │    │
│  │  ├── Helmet (Security Headers)                 │    │
│  │  ├── Rate Limiting                             │    │
│  │  ├── Auth Middleware (protect, admin)          │    │
│  │  └── Error Handler                             │    │
│  └────────────────────────────────────────────────┘    │
│                         ↓                                │
│  ┌────────────────────────────────────────────────┐    │
│  │  Controllers Layer (Business Logic)            │    │
│  │  ├── authController.js                         │    │
│  │  ├── userController.js                         │    │
│  │  ├── paymentController.js                      │    │
│  │  └── destinationController.js                  │    │
│  └────────────────────────────────────────────────┘    │
│                         ↓                                │
│  ┌────────────────────────────────────────────────┐    │
│  │  Models Layer (Data Schema)                    │    │
│  │  ├── User.js (Mongoose Schema)                 │    │
│  │  ├── Payment.js (Mongoose Schema)              │    │
│  │  └── Destination.js (Mongoose Schema)          │    │
│  └────────────────────────────────────────────────┘    │
└───────────────────┬─────────────────────────────────────┘
                    │ MongoDB Queries
                    ↓
┌─────────────────────────────────────────────────────────┐
│                  MongoDB Database                        │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐    │
│  │   Users     │  │  Payments   │  │ Destinations│    │
│  │ Collection  │  │ Collection  │  │ Collection  │    │
│  └─────────────┘  └─────────────┘  └─────────────┘    │
└─────────────────────────────────────────────────────────┘
```

### Request Flow Example: User Login

```
1. Client POST /api/auth/login { email, password }
                    ↓
2. Express Router: authRoutes.js → router.post("/login", loginUser)
                    ↓
3. Controller: authController.loginUser()
                    ↓
4. Find user in DB: User.findOne({ email })
                    ↓
5. Validate password: bcrypt.compare(password, user.password)
                    ↓
6. Generate JWT: jwt.sign({ id: user._id }, SECRET)
                    ↓
7. Return response: { token, username, email, role }
                    ↓
8. Client stores token and uses for future requests
```

### Request Flow Example: Protected Route

```
1. Client GET /api/payments (with Authorization header)
                    ↓
2. Express Router: paymentRoutes.js → router.get("/payments", protect, getPayments)
                    ↓
3. Middleware: authMiddleware.protect()
   ├── Extract token from header
   ├── Verify JWT signature
   ├── Find user from token ID
   ├── Check if suspended
   └── Attach user to req.user
                    ↓
4. Controller: paymentController.getPayments()
   ├── Check if admin or regular user
   ├── Query payments: Payment.find(query)
   └── Return filtered payments
                    ↓
5. Client receives payment data
```

---

## 📁 Folder Structure Deep Dive

### Root Structure (`server/`)

```
server/
├── config/              # Configuration files
│   └── db.js           # MongoDB connection logic
├── controllers/         # Business logic (Request handlers)
│   ├── authController.js
│   ├── userController.js
│   ├── paymentController.js
│   └── destinationController.js
├── middleware/          # Custom middleware
│   └── authMiddleware.js
├── models/              # Database schemas (Mongoose models)
│   ├── User.js
│   ├── Payment.js
│   └── Destination.js
├── routes/              # API route definitions
│   ├── authRoutes.js
│   ├── userRoutes.js
│   ├── paymentRoutes.js
│   └── destinationRoutes.js
├── utils/               # Utility functions
│   └── sendEmail.js
├── index.js             # Server entry point
├── package.json         # Dependencies
├── .env                 # Environment variables (gitignored)
└── .gitignore          # Git ignore rules
```

---

## 🗄️ Database Design

### Schema Design Philosophy

**MongoDB Choice Reasoning**:
1. **Flexible Schema**: Tourism app data varies (destinations, bookings)
2. **JSON Storage**: Natural fit with JavaScript/JSON data flow
3. **Scalability**: Horizontal scaling with sharding
4. **Developer Friendly**: JavaScript-like queries

### User Schema (`models/User.js`)

```javascript
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,  // Hashed with bcrypt
  },
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  isSuspended: {
    type: Boolean,
    default: false,
  },
  // Password Reset Fields
  resetPasswordToken: String,
  resetPasswordExpire: Date,
});
```

**Key Features**:

1. **Pre-Save Hook** (Middleware):
```javascript
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();  // Skip if password unchanged
  }
  const salt = await bcrypt.genSalt(10);  // Generate salt
  this.password = await bcrypt.hash(this.password, salt);  // Hash password
});
```

**Why Pre-Save Hook?**
- Automatic password hashing
- Runs before save operation
- Only hashes if password changed
- Transparent to controller logic

2. **Instance Method** (Password Comparison):
```javascript
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};
```

**Why Instance Method?**
- Attached to each user document
- Clean API: `user.matchPassword(password)`
- Encapsulates bcrypt logic

3. **Password Reset Token Generation**:
```javascript
userSchema.methods.getResetPasswordToken = function () {
  // Generate random token
  const resetToken = crypto.randomBytes(20).toString("hex");
  
  // Hash and set to database
  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  
  // Set expiration (10 minutes)
  this.resetPasswordExpire = Date.now() + 10 * 60 * 1000;
  
  // Return unhashed token (sent in email)
  return resetToken;
};
```

**Security Reasoning**:
- Store hashed token in database
- Send unhashed token in email
- Even if database compromised, tokens are hashed
- 10-minute expiration prevents old links from working

### Payment Schema (`models/Payment.js`)

```javascript
const paymentSchema = new mongoose.Schema({
  bookingReference: {
    type: String,
    unique: true,      // Prevents duplicates
    sparse: true,      // Allows multiple null values
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",       // Reference to User model
    required: true,
  },
  name: String,
  username: String,    // Actually email
  destination: String,
  startDate: String,
  endDate: String,
  duration: Number,
  people: Number,
  pricePerPerson: Number,
  totalAmount: Number,
  timestamp: { 
    type: Date, 
    default: Date.now 
  },
  paymentScreenshot: {
    type: String,      // Base64 encoded image
    default: null,
  },
  verificationStatus: {
    type: String,
    enum: ["pending", "verified", "rejected", "suspended", "refunded"],
    default: "pending",
  },
  verifiedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: null,
  },
  verifiedAt: Date,
  rejectionReason: String,
  suspensionReason: String,
  refundedAt: Date,
  refundedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  refundReason: String,
});
```

**Key Design Decisions**:

1. **ObjectId References**:
   - `user`: Who made the booking
   - `verifiedBy`: Which admin verified
   - `refundedBy`: Which admin processed refund
   - **Benefits**: Data integrity, population, cascading deletes

2. **Booking Reference**:
   - Format: `BOOK-2025-00001`
   - Generated in controller: `BOOK-${year}-${count.padStart(5, '0')}`
   - Unique identifier for customer reference

3. **Verification Workflow**:
   - **pending**: Initial state after booking
   - **verified**: Admin approved payment
   - **rejected**: Admin rejected (invalid screenshot)
   - **suspended**: Fraudulent activity
   - **refunded**: Money returned to customer

4. **Base64 Image Storage**:
   - **Pros**: Simple, no file system
   - **Cons**: Large documents, slow queries
   - **Production**: Use AWS S3, Cloudinary

### Destination Schema (`models/Destination.js`)

```javascript
const destinationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: String,
  location: String,
  price: Number,
  images: [String],    // Array of image URLs
  rating: {
    type: Number,
    default: 0,
  },
  reviews: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      comment: String,
      rating: Number,
      createdAt: {
        type: Date,
        default: Date.now,
      },
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});
```

**Embedded vs Referenced Data**:
- **Embedded**: Reviews are embedded (part of destination document)
- **Referenced**: User in reviews is referenced
- **Why**: Reviews belong to destination, accessed together

---

## 🔐 Authentication & Authorization

### JWT (JSON Web Token) Implementation

#### Token Structure

```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYwZDVlYzQ5ZjhkMmExMjNhYmMxMjM0NSIsImlhdCI6MTYyNDY0NzIwMCwiZXhwIjoxNjI3MjM5MjAwfQ.signature

├─ Header (Algorithm & Type)
├─ Payload (User ID, issued at, expiration)
└─ Signature (Verifies token authenticity)
```

#### Token Generation (`authController.js`)

```javascript
const generateToken = (id) => {
  return jwt.sign(
    { id },                              // Payload: user ID
    process.env.JWT_SECRET || "secret",  // Secret key
    { expiresIn: "30d" }                 // Expiration: 30 days
  );
};
```

**Security Considerations**:
- **Secret Key**: Must be long, random, and secret
- **Expiration**: Balance between UX and security
- **Payload Size**: Keep minimal (only user ID)
- **HS256 Algorithm**: HMAC with SHA-256

#### Token Verification (`authMiddleware.js`)

```javascript
const protect = async (req, res, next) => {
  let token;

  // 1. Check if Authorization header exists
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      // 2. Extract token from "Bearer TOKEN"
      token = req.headers.authorization.split(" ")[1];

      // 3. Verify token signature and decode
      const decoded = jwt.verify(token, process.env.JWT_SECRET || "secret");

      // 4. Find user from decoded ID
      req.user = await User.findById(decoded.id).select("-password");

      if (!req.user) {
        return res.status(401).json({ message: "User not found" });
      }

      // 5. Check if user is suspended
      if (req.user.isSuspended) {
        return res.status(403).json({ message: "Account suspended" });
      }

      // 6. User authenticated, proceed to next middleware
      return next();
    } catch (error) {
      console.error("❌ Auth error:", error.message);
      return res.status(401).json({ message: "Not authorized, token failed" });
    }
  } else {
    return res.status(401).json({ message: "Not authorized, no token" });
  }
};
```

**Step-by-Step Breakdown**:

1. **Header Extraction**: Check `Authorization: Bearer TOKEN`
2. **Token Parsing**: Split by space, get second part
3. **Signature Verification**: `jwt.verify()` checks if token is valid
4. **Decode Payload**: Extract user ID from token
5. **Database Lookup**: Find user by ID
6. **Exclude Password**: `.select("-password")` excludes password field
7. **Suspension Check**: Additional security layer
8. **Attach to Request**: `req.user` available in controllers
9. **Error Handling**: Invalid/expired tokens return 401

#### Role-Based Access Control (RBAC)

```javascript
const admin = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();  // User is admin, proceed
  } else {
    res.status(401).json({ message: "Not authorized as an admin" });
  }
};
```

**Usage in Routes**:
```javascript
router.put("/payments/:id/verify", protect, admin, verifyPayment);
//                                  ↑        ↑
//                          Authenticate  Check Admin
```

**Middleware Chain**:
1. `protect`: Verifies JWT, loads user
2. `admin`: Checks if `req.user.role === "admin"`
3. `verifyPayment`: Business logic

---

## 🛣️ API Endpoints Reference

### Authentication Routes (`routes/authRoutes.js`)

```javascript
const router = express.Router();

// Public routes
router.post("/register", registerUser);
router.post("/login", loginUser);

// Protected routes
router.get("/me", protect, getMe);

// Password reset routes
router.post("/forgotpassword", forgotPassword);
router.put("/resetpassword/:resetToken", resetPassword);
```

#### Endpoint Details

##### 1. **POST /api/auth/register**

**Purpose**: Create new user account

**Request Body**:
```json
{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "SecurePass123"
}
```

**Controller Logic** (`authController.registerUser`):
```javascript
exports.registerUser = async (req, res) => {
  const { username, email, password } = req.body;

  // 1. Validation
  if (!username || !email || !password) {
    return res.status(400).json({ message: "Please add all fields" });
  }

  // 2. Check if user exists
  const userExists = await User.findOne({ email });
  if (userExists) {
    return res.status(400).json({ message: "User already exists" });
  }

  // 3. Create user (password hashed automatically by pre-save hook)
  const user = await User.create({ username, email, password });

  // 4. Generate JWT token
  const token = generateToken(user.id);

  // 5. Return user data and token
  res.status(201).json({
    _id: user.id,
    username: user.username,
    email: user.email,
    role: user.role,
    token: token,
  });
};
```

**Response**:
```json
{
  "_id": "60d5ec49f8d2a123abc12345",
  "username": "john_doe",
  "email": "john@example.com",
  "role": "user",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

##### 2. **POST /api/auth/login**

**Controller Logic** (`authController.loginUser`):
```javascript
exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  // 1. Find user by email
  const user = await User.findOne({ email });

  // 2. Check if user exists AND password matches
  if (user && (await user.matchPassword(password))) {
    res.json({
      _id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
      token: generateToken(user.id),
    });
  } else {
    res.status(401).json({ message: "Invalid credentials" });
  }
};
```

**Security Notes**:
- Password never returned in response
- Same error for "user not found" and "wrong password" (prevents user enumeration)
- Uses instance method `matchPassword()` for comparison

##### 3. **GET /api/auth/me** (Protected)

**Purpose**: Get current logged-in user info

**Headers Required**:
```
Authorization: Bearer TOKEN
```

**Controller Logic**:
```javascript
exports.getMe = async (req, res) => {
  // req.user populated by protect middleware
  res.status(200).json(req.user);
};
```

**Response**:
```json
{
  "_id": "60d5ec49f8d2a123abc12345",
  "username": "john_doe",
  "email": "john@example.com",
  "role": "user",
  "createdAt": "2025-01-15T10:30:00.000Z",
  "isSuspended": false
}
```

##### 4. **POST /api/auth/forgotpassword**

**Purpose**: Initiate password reset process

**Request Body**:
```json
{
  "email": "john@example.com"
}
```

**Controller Logic** (`authController.forgotPassword`):
```javascript
exports.forgotPassword = async (req, res) => {
  const { email } = req.body;

  // 1. Find user
  const user = await User.findOne({ email });
  if (!user) {
    // Generic error (don't reveal if email exists)
    return res.status(404).json({ message: "Email could not be sent" });
  }

  // 2. Generate reset token
  const resetToken = user.getResetPasswordToken();

  // 3. Save hashed token to database
  await user.save({ validateBeforeSave: false });

  // 4. Create reset URL (frontend)
  const resetUrl = `http://localhost:3000/resetpassword/${resetToken}`;

  // 5. Send email
  try {
    await sendEmail({
      email: user.email,
      subject: "Password Reset Token",
      message: `Reset your password: ${resetUrl}`,
    });

    res.status(200).json({ success: true, data: "Email sent" });
  } catch (err) {
    // If email fails, clear reset token
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save({ validateBeforeSave: false });

    return res.status(500).json({ message: "Email could not be sent" });
  }
};
```

**Flow**:
1. User submits email
2. Backend generates random token
3. Hash token and save to DB (with expiration)
4. Send unhashed token in email
5. User clicks link with token
6. Frontend navigates to reset page

##### 5. **PUT /api/auth/resetpassword/:resetToken**

**Purpose**: Reset password with token

**URL**: `/api/auth/resetpassword/abc123...`

**Request Body**:
```json
{
  "password": "NewSecurePass456"
}
```

**Controller Logic** (`authController.resetPassword`):
```javascript
exports.resetPassword = async (req, res) => {
  // 1. Hash the token from URL
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.resetToken)
    .digest("hex");

  // 2. Find user with this token and check expiration
  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },  // Not expired
  });

  if (!user) {
    return res.status(400).json({ message: "Invalid token" });
  }

  // 3. Set new password (will be hashed by pre-save hook)
  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;

  // 4. Save user
  await user.save();

  // 5. Return success and token (auto-login)
  res.status(200).json({
    success: true,
    data: "Password Reset Success",
    token: generateToken(user.id),
  });
};
```

**Security Features**:
- Token hashing (stored hash ≠ URL token)
- Expiration check (10 minutes)
- One-time use (cleared after use)
- New password hashed automatically

### Payment Routes (`routes/paymentRoutes.js`)

```javascript
router.post("/payments", protect, createPayment);
router.get("/payments", protect, getPayments);
router.get("/payments/user/status", protect, getUserPaymentStatus);
router.put("/payments/:id/verify", protect, admin, verifyPayment);
router.put("/payments/:id/refund", protect, requestRefund);
router.get("/payments/:id", protect, getPaymentById);
router.put("/payments/:id", protect, updatePayment);
router.delete("/payments/:id", protect, deletePayment);
```

#### Key Endpoints

##### 1. **POST /api/payments** (Create Booking)

**Controller Logic** (`paymentController.createPayment`):
```javascript
exports.createPayment = async (req, res) => {
  // 1. Check authentication
  if (!req.user) {
    return res.status(401).json({ message: "User not authenticated" });
  }
  
  // 2. Generate unique booking reference
  const year = new Date().getFullYear();
  const count = await Payment.countDocuments();
  const bookingReference = `BOOK-${year}-${String(count + 1).padStart(5, '0')}`;
  
  // 3. Create payment with user ID
  const payment = new Payment({ 
    ...req.body,                    // Form data
    user: req.user._id,            // From auth middleware
    bookingReference 
  });
  
  // 4. Save to database
  const savedPayment = await payment.save();
  
  // 5. Return success
  res.status(201).json({ 
    message: "Payment stored successfully", 
    _id: savedPayment._id,
    bookingReference: savedPayment.bookingReference 
  });
};
```

**Booking Reference Generation**:
- Format: `BOOK-2025-00001`
- Year: Current year
- Count: Total bookings + 1
- Padding: 5 digits (00001, 00002, etc.)

##### 2. **GET /api/payments** (List Bookings)

**Controller Logic** (`paymentController.getPayments`):
```javascript
exports.getPayments = async (req, res) => {
  let query = {};

  // If not admin, only show own payments
  if (req.user.role !== "admin") {
    query.user = req.user._id;
  }

  // Fetch payments
  const payments = await Payment.find(query).sort({ timestamp: -1 });
  
  res.json(payments);
};
```

**Access Control**:
- **Regular User**: Only sees their own bookings
- **Admin**: Sees ALL bookings
- **Sorting**: Most recent first (`.sort({ timestamp: -1 })`)

##### 3. **PUT /api/payments/:id/verify** (Admin Only)

**Controller Logic** (`paymentController.verifyPayment`):
```javascript
exports.verifyPayment = async (req, res) => {
  const { status, rejectionReason, suspensionReason } = req.body;
  
  // Validate status
  if (!['verified', 'rejected', 'suspended'].includes(status)) {
    return res.status(400).json({ message: "Invalid verification status" });
  }

  // Find payment
  const payment = await Payment.findById(req.params.id);
  
  if (!payment) {
    return res.status(404).json({ message: "Payment not found" });
  }

  // Update payment
  payment.verificationStatus = status;
  payment.verifiedBy = req.user._id;  // Admin who verified
  payment.verifiedAt = new Date();
  
  if (status === 'rejected') {
    payment.rejectionReason = rejectionReason;
  } else if (status === 'suspended') {
    payment.suspensionReason = suspensionReason;
  }

  await payment.save();

  res.json({
    success: true,
    message: `Payment ${status} successfully`,
    payment
  });
};
```

**Verification Workflow**:
1. Admin views pending payment with screenshot
2. Admin clicks Verify/Reject/Suspend
3. Status updated in database
4. User sees updated status in their bookings

### User Routes (`routes/userRoutes.js`)

```javascript
router.get("/", protect, admin, getUsers);          // List all users
router.put("/:id/suspend", protect, admin, suspendUser);  // Suspend
router.delete("/:id", protect, admin, deleteUser);  // Delete
```

**Admin Only**: All user management routes require admin role

---

## 🛡️ Middleware Implementation

### Middleware Execution Order (CRITICAL)

```javascript
// 1. CORS (MUST BE FIRST)
app.use(cors(corsOptions));

// 2. Body parsers
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// 3. Security middleware
app.use(helmet({ crossOriginResourcePolicy: { policy: "cross-origin" } }));

// 4. Rate limiting
app.use(limiter);

// 5. Static files
app.use("/public", express.static("public"));

// 6. Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", protect, userRoutes);  // Protected routes

// 7. Error handler (LAST)
app.use(errorHandler);
```

**Why Order Matters**:
- CORS must be first (preflight requests)
- Body parsers before routes (req.body availability)
- Error handler last (catches all errors)

### Security Middleware Deep Dive

#### 1. **CORS Configuration**

```javascript
const corsOptions = {
  origin: "http://localhost:3000",              // Frontend URL
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  credentials: true,                            // Allow cookies/auth
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));
```

**What CORS Does**:
- Allows frontend (different origin) to make requests
- Prevents other websites from accessing your API
- Handles preflight OPTIONS requests

**Viva Question**: Why CORS?
- Browser security feature
- Prevents malicious sites from accessing your API
- Must be configured server-side

#### 2. **Helmet.js Security Headers**

```javascript
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));
```

**Headers Set by Helmet**:
- `X-Content-Type-Options`: Prevents MIME sniffing
- `X-Frame-Options`: Prevents clickjacking
- `X-XSS-Protection`: Enables XSS filter
- `Strict-Transport-Security`: Forces HTTPS
- `Content-Security-Policy`: Restricts resource loading

**crossOriginResourcePolicy**: Allows loading images from different origins

#### 3. **Rate Limiting**

```javascript
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,      // 15 minutes
  max: 200,                       // 200 requests per window
  message: "Too many requests from this IP",
  skipSuccessfulRequests: true,  // Don't count successful requests
});
```

**Purpose**: Prevent abuse
- **DDoS Protection**: Limits requests from single IP
- **Brute Force Prevention**: Slows down password guessing
- **Resource Protection**: Prevents API exhaustion

**How It Works**:
- Tracks requests by IP address
- In-memory storage (resets on restart)
- Returns 429 status when limit exceeded

**Production Improvement**: Use Redis for distributed rate limiting

---

## 🔒 Security Implementations

### 1. Password Security

#### Hashing with Bcrypt

```javascript
// Hashing (10 rounds of salting)
const salt = await bcrypt.genSalt(10);
const hashedPassword = await bcrypt.hash(password, salt);

// Comparing
const isMatch = await bcrypt.compare(plainPassword, hashedPassword);
```

**Why Bcrypt?**
- **Slow by Design**: Takes ~100ms (prevents brute force)
- **Salting**: Random salt prevents rainbow table attacks
- **Adaptive**: Can increase rounds as computers get faster

**Salt Rounds**:
- 10 rounds = 2^10 = 1024 iterations
- Each round doubles time
- Balance: Security vs Performance

#### Password Policies

**Frontend Validation**:
```regex
/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/
```
- Minimum 8 characters
- At least 1 uppercase
- At least 1 lowercase
- At least 1 number

**Backend**: Relies on frontend (should add backend validation too)

### 2. JWT Security

**Token Best Practices Implemented**:
1. ✅ **Short-lived**: 30 days (could be shorter)
2. ✅ **Signed**: HMAC-SHA256 signature
3. ✅ **Secret Key**: Environment variable
4. ✅ **Minimal Payload**: Only user ID
5. ❌ **Refresh Tokens**: Not implemented (improvement)

**What Could Be Improved**:
- Refresh token rotation
- Token blacklisting on logout
- HttpOnly cookies instead of localStorage

### 3. MongoDB Injection Prevention

**Mongoose Protection**:
```javascript
// BAD (raw MongoDB)
db.users.find({ email: req.body.email });  // Vulnerable

// GOOD (Mongoose)
User.findOne({ email: req.body.email });   // Safe
```

**Why Mongoose is Safe**:
- Type casting
- Query sanitization
- Schema validation

**Example Attack Prevented**:
```json
// Attacker sends
{
  "email": { "$ne": null },  // Returns all users
  "password": "anything"
}

// Mongoose converts to
{
  "email": "[object Object]",  // No match
  "password": "anything"
}
```

### 4. Environment Variables

**.env File** (Not in Git):
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/travelApp
JWT_SECRET=your_secret_key_here
EMAIL_USERNAME=your_email@gmail.com
EMAIL_PASSWORD=your_app_password
```

**Loaded with Dotenv**:
```javascript
require("dotenv").config();

const secret = process.env.JWT_SECRET;
```

**Why Environment Variables?**
- Secrets not in code
- Different configs per environment
- Easy deployment

### 5. Error Handling (No Stack Traces in Production)

```javascript
app.use((err, req, res, next) => {
  console.error("❌ Unhandled error:", err);
  res.status(500).json({ 
    message: "Internal server error", 
    error: process.env.NODE_ENV === 'development' ? err.message : undefined 
  });
});
```

**Security Reasoning**:
- Stack traces reveal code structure
- Only shown in development
- Production shows generic message

---

## 📧 Email Service Integration

### Nodemailer Setup (`utils/sendEmail.js`)

```javascript
const nodemailer = require("nodemailer");

const sendEmail = async (options) => {
  // 1. Create transporter (SMTP config)
  const transporter = nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE,  // "gmail"
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,  // App-specific password
    },
  });

  // 2. Extract reset URL from message
  const resetUrl = options.message.split('PUT request to: \n\n ')[1];

  // 3. Define email options
  const mailOptions = {
    from: `"Tourist App" <${process.env.EMAIL_USERNAME}>`,
    to: options.email,
    subject: options.subject,
    text: options.message,  // Plain text version
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px;">
        <h2>Password Reset Request</h2>
        <p>Click the button below to reset your password:</p>
        <a href="${resetUrl}" 
           style="background-color: #0ea5e9; color: white; padding: 10px 20px; 
                  text-decoration: none; border-radius: 5px; display: inline-block;">
           Reset Password
        </a>
        <p style="color: #666;">Ignore if you didn't request this.</p>
      </div>
    `,
  };

  // 4. Send email
  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
```

**Gmail Setup Requirements**:
1. Enable 2-Factor Authentication
2. Generate App-Specific Password
3. Use app password in EMAIL_PASSWORD

**HTML Email Benefits**:
- Clickable button
- Better formatting
- Professional appearance
- Fallback to plain text

**Viva Question**: Why not use sendgrid/mailgun?
- **Development**: Gmail is free and simple
- **Production**: Would use transactional email service (Sendgrid, AWS SES)
- **Limitations**: Gmail has daily sending limits

---

## ⚡ Error Handling Strategy

### Types of Errors Handled

#### 1. Validation Errors

```javascript
if (!username || !email || !password) {
  return res.status(400).json({ message: "Please add all fields" });
}
```

**Status Code**: 400 Bad Request

#### 2. Authentication Errors

```javascript
if (!user || !(await user.matchPassword(password))) {
  return res.status(401).json({ message: "Invalid credentials" });
}
```

**Status Code**: 401 Unauthorized

#### 3. Authorization Errors

```javascript
if (req.user.role !== "admin") {
  return res.status(403).json({ message: "Not authorized as admin" });
}
```

**Status Code**: 403 Forbidden

#### 4. Not Found Errors

```javascript
if (!payment) {
  return res.status(404).json({ message: "Payment not found" });
}
```

**Status Code**: 404 Not Found

#### 5. Server Errors

```javascript
try {
  // Logic
} catch (error) {
  console.error(error);
  res.status(500).json({ message: "Server Error" });
}
```

**Status Code**: 500 Internal Server Error

### Global Error Handlers

#### Unhandled Promise Rejections

```javascript
process.on('unhandledRejection', (err) => {
  console.error('❌ UNHANDLED REJECTION!');
  console.error('Error:', err);
  console.error('Stack:', err.stack);
  // Continue running (don't crash)
});
```

#### Uncaught Exceptions

```javascript
process.on('uncaughtException', (err) => {
  console.error('❌ UNCAUGHT EXCEPTION!');
  console.error('Error:', err);
  console.error('Stack:', err.stack);
  // Continue running (don't crash)
});
```

**Production Note**: Should log to file/service and gracefully restart

---

## 💻 Code Practices & Patterns

### 1. MVC Architecture Separation

**Models**: Data structure and validation
**Controllers**: Business logic
**Routes**: Endpoint definitions

**Benefits**:
- Clear separation of concerns
- Easy to test
- Scalable

### 2. Async/Await Pattern

**Consistent Error Handling**:
```javascript
exports.functionName = async (req, res) => {
  try {
    // Async operations
    const result = await Model.find();
    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error" });
  }
};
```

### 3. Mongoose Best Practices

**Always Use Try-Catch**:
```javascript
try {
  await user.save();
} catch (error) {
  // Handle duplicate key, validation errors
}
```

**Use Lean Queries for Performance**:
```javascript
// Returns plain JS object (faster)
const users = await User.find().lean();
```

**Projection** (Select Fields):
```javascript
// Exclude password
const user = await User.findById(id).select("-password");
```

### 4. Logging Strategy

**Console Logs with Emojis** (Easy to Spot):
```javascript
console.log("✅ MongoDB Connected");
console.error("❌ Connection failed");
console.log("🔐 Token verified");
console.log("📝 Booking created");
```

**Production**: Use logging library (Winston, Pino)

### 5. Validation

**Input Validation**:
```javascript
// Type checking
if (typeof email !== 'string') return error;

// Format validation
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
if (!emailRegex.test(email)) return error;

// Mongoose validation (in schema)
email: {
  type: String,
  required: [true, 'Email is required'],
  unique: true,
  match: [/^\S+@\S+\.\S+$/, 'Invalid email']
}
```

### 6. DRY Principle (Don't Repeat Yourself)

**Reusable Token Generation**:
```javascript
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "30d" });
};
```

Used in: register, login, resetPassword

---

## 🎓 Potential Viva Questions & Answers

### Architecture & Design

**Q: Why did you choose Express.js?**
**A**: Express is minimalist yet powerful. It's the most popular Node.js framework with huge community support. The middleware pattern makes it easy to add functionality (authentication, logging, error handling). It's unopinionated, giving us flexibility in architecture. For a project like tourism booking, Express provides all necessary features without overhead.

**Q: Explain the MVC pattern in your application**
**A**: 
- **Models** (`models/`): Define data structure with Mongoose schemas (User, Payment, Destination)
- **Controllers** (`controllers/`): Handle business logic and database operations
- **Routes** (`routes/`): Define API endpoints and connect them to controllers
- **Middleware**: Sits between routes and controllers for cross-cutting concerns (auth, validation)

This separation makes code maintainable - changing database logic doesn't affect routing.

**Q: Why MongoDB over MySQL?**
**A**: 
1. **Flexible Schema**: Tourism data varies (different destinations have different attributes)
2. **JSON Native**: Perfect with JavaScript - data flows as JSON from DB to client
3. **Scalability**: Horizontal scaling with sharding
4. **Developer Experience**: JavaScript-like queries, no ORM impedance mismatch
5. **Document Model**: Reviews embedded in destinations, natural data relationships

For structured financial data, I'd choose SQL. For varied content data, NoSQL is better.

### Database Design

**Q: Explain your User schema**
**A**: User schema has username, email, hashed password, role (user/admin), suspension status, and password reset fields. Key features:
1. **Pre-save hook**: Automatically hashes passwords before saving
2. **Instance methods**: `matchPassword()` for login, `getResetPasswordToken()` for password reset
3. **Indexes**: Email and username are unique (enforced by MongoDB)
4. **Security**: Password never exposed in queries (`.select('-password')`)

**Q: Why embed reviews in destinations instead of separate collection?**
**A**: **Embedded Documents** are better when:
- Data is always accessed together (destination + reviews)
- Bounded cardinality (reviews won't grow infinitely)
- Atomic operations (update review and destination together)

**Referenced Documents** are better when:
- Data accessed independently
- Unbounded growth
- Many-to-many relationships

Our reviews are always shown with destination, so embedding is optimal.

**Q: What is the purpose of bookingReference?**
**A**: Booking reference (e.g., `BOOK-2025-00001`) is a user-friendly identifier for customers. Internally, we use MongoDB ObjectId (`_id`), but that's not human-readable. Booking reference:
- Easy to reference in support
- Sequential numbering
- Year prefix for record-keeping
- Unique constraint prevents duplicates

**Q: Why store images as base64 in database?**
**A**: **Pros**: Simple, no file system, no external services. **Cons**: Large documents (33% size increase), slower queries, MongoDB size limits. **Production Alternative**: AWS S3, Cloudinary - store URL in database, files in cloud storage. For MVP/proof-of-concept, base64 is quickest implementation.

### Authentication & Security

**Q: How does JWT authentication work in your app?**
**A**: 
1. User logs in with credentials
2. Server verifies password with bcrypt
3. Server generates JWT containing user ID
4. Client stores token (localStorage)
5. Client includes token in Authorization header for requests
6. Middleware verifies token signature
7. Middleware loads user from database
8. Controller accesses user via req.user

Token is **stateless** - server doesn't store session. This scales well horizontally.

**Q: What's the difference between authentication and authorization?**
**A**: 
- **Authentication**: Verifying WHO you are (`protect` middleware - checks if logged in)
- **Authorization**: Verifying WHAT you can do (`admin` middleware - checks if you're admin)

Example: Regular user is authenticated to view their bookings, but not authorized to verify payments (admin only).

**Q: How do you prevent brute force password attacks?**
**A**: Multiple layers:
1. **Rate Limiting**: Max 200 requests per 15 minutes per IP
2. **Bcrypt**: Slow hashing (~100ms) makes brute force impractical
3. **Strong Password Policy**: Minimum requirements enforced
4. **Account Lockout**: After X failed attempts (not implemented but should be)
5. **Monitoring**: Log failed attempts (production)

**Q: Explain the password reset flow**
**A**: 
1. User submits email
2. Generate random crypto token (20 bytes)
3. Hash token and save to database (not plain text!)
4. Set 10-minute expiration
5. Email unhashed token to user
6. User clicks link with token in URL
7. Frontend sends token + new password
8. Backend hashes received token
9. Find user with matching hash and unexpired token
10. Update password (hashed by pre-save hook)
11. Clear reset fields
12. Return success (optionally auto-login with JWT)

**Security**: Even if database compromised, reset tokens are hashed.

**Q: Why hash the password reset token?**
**A**: Defense in depth. If database is compromised, attacker has hashed tokens, not usable tokens. Also, tokens have short expiration (10 minutes). Similar to how we hash passwords - never store sensitive data in plain text.

**Q: What is bcrypt salt and why use it?**
**A**: Salt is random data added to password before hashing. **Without salt**: Same password = same hash (attacker can use rainbow tables). **With salt**: Same password = different hash (each user's salt is unique). Bcrypt automatically generates and stores salt with hash. Even if two users have password "123456", their hashes are different.

### Middleware

**Q: What is middleware in Express?**
**A**: Middleware are functions that execute during request-response cycle. They have access to `req`, `res`, and `next`. Middleware can:
- Execute code
- Modify req/res objects
- End request-response cycle
- Call next middleware in stack

Examples in our app:
- `cors()`: Handles cross-origin requests
- `express.json()`: Parses JSON body
- `protect`: Verifies JWT
- `admin`: Checks admin role

**Q: Why is CORS middleware placed first?**
**A**: CORS handles preflight OPTIONS requests. If CORS comes after body parser, preflight requests (which have no body) might fail. CORS must be first to:
1. Handle OPTIONS requests immediately
2. Set necessary headers before other processing
3. Allow/deny request at earliest point

**Q: Explain the protect middleware in detail**
**A**: 
```javascript
1. Check Authorization header exists and starts with "Bearer"
2. Extract token (split by space, take second part)
3. Verify JWT signature with secret key
4. Decode payload to get user ID
5. Query database for user by ID
6. Check user exists
7. Check user not suspended
8. Exclude password from user object
9. Attach user to req.user
10. Call next() to proceed to controller
```

If any step fails, return 401 and stop.

**Q: Why chain protect and admin middleware?**
**A**: **Separation of concerns**. `protect` handles authentication, `admin` handles authorization. This is:
- **Reusable**: `protect` used for all protected routes
- **Composable**: Can have other roles (moderator, user)
- **Maintainable**: Change auth logic once
- **Clear**: Each middleware has single responsibility

### API Design

**Q: Why RESTful API design?**
**A**: REST (Representational State Transfer) is industry standard:
- **Resource-based**: URLs represent resources (`/users`, `/payments`)
- **HTTP Methods**: GET (read), POST (create), PUT (update), DELETE (delete)
- **Stateless**: Each request independent
- **Standard Status Codes**: 200, 401, 404, 500

Example:
```
GET    /api/payments      → List bookings
POST   /api/payments      → Create booking
GET    /api/payments/:id  → Get specific booking
PUT    /api/payments/:id  → Update booking
DELETE /api/payments/:id  → Delete booking
```

**Q: What status codes do you use and why?**
**A**: 
- **200 OK**: Successful GET, PUT
- **201 Created**: Successful POST
- **400 Bad Request**: Validation errors, missing fields
- **401 Unauthorized**: Not logged in, invalid token
- **403 Forbidden**: Logged in but insufficient permissions
- **404 Not Found**: Resource doesn't exist
- **500 Internal Server Error**: Unexpected errors

Correct status codes help clients handle errors appropriately.

**Q: How do you version your API?**
**A**: Currently no versioning (all endpoints under `/api`). **Production approach**:
- **URL Versioning**: `/api/v1/users`, `/api/v2/users`
- **Header Versioning**: `Accept: application/vnd.api.v1+json`
- **Query Parameter**: `/api/users?version=1`

URL versioning is most common and explicit.

### Error Handling

**Q: How do you handle errors in async functions?**
**A**: Every async controller wrapped in try-catch:
```javascript
try {
  await databaseOperation();
  res.json(result);
} catch (error) {
  console.error(error);
  res.status(500).json({ message: "Error" });
}
```

Also have global handlers for:
- Unhandled promise rejections
- Uncaught exceptions
- Express error middleware

**Q: Why log errors to console instead of crashing?**
**A**: **Development**: Console logs are immediate and visible. **Production**: Should log to file/service (Winston, Loggly). We continue running instead of crashing because:
- One bad request shouldn't kill server
- Error might be recoverable
- Graceful degradation better than total failure

However, critical errors (DB connection) should maybe restart.

### Performance & Scalability

**Q: How would you scale this application?**
**A**: 
1. **Horizontal Scaling**: Multiple server instances behind load balancer
2. **Database**: MongoDB replica sets (read replicas)
3. **Caching**: Redis for frequent queries (destinations)
4. **CDN**: CloudFront for static assets
5. **Async Jobs**: Bull/BullMQ for email sending
6. **Session Storage**: Redis instead of in-memory
7. **Monitoring**: New Relic, Datadog

JWT is stateless, so scales well (no session store).

**Q: How do you optimize database queries?**
**A**: 
1. **Indexes**: Unique indexes on email, username
2. **Projection**: `.select('-password')` reduces data transfer
3. **Lean Queries**: `.lean()` returns plain objects (faster)
4. **Pagination**: `.limit()` and `.skip()` for large datasets
5. **Aggregation**: Complex queries use aggregation pipeline
6. **Connection Pooling**: Mongoose handles automatically

**Not Implemented But Should**:
- Populate selectively
- Avoid N+1 queries
- Query result caching

**Q: What is N+1 query problem?**
**A**: When you fetch list of items, then make separate query for each item's relations.

**Bad**:
```javascript
const payments = await Payment.find();  // 1 query
for (let payment of payments) {
  const user = await User.findById(payment.user);  // N queries
}
```

**Good**:
```javascript
const payments = await Payment.find().populate('user');  // 2 queries total
```

### Testing

**Q: How would you test this backend?**
**A**: 
1. **Unit Tests**: Test individual controllers, models (Jest, Mocha)
2. **Integration Tests**: Test API endpoints (Supertest)
3. **Database Tests**: Use test database (MongoDB Memory Server)
4. **Mocking**: Mock external services (nodemailer)
5. **Coverage**: Aim for 80%+ code coverage

**Example Test**:
```javascript
describe('POST /api/auth/register', () => {
  it('should register new user', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ username: 'test', email: 'test@test.com', password: 'Test123' });
    
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('token');
  });
});
```

### Deployment

**Q: How would you deploy this application?**
**A**: 
**Backend**:
1. **Platform**: Railway, Render, Heroku, DigitalOcean
2. **Environment**: Set environment variables
3. **Database**: MongoDB Atlas (cloud)
4. **CI/CD**: GitHub Actions for automated deployment
5. **Monitoring**: PM2 for process management, logging

**Steps**:
1. Push code to GitHub
2. Connect platform to repository
3. Configure environment variables
4. Set build command: `npm install`
5. Set start command: `node index.js`
6. Deploy

**Q: What environment variables are critical?**
**A**: 
- `PORT`: Server port
- `MONGO_URI`: Database connection string
- `JWT_SECRET`: Token signing key (MUST be secret)
- `NODE_ENV`: production/development
- `EMAIL_*`: SMTP credentials
- `CLIENT_URL`: Frontend URL for CORS

Never commit `.env` file - use platform's secret management.

---

## 🔥 Advanced Topics to Impress Professor

### 1. Database Indexing

**Mongoose Automatic Indexes**:
```javascript
email: { type: String, unique: true }  // Creates unique index
```

**Custom Indexes**:
```javascript
userSchema.index({ email: 1, username: 1 });  // Compound index
```

**Why Indexes Matter**: O(log n) vs O(n) lookup time

### 2. Connection Pooling

**Mongoose Default**: 5 connections in pool

**Custom Configuration**:
```javascript
mongoose.connect(uri, {
  maxPoolSize: 10,
  minPoolSize: 2
});
```

**Benefits**: Reuses connections, faster than creating new each time

### 3. Graceful Shutdown

**Should Implement**:
```javascript
process.on('SIGTERM', async () => {
  console.log('SIGTERM received, closing server');
  await mongoose.connection.close();
  server.close(() => process.exit(0));
});
```

### 4. Request Validation with Joi

**Better Than Manual**:
```javascript
const Joi = require('joi');

const schema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required()
});

const { error } = schema.validate(req.body);
```

### 5. API Documentation

**Should Add**: Swagger/OpenAPI documentation
```javascript
/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 */
```

### 6. Microservices Architecture

**Current**: Monolith (all in one server)

**Could Split Into**:
- Auth Service
- Booking Service
- Payment Service
- Notification Service

**Communication**: REST, GraphQL, or message queue (RabbitMQ)

---

## 📊 Performance Considerations

### Current Bottlenecks

1. **Base64 Images**: Large documents, slow queries
2. **No Caching**: Every request hits database
3. **Synchronous Email**: Blocks response
4. **No Pagination**: Returns all bookings

### Improvements

1. **Cloud Storage**: AWS S3 for images
2. **Redis Caching**: Cache destinations
3. **Job Queue**: Bull for async emails
4. **Pagination**: Implement limit/offset

---

## 🎯 Key Takeaways for Viva

### What Makes This Project Strong

1. **Solid Architecture**: Clear MVC separation
2. **Security Conscious**: JWT, bcrypt, rate limiting, Helmet
3. **Error Handling**: Try-catch, global handlers
4. **Modern Practices**: Async/await, ES6, environment variables
5. **Scalable Design**: Stateless JWT, MongoDB
6. **Production Features**: CORS, rate limiting, email service

### What Could Be Improved

1. **Testing**: No automated tests
2. **Validation**: Manual validation (should use Joi)
3. **Caching**: No caching layer
4. **Logging**: Console logs (should use Winston)
5. **Monitoring**: No health checks, metrics
6. **Documentation**: No API documentation
7. **TypeScript**: Would add type safety

---

## 📝 Quick Reference

### Important Files

| File | Lines | Key Concepts |
|------|-------|--------------|
| `index.js` | 100 | Server setup, middleware chain, error handling |
| `authController.js` | 200 | Registration, login, password reset |
| `authMiddleware.js` | 50 | JWT verification, RBAC |
| `User.js` | 70 | Schema, pre-save hook, instance methods |
| `Payment.js` | 80 | Booking schema, verification status |
| `db.js` | 40 | MongoDB connection, error handling |

### Tech Stack Summary

**Runtime**: Node.js 16+  
**Framework**: Express.js 5.1.0  
**Database**: MongoDB 8.15.1 + Mongoose 8.15.1  
**Auth**: JWT 9.0.2 + Bcrypt 3.0.3  
**Security**: Helmet 8.1.0 + CORS 2.8.5 + Rate Limit 8.2.1  
**Email**: Nodemailer 7.0.11  

### Architecture Summary

**Pattern**: MVC + Middleware  
**Auth**: JWT (Stateless)  
**Database**: NoSQL (Document-based)  
**API**: RESTful  
**Security**: Defense in depth  

---

**Best of luck for your viva! You're well-prepared! 🚀**
