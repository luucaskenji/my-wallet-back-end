const router = require('express').Router();

const usersController = require('../controllers/usersController');
const authSchemas = require('../schemas/authSchemas');
const { DataNotInPatternError } = require('../errors');

router.post('/sign-up', async (req, res) => {
  const { error } = authSchemas.signUp.validate(req.body);
  if (error) throw new DataNotInPatternError('Request body not valid');

  const { name, email, password } = req.body;
  const createdUser = await usersController.signUp(name, email, password);

  res.status(201).send(createdUser);
});

router.post('/sign-in', async (req, res) => {
  const { error } = authSchemas.signIn.validate(req.body);
  if (error) throw new DataNotInPatternError('Request body not valid');

  const { email, password } = req.body;
  const newSession = await usersController.signIn(email, password);

  res.status(201).send(newSession);
});

router.post('/sign-out', async (req, res) => {
  // get userId from middleware
  await usersController.signOut(userId);

  res.sendStatus(204);
});

module.exports = router;