require('dotenv').config();

const express = require('express');
const cors = require('cors');
const helmet    = require('helmet');
const passport  = require('./config/passport');
const app = express();

const db = require('./config/db');

app.use(helmet());
app.use(cors({
  origin:      process.env.FRONTEND_URL,
  credentials: true
}));
app.use(express.json());
app.use(passport.initialize());
app.use(express.json());

app.use('/api/auth',require('./routes/authRoutes'));

const PORT = process.env.PORT;

app.listen(PORT, () => {
    console.log(`Backend running at PORT:${PORT}`);
});