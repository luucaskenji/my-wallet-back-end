const router = require('express').Router();

const authSchemas = require('../schemas/authSchemas');

router.post('/sign-up', async (req, res) => {
  const { error } = authSchemas.signUp.validate(req.body);
  if (error) return res.status(422).send('Request body not valid');
});

module.exports = router;