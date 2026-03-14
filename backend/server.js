const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();

// load configuration of env file
require('dotenv').config();

// define routes
const authRoute = require('./routes/authRoutes');
const biodataRoute = require('./routes/biodataRoutes');
const templateRoute = require('./routes/templateRoutes');
const emailRoute = require('./routes/emailRoutes');

const dbConnect = require('./config/database');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const {cloudinaryConnect} = require('./config/cloudinary');
const fileUpload = require('express-fileupload');

// define port
const PORT = process.env.PORT || 10000;

// frontend build paths (used for static hosting in production)
const DIST_DIR = path.resolve(__dirname, '../frontend/dist');
const INDEX_FILE = path.join(DIST_DIR, 'index.html');
const ASSETS_DIR = path.join(DIST_DIR, 'assets');


// connect to db
dbConnect()
.then(() => {
    app.listen(PORT, () => {
        console.log(`App listening at port ${PORT}`);
    });
})
.catch((error) => {
    console.log("Database connection failed:", error);
});

// 1. CORS Configuration (API ONLY)
const rawAllowedOrigins = process.env.FRONTEND_URL
  ? process.env.FRONTEND_URL.split(',').map((value) => value.trim()).filter(Boolean)
  : [];

const devOrigins = ["http://localhost:3000", "http://127.0.0.1:3000"];
const allowedOrigins = process.env.NODE_ENV === 'production'
  ? rawAllowedOrigins
  : [...new Set([...rawAllowedOrigins, ...devOrigins])];

const isSameOrigin = (origin, host) => {
  if (!origin || !host) return false;
  try {
    return new URL(origin).host === host;
  } catch {
    return false;
  }
};

const corsBaseOptions = {
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
};

const corsOptionsDelegate = (req, callback) => {
  const origin = req.header('Origin');
  const host = req.header('Host');

  // Allow requests with no origin (like mobile apps or curl requests)
  if (!origin) {
    return callback(null, { ...corsBaseOptions, origin: true });
  }

  // Always allow in non-production
  if (process.env.NODE_ENV !== 'production') {
    return callback(null, { ...corsBaseOptions, origin: true });
  }

  // Allow same-origin and explicitly allowed origins
  if (allowedOrigins.includes(origin) || isSameOrigin(origin, host)) {
    return callback(null, { ...corsBaseOptions, origin: true });
  }

  // Do not throw: just disable CORS for untrusted origins
  return callback(null, { ...corsBaseOptions, origin: false });
};

app.use('/api', cors(corsOptionsDelegate));

// 2. Body Parsers (Cors handled above)
app.use(express.json());
app.use(cookieParser());

app.use(
    fileUpload({
        useTempFiles: true,
        tempFileDir: '/tmp',
    })
);

// connect to cloudinary
cloudinaryConnect();

// mount routes under /api/v1
app.use('/api/v1/auth', authRoute);
app.use('/api/v1/biodata', biodataRoute);
app.use('/api/v1/template', templateRoute);
app.use('/api/v1/email', emailRoute);

// API health-check route
app.get('/api/health', (req, res) => {
    return res.json({
        success: true,
        message: 'Your server is up and running...',
    });
});

// -------------------------------------------------------------------------
// PROD ONLY: Serve Frontend (MUST BE LAST)
// -------------------------------------------------------------------------

// Serve static files from the frontend/dist directory (only if build exists)
if (fs.existsSync(INDEX_FILE)) {
    // Quick sanity check endpoint for verifying static build presence in production
    app.get('/__static_check', (req, res) => {
        return res.json({
            ok: true,
            distDir: DIST_DIR,
            indexExists: true
        });
    });

    // Serve assets with no SPA fallback so missing assets return 404 (not HTML)
    app.use('/assets', express.static(ASSETS_DIR, { fallthrough: false }));

    // Serve other static files (favicon, etc.)
    app.use(express.static(DIST_DIR, { index: false }));

    // Handle SPA routing - return index.html for any non-API, non-asset GET requests (Express 5 safe)
    app.get(/^(?!\/api|\/assets).*/, (req, res) => {
        return res.sendFile(INDEX_FILE);
    });
} else {
    app.get('/__static_check', (req, res) => {
        return res.status(404).json({
            ok: false,
            distDir: DIST_DIR,
            indexExists: false
        });
    });
    console.warn(`Frontend build not found at ${INDEX_FILE}. Static assets will not be served.`);
}
