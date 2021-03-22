const router = require('express').Router();
const authMiddleware = require('../middlewares/auth');

const financesController = require('../controllers/financesController');

router.get('/', authMiddleware, async (req, res) => {
  const { userId } = req;
  const finances = await financesController.getOperations(userId);

  res.send(finances);
});

module.exports = router;