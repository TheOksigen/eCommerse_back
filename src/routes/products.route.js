const express = require('express');
const { auth, adminAuth } = require('../middlewares/auth.middleware');
const { createProduct, deleteProductById, editProduct, getProductById, getProducts, getProductsByCategory, getProductsBySubcategory, searchProduct } = require('../controllers/products');
const validateMiddleware = require('../middlewares/validate.middleware');
const { productSchema } = require('../schemas/schemas');
const router = express.Router();

// Route handlers
router.post('/create', validateMiddleware(productSchema), auth, adminAuth, createProduct);
router.get('/all', getProducts);
router.get('/get/:id', getProductById);
router.patch('/update/:id', validateMiddleware(productSchema), auth, editProduct);
router.get('/search', searchProduct);
router.delete('/delete/:id', auth, adminAuth, deleteProductById);

// Routes for category and subcategory
router.get('/category/:category', getProductsByCategory);
router.get('/subcategory/:subcategory', getProductsBySubcategory);

module.exports = router;
