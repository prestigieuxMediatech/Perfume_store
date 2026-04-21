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
const {
  getBoxes,
  addBox,
  getBoxById,
  updateBox,
  deleteBox
} = require('../controllers/boxController');
const {
  getAdminBlogs,
  getAdminBlogById,
  createBlog,
  updateBlog,
  deleteBlog,
} = require('../controllers/blogController');
const { getAdminOrders, getAdminOrderById, updateOrderStatus, deleteAdminOrder } = require('../controllers/orderController');
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

router.get('/boxes', adminAuth, getBoxes);
router.post('/boxes', adminAuth, addBox);
router.get('/boxes/:id', adminAuth, getBoxById);
router.put('/boxes/:id', adminAuth, updateBox);
router.delete('/boxes/:id', adminAuth, deleteBox);

router.get('/blogs', adminAuth, getAdminBlogs);
router.post('/blogs', adminAuth, upload.single('cover_image'), createBlog);
router.get('/blogs/:id', adminAuth, getAdminBlogById);
router.put('/blogs/:id', adminAuth, upload.single('cover_image'), updateBlog);
router.delete('/blogs/:id', adminAuth, deleteBlog);

router.get('/orders', adminAuth, getAdminOrders);
router.get('/orders/:id', adminAuth, getAdminOrderById);
router.put('/orders/:id/status', adminAuth, updateOrderStatus);
router.delete('/orders/:id', adminAuth, deleteAdminOrder);

module.exports = router;
