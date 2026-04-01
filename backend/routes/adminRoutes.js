const express = require('express');
const router  = express.Router();
const upload    = require('../config/multer');
const {
  login,
  createCategory,
  getCategories,
  updateCategory,
  deleteCategory,
  getBrands,       
  addBrand,        
  updateBrand,     
  deleteBrand, 
  addProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct
} = require('../controllers/adminAuthController');
const { getAdminOrders, getAdminOrderById, updateOrderStatus } = require('../controllers/orderController');
const adminAuth = require('../middleware/adminAuth');

router.post('/login', login);

router.get('/categories',        adminAuth, getCategories);
router.post('/create-category',  adminAuth, createCategory);
router.put('/categories/:id',    adminAuth, updateCategory);
router.delete('/categories/:id', adminAuth, deleteCategory);
router.get('/brands',        adminAuth, getBrands);
router.post('/brands',       adminAuth, addBrand);
router.put('/brands/:id',    adminAuth, updateBrand);
router.delete('/brands/:id', adminAuth, deleteBrand);
router.get('/products',             adminAuth, getProducts);
router.post('/products', adminAuth, upload.array('images', 3), addProduct);
router.get('/products/:id',      adminAuth, getProductById);                         
router.put('/products/:id',      adminAuth, upload.array('images', 3), updateProduct); 
router.delete('/products/:id', adminAuth, deleteProduct);

router.get('/orders', adminAuth, getAdminOrders);
router.get('/orders/:id', adminAuth, getAdminOrderById);
router.put('/orders/:id/status', adminAuth, updateOrderStatus);

module.exports = router;
