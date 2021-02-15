const router = require('express').Router();

const usersController = require('../controllers/usersController');
const authSchemas = require('../schemas/authSchemas');
const { DataNotInPatternError } = require('../errors');

router.post('/sign-up', async (req, res) => {
  const { error } = authSchemas.signUp.validate(req.body);
  if (error) throw new DataNotInPatternError('Request body not valid');

  const { name, email, password } = req.body
  const createdUser = await usersController.signUp(name, email, password);

  res.status(201).send(createdUser);
});

module.exports = router;