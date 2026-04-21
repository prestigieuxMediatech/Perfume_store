const express = require('express');
const router  = express.Router();
const {
  getPublicProducts,
  getPublicProductById,
  getPublicProductReviews,
  getPublicCategories,
  getPublicBrands,
} = require('../controllers/publicDisplayController');
const { getPublicBoxes } = require('../controllers/boxController');
const { getPublicBlogs, getPublicBlogBySlug } = require('../controllers/blogController');

router.get('/products',        getPublicProducts);
router.get('/products/:id',    getPublicProductById);
router.get('/products/:id/reviews', getPublicProductReviews);
router.get('/categories',      getPublicCategories);
router.get('/brands',          getPublicBrands);
router.get('/boxes',           getPublicBoxes);
router.get('/blogs',           getPublicBlogs);
router.get('/blogs/:slug',     getPublicBlogBySlug);

module.exports = router;
