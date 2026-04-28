require('dotenv').config();

const express = require('express');
const cors = require('cors');
const helmet    = require('helmet');
const passport  = require('./config/passport');
const app = express();
const path = require('path');

const db = require('./config/db');

const parseAllowedOrigins = () => {
  const configured = String(process.env.FRONTEND_URL || '')
    .split(',')
    .map((value) => value.trim())
    .filter(Boolean);

  const defaults = [
    'http://localhost:3000',
    'http://127.0.0.1:3000',
    'https://perfume-store-two.vercel.app'
  ];

  return Array.from(new Set([...configured, ...defaults]));
};

const allowedOrigins = parseAllowedOrigins();


app.use(helmet({
  contentSecurityPolicy: false,
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    return callback(new Error(`Origin ${origin} not allowed by CORS`));
  },
  credentials: true
}));
app.use(express.json());
app.use(passport.initialize());

app.use('/uploads', (req, res, next) => {
  const requestOrigin = req.headers.origin;
  if (requestOrigin && allowedOrigins.includes(requestOrigin)) {
    res.setHeader('Access-Control-Allow-Origin', requestOrigin);
  }
  res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
  res.setHeader('Vary', 'Origin');
  next();
});

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/api/auth',require('./routes/authRoutes'));
app.use('/api/admin',require('./routes/adminRoutes'));
app.use('/api', require('./routes/publicRoutes'));

const PORT = process.env.PORT;

app.listen(PORT, () => {
    console.log(`Backend running at PORT:${PORT}`);
});
