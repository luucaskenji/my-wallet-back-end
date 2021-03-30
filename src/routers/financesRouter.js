const router = require('express').Router();
const authMiddleware = require('../middlewares/auth');

const financesController = require('../controllers/financesController');
const financesSchemas = require('../schemas/financesSchemas');
const { DataNotInPatternError } = require('../errors');

router.get('/', authMiddleware, async (req, res) => {
  const finances = await financesController.getOperations(req.userId);
  res.send(finances);
});

router.post('/', authMiddleware, async (req, res) => {
  const { error } = financesSchemas.moneyOperations.validate(req.body);
  if (error) throw new DataNotInPatternError(`Request body not valid: ${error.details[0].message}`);

  const createdFinance = await financesController.postOperation(req.userId, req.body);

  res.status(201).send(createdFinance);
});

module.exports = router;