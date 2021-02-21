const router = require('express').Router();
const authMiddleware = require('../middlewares/auth');

router.get('/users', authMiddleware, async (req, res) => {
  // get userId from middleware
});

module.exports = router;