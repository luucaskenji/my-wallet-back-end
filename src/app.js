require('dotenv').config();
require('express-async-errors');

const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

const usersRouter = require('./routers/usersRouter');
const financesRouter = require('./routers/financesRouter');

app.use('/users', usersRouter);
app.use('/finances', financesRouter);

app.use((error, req, res, next) => {
  console.log(error);

  res.status(500).send(error);
})

module.exports = app;