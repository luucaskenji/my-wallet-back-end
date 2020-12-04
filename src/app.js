const express = require('express');
const cors = require('cors');
const app = express();

const dataValidation = require('./middlewares/dataValidation');
const { authMiddleware } = require('./middlewares/auth');
const { signUp, signIn } = require('./controllers/usersController');
const { postIncome } = require('./controllers/financesController');

app.use(cors());
app.use(express.json());

app.post('/user/sign-up', dataValidation.signUp, signUp);
app.post('/user/sign-in', dataValidation.signIn, signIn)
app.post('/finances/new-income', authMiddleware, dataValidation.incomeAndExpense, postIncome);

module.exports = { app };