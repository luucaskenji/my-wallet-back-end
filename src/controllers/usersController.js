const { verifyIfEmailExists, createUser, authenticateUser } = require('../repositories/usersRepository');
const { createSession } = require('../repositories/sessionsRepository');

async function signUp(req, res) {
    const { name, email, password } = req.body;
    let createdUser;

    const isRepeated = await verifyIfEmailExists(email);

    if (isRepeated.statusCode === 500) {
        return res.status(500).send(isRepeated.message);
    }
    else if (isRepeated.statusCode === 409) {
        return res.status(409).send(isRepeated.message);
    }

    const createUserResponse = await createUser({ name, email, password });
    
    if (createUserResponse.statusCode === 500) {
        return res.status(500).send(createdUser.message)
    }
    else {
        createdUser = createUserResponse.content;
    }

    res.status(201).send(createdUser);
}

async function signIn(req, res) {
    const { email, password } = req.body;
    let foundUser, newSession;

    const authenticateResponse = await authenticateUser(email, password);

    if (authenticateResponse.statusCode === 500) {
        return res.status(500).send(authenticateResponse.message);
    }
    else if (authenticateResponse.statusCode === 404) {
        return res.status(404).send(authenticateResponse.message);
    }
    else if (authenticateResponse.statusCode === 401) {
        return res.status(401).send(authenticateResponse.message);
    }
    else {
        foundUser = authenticateResponse.content;
    }

    const launchSessionRequest = await createSession(foundUser.id);

    if (launchSessionRequest.statusCode === 500) {
        return res.status(500).send(launchSessionRequest.message);
    }
    else {
        newSession = launchSessionRequest.content;
    }

    return res.status(200).send(newSession);
}

module.exports = { signUp, signIn };