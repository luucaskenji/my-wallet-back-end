const express = require('express');
const cors = require('cors');
const app = express();

const { signUpValidation } = require('./middlewares/signUpValidation');
const { signUp } = require('./controllers/usersController');

app.use(cors());
app.use(express.json());

app.post('/user/sign-up', signUpValidation, signUp);

app.listen(3000);