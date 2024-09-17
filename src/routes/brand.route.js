
const express = require('express');
const { auth, adminAuth } = require('../middlewares/auth.middleware');
const { createBrand, deleteBrandById, getBrandById, getBrands, updateBrandById } = require('../controllers/brand');
const validateMiddleware = require('../middlewares/validate.middleware');
const { brandSchema } = require('../schemas/schemas');
const router = express.Router();

// Routes for Brand CRUD operations
router.post('/create', validateMiddleware(brandSchema), auth, adminAuth, createBrand);
router.get('/all', getBrands);
router.get('/get/:id', getBrandById);
router.put('/update/:id', validateMiddleware(brandSchema), auth, adminAuth, updateBrandById);
router.delete('/delete/:id', auth, adminAuth, deleteBrandById);

module.exports = router;
