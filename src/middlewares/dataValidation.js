const authSchemas = require('../schemas/authSchemas');
const financesSchemas = require('../schemas/financesSchemas');

function signUp(req, res, next) {
    const { name, email, password, passwordConfirmation } = req.body;

    if (!name || !email || !password || !passwordConfirmation) return res.status(400).send('Dados inválidos');

    const { error } = authSchemas.signUp.validate(req.body);
    if (error) return res.status(422).send(error.details[0].message);

    next();
}

function signIn(req, res, next) {
    const { email, password } = req.body;

    if (!email || !password) return res.sendStatus(400);

    const { error } = authSchemas.signIn.validate(req.body);
    if (error) return res.status(422).send(error.details[0].message);

    next();
}

function incomeAndExpense(req, res, next) {
    const { value, description } = req.body;
    
    if (!value || !("description" in req.body)) return res.status(400).send('Dados inválidos');
    
    if (!description) req.body.description = 'Sem descrição';

    const { error } = financesSchemas.income.validate(req.body);
    if (error) return res.status(422).send(error.details[0].message);

    next();
}

module.exports = { signUp, signIn, incomeAndExpense }