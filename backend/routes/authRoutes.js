const router = require('express').Router();
const passport = require('../config/passport');
const { googleCallback, getMe } = require('../controllers/authController')
const {auth} = require('../middleware/auth');
require('dotenv').config();

// Step 1 — redirect to Google
router.get(
  '/google',
  passport.authenticate('google', {
    scope: ['profile', 'email'],
    session: false
  })
);

router.get(
  '/google/callback',
  passport.authenticate('google', {
    session: false,
    failureRedirect: `${process.env.FRONTEND_URL}/login?error=auth_failed`
  }),
  googleCallback
);

router.get('/me', auth, getMe);

module.exports = router;