const express = require('express');
const cors = require('cors');
const app = express();

const dataValidation = require('./middlewares/dataValidation');
const { signUp, signIn } = require('./controllers/usersController');

app.use(cors());
app.use(express.json());

app.post('/user/sign-up', dataValidation.signUp, signUp);
app.post('/user/sign-in', dataValidation.signIn, signIn)

app.listen(3000);