require('dotenv').config();

const express = require('express');
const cors = require('cors');
const helmet    = require('helmet');
const passport  = require('./config/passport');
const app = express();
const path = require('path');

const db = require('./config/db');


app.use(helmet({
  contentSecurityPolicy: false,
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));
app.use(cors({
  origin:      process.env.FRONTEND_URL,
  credentials: true
}));
app.use(express.json());
app.use(passport.initialize());

app.use('/uploads', (req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
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