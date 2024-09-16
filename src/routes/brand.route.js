
const express = require('express');
const {auth, adminAuth} = require('../middlewares/auth.middleware');
const { createBrand, deleteBrandById, getBrandById, getBrands, updateBrandById } = require('../controllers/brand');
const router = express.Router();

// Routes for Brand CRUD operations
router.post('/create', auth, adminAuth, createBrand);
router.get('/all', getBrands);
router.get('/get/:id', getBrandById);
router.put('/update/:id', auth, adminAuth, updateBrandById);
router.delete('/delete/:id', auth, adminAuth, deleteBrandById);

module.exports = router;
