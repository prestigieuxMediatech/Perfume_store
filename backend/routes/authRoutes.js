const router = require('express').Router();
const passport = require('../config/passport');
const { googleCallback, getMe,addToWishlist,getWishlist,getWishlistIds,removeFromWishlist,removeFromShopWishlist,getCart,addToCart,updateCartItem,removeFromCart,clearCart, } = require('../controllers/authController')
const { placeOrder, getMyOrders } = require('../controllers/orderController');
const {auth} = require('../middleware/auth');
require('dotenv').config();

// Step 1 â€” redirect to Google
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

router.get('/wishlist',        auth, getWishlist);
router.get('/wishlist/ids',    auth, getWishlistIds);
router.post('/wishlist',       auth, addToWishlist);
router.delete('/wishlist/:id', auth, removeFromWishlist);
router.delete('/shop/wishlist/:id', auth, removeFromShopWishlist);
router.get('/cart',          auth, getCart);
router.post('/cart',         auth, addToCart);
router.put('/cart/:id',      auth, updateCartItem);
router.delete('/cart/:id',   auth, removeFromCart);
router.delete('/cart',       auth, clearCart);

router.post('/orders', auth, placeOrder);
router.get('/orders', auth, getMyOrders);

module.exports = router;
