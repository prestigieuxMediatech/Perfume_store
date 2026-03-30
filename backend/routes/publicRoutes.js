const express = require('express');
const router  = express.Router();
const {
  getPublicProducts,
  getPublicProductById,
  getPublicCategories,
  getPublicBrands,
} = require('../controllers/publicDisplayController');

router.get('/products',        getPublicProducts);
router.get('/products/:id',    getPublicProductById);
router.get('/categories',      getPublicCategories);
router.get('/brands',          getPublicBrands);

module.exports = router;