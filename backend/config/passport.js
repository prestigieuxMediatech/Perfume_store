const passport       = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const pool           = require('./db');
const crypto         = require('crypto');
require('dotenv').config();

passport.use(new GoogleStrategy({
  clientID:     process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL:  process.env.GOOGLE_CALLBACK_URL,
},
async (accessToken, refreshToken, profile, done) => {
  try {
    const email     = profile.emails[0].value;
    const name      = profile.displayName;
    const avatar    = profile.photos[0].value;
    const google_id = profile.id;

    const [rows] = await pool.query(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );

    if (rows.length > 0) {
      const user = rows[0];

      if (!user.google_id) {
        await pool.query(
          'UPDATE users SET google_id = ?, avatar = ? WHERE id = ?',
          [google_id, avatar, user.id]
        );
      }
      return done(null, user);
    }

    const id = crypto.randomUUID();
    await pool.query(
      `INSERT INTO users (id, name, email, google_id, avatar)
       VALUES (?, ?, ?, ?, ?)`,
      [id, name, email, google_id, avatar]
    );

    const [newUser] = await pool.query(
      'SELECT * FROM users WHERE id = ?', [id]
    );

    return done(null, newUser[0]);

  } catch (err) {
    return done(err, null);
  }
}));

module.exports = passport;