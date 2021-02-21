const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const User = require('../models/User');
const Session = require('../models/Session');
const sanitize = require('../utils/sanitizer');
const {
  ExistingUserError,
  NotFoundError,
  WrongPasswordError
} = require('../errors');

class UserController {
  async signUp(name, email, password) {
    [name, email, password] = sanitize([name, email, password]);
    password = bcrypt.hashSync(password, 10);

    const [createdUser, hasBeenCreated] = await User.findOrCreate({
      where: { email },
      defaults: { name, password }
    });

    if (!hasBeenCreated) throw new ExistingUserError('User already exists');

    const newUser = createdUser.toJSON();
    return {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email
    };
  }

  async signIn(email, password) {
    const user = await this._findByEmail(email);
    if (!user) throw new NotFoundError('User not found');

    const passwordIsCorrect = bcrypt.compareSync(password, user.password);
    if (!passwordIsCorrect) throw new WrongPasswordError('Wrong password');

    const session = await Session.create({ userId: user.id });
    const token = jwt.sign({ id: session.id }, process.env.JWT_SECRET);

    return {
      name: user.name,
      email,
      token
    };
  }

  signOut(userId) {
    return Session.destroy({ where: { userId } });
  }

  _findByEmail(email) {
    return User.findOne({ where: { email } });
  }
}

module.exports = new UserController();