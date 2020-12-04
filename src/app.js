const express = require('express');
const cors = require('cors');
const app = express();

const dataValidation = require('./middlewares/dataValidation');
const { authMiddleware } = require('./middlewares/auth');
const { signUp, signIn, signOut } = require('./controllers/usersController');
const { getOperations, postOperation } = require('./controllers/financesController');

app.use(cors());
app.use(express.json());

app.post('/user/sign-up', dataValidation.signUp, signUp);
app.post('/user/sign-in', dataValidation.signIn, signIn);
app.post('/user/sign-out', authMiddleware, signOut);

app.get('/finances/user-operations', authMiddleware, getOperations);
app.post('/finances/new-operation', authMiddleware, dataValidation.incomeAndExpense, postOperation);

module.exports = { app };