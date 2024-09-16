const express = require('express');
const auth = require('../middlewares/auth.middleware');
const { createCategory, createSubcategory, deleteCategoryById, deleteSubcategory, editCategoriesById, getCategories, getCategoriesById, updateSubcategory } = require('../controllers/category');
const router = express.Router();

router.post('/create', auth, adminAuth, createCategory);
router.get('/all', getCategories);
router.get('/get/:id', getCategoriesById);
router.put('/update/:id', auth, adminAuth, editCategoriesById);
router.delete('/delete/:id', auth, adminAuth, deleteCategoryById);

router.post('/subcategory/create', auth, adminAuth, createSubcategory);
router.put('/subcategory/update/:id', auth, adminAuth, updateSubcategory);
router.delete('/subcategory/delete/:id', auth, adminAuth, deleteSubcategory);

module.exports = router;
