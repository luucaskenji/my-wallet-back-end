const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

const dataValidation = require('./middlewares/dataValidation');
const { authMiddleware } = require('./middlewares/auth');
const usersRouter = require('./routers/users');
const financesRouter = require('./routers/finances');

app.use('/users', usersRouter);
app.use('/finances', financesRouter);

module.exports = app;