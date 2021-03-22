const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../../src/models/User');
const Session = require('../../src/models/Session');
const Finance = require('../../src/models/Finance');

const cleanDB = async () => {
  const testUser = await User.findOne({ where: { name: 'Test' } });

  if (testUser) {
    await Session.destroy({ where: { userId: testUser.id } });
    await Finance.destroy({ where: { userId: testUser.id } });
    await User.destroy({ where: { name: 'Test' } });
  }
};

const createUserAndSession = async () => {
  const signUpBody = {
    name: 'Test',
    email: 'automated-test@gmail.com',
    password: bcrypt.hashSync('123456', 10)
  };

  const testUser = await User.create(signUpBody);

  const testSession = await Session.create({ userId: testUser.id });
  const token = jwt.sign({ id: testSession.id }, process.env.JWT_SECRET);

  const { id, name, email, password } = testUser;
  return {
    id,
    name,
    email,
    password: '123456',
    hashPassword: password,
    session: {
      id: testSession.id,
      token
    }
  }
};

const getUserSession = id => {
  return Session.findByPk(id);
}

module.exports = { cleanDB, createUserAndSession, getUserSession };