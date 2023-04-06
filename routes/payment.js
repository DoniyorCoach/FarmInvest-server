const { Router } = require('express');
const {
  getWallet,
  setWallet,
  getBonus
} = require('../controllers/payment');
const authMiddleware = require('../middlewares/authMiddleware');

const router = Router();

router.get('/wallet', authMiddleware, getWallet);
router.post('/wallet',authMiddleware, setWallet);
router.get('/bonus', authMiddleware, getBonus);

module.exports = router;
