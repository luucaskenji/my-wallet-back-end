require('dotenv').config();
require('express-async-errors');

const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

const usersRouter = require('./routers/usersRouter');
const financesRouter = require('./routers/financesRouter');
const {
  DataNotInPatternError,
  ExistingUserError,
  NotFoundError,
  WrongPasswordError,
  AuthError
} = require('./errors');

app.use('/users', usersRouter);
app.use('/finances', financesRouter);

app.use((err, req, res, next) => {
  console.log(err);

  if (err instanceof DataNotInPatternError) return res.status(422).send(err.message);
  else if (err instanceof ExistingUserError) return res.status(409).send(err.message);
  else if (err instanceof NotFoundError) return res.status(404).send(err.message);
  else if (err instanceof WrongPasswordError) return res.status(401).send(err.message);
  else if (err instanceof AuthError) return res.status(401).send(err.message);
  else res.status(500).send(err);
})

module.exports = app;