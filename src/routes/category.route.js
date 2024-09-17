const express = require('express');
const { auth, adminAuth } = require('../middlewares/auth.middleware');
const { createCategory, createSubcategory, deleteCategoryById, deleteSubcategory, editCategoriesById, getCategories, getCategoriesById, updateSubcategory } = require('../controllers/category');
const validateMiddleware = require('../middlewares/validate.middleware');
const { categorySchema, subcategorySchema } = require('../schemas/schemas');
const router = express.Router();

router.post('/create', validateMiddleware(categorySchema), auth, adminAuth, createCategory);
router.get('/all', getCategories);
router.get('/get/:id', getCategoriesById);
router.put('/update/:id', validateMiddleware(categorySchema), auth, adminAuth, editCategoriesById);
router.delete('/delete/:id', auth, adminAuth, deleteCategoryById);

router.post('/subcategory/create', validateMiddleware(subcategorySchema), auth, adminAuth, createSubcategory);
router.put('/subcategory/update/:id', validateMiddleware(subcategorySchema), auth, adminAuth, updateSubcategory);
router.delete('/subcategory/delete/:id', auth, adminAuth, deleteSubcategory);

module.exports = router;
