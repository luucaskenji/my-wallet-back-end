const stringStripHtml = require('string-strip-html');
const { verifyIfEmailExists, createUser, authenticateUser, endSession } = require('../repositories/usersRepository');
const { createSession } = require('../repositories/sessionsRepository');

async function signUp(req, res) {
    let { name, email, password } = req.body;
    let createdUser;

    name = stringStripHtml(name).result;
    email = stringStripHtml(email).result;
    password = stringStripHtml(password).result;

    const verificationResponse = await verifyIfEmailExists(email);

    if (verificationResponse.statusCode !== 200) {
        return res.status(verificationResponse.statusCode).send(verificationResponse.message)
    }

    const createUserResponse = await createUser({ name, email, password });
    
    if (createUserResponse.statusCode !== 201) {
        return res.status(createUserResponse.statusCode).send(createdUser.message)
    }
    else {
        createdUser = createUserResponse.content;
    }

    res.status(201).send(createdUser);
}

async function signIn(req, res) {
    let { email, password } = req.body;
    
    email = stringStripHtml(email).result;

    let foundUser, newSession;

    const authenticateResponse = await authenticateUser(email, password);

    if (authenticateResponse.statusCode !== 200) {
        return res.status(authenticateResponse.statusCode).send(authenticateResponse.message);
    }
    else {
        foundUser = authenticateResponse.content;
    }

    const launchSessionRequest = await createSession(foundUser.id);

    if (launchSessionRequest.statusCode !== 201) {
        return res.status(launchSessionRequest.statusCode).send(launchSessionRequest.message);
    }
    else {
        newSession = launchSessionRequest.content;
    }

    const userData = {
        id: foundUser.id,
        name: foundUser.name,
        email: foundUser.email,
        token: newSession.token
    };

    return res.status(200).send(userData);
}

async function signOut(req, res) {
    const { user } = req;

    const endSessionResponse = await endSession(user.id);

    if (endSessionResponse.statusCode !== 200) {
        return res.status(endSessionResponse.statusCode).send(endSessionResponse.message);
    }

    res.sendStatus(200);
}

module.exports = { signUp, signIn, signOut };