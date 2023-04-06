const { Router } = require('express');

const authMiddleware = require('../middlewares/authMiddleware');
const {
  getAllProducts,
  getUserProducts,
  buyProduct,
  collectIncome
} = require('../controllers/product');

const router = Router();

router.get('', authMiddleware, getAllProducts);
router.get('/user', authMiddleware, getUserProducts);
router.post('/buy', authMiddleware, buyProduct);
router.get('/collect', authMiddleware, collectIncome);

module.exports = router;
