const jwt = require('jsonwebtoken');

module.exports = async (req, res, next) => {
  if (req.method === 'OPTIONS') return next();

  try {
    const token = req.headers.authorization.split(' ')[1];
    if (!token) return res.json({ status: 401, message: 'Вы не авторизованы!' });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id;
    next();
  } catch (e) {
    return res.json({ status: 401, message: 'Вы не авторизованы!' });
  }
};
