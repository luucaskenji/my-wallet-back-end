const { verifyIfEmailExists, createUser, authenticateUser, endSession } = require('../repositories/usersRepository');
const { createSession } = require('../repositories/sessionsRepository');

const bcrypt = require('bcrypt');

const User = require('../models/User');
const sanitize = require('../utils/sanitizer');
const { ExistingUserError } = require('../errors');

class UserController {
  async signUp(name, email, password) {
    [name, email, password] = sanitize([name, email, password]);
    password = bcrypt.hashSync(password, 10);

    const [createdUser, hasBeenCreated] = await User.findOrCreate({
      where: { email },
      defaults: { name, password },
      attributes: { exclude: ['createdAt'] }
    });

    if (!hasBeenCreated) throw new ExistingUserError('User already exists');

    const newUser = createdUser.toJSON();
    return {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email
    };
  }

  async signIn(req, res) {
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

  async signOut(req, res) {
    const { user } = req;

    const endSessionResponse = await endSession(user.id);

    if (endSessionResponse.statusCode !== 200) {
      return res.status(endSessionResponse.statusCode).send(endSessionResponse.message);
    }

    res.sendStatus(200);
  }
}

module.exports = new UserController();