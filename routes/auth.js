const { Router } = require('express');
const { register, login, auth } = require('../controllers/auth');
const authMiddleware = require('../middlewares/authMiddleware');
const router = Router();

router.post('/register', register);
router.post('/login', login);
router.get('/', authMiddleware, auth);

module.exports = router;
