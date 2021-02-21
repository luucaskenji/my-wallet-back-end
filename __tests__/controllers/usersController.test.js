const usersController = require('../../src/controllers/usersController');
const User = require('../../src/models/User');
const Session = require('../../src/models/Session');
const { ExistingUserError, NotFoundError, WrongPasswordError } = require('../../src/errors');

jest.mock('../../src/utils/sanitizer', () => array => array);
jest.mock('../../src/models/User');
jest.mock('../../src/models/Session');

jest.mock('bcrypt', () => ({
  hashSync: (string, number) => string,
  compareSync: (password, passwordHash) => password === passwordHash
}));

jest.mock('jsonwebtoken', () => ({
  sign: (object, string) => '123'
}));

jest.spyOn(usersController, '_findByEmail');

describe('method signUp', () => {
  it('should return user data if passed email is not conflicting', async () => {
    const name = 'Test';
    const email = 'test@gmail.com';
    const password = '123456';

    User.findOrCreate.mockResolvedValueOnce([
      { toJSON: () => ({ id: 1, name, email }) },
      true
    ]);

    const response = await usersController.signUp(name, email, password);
    expect(response).toMatchObject({
      id: 1,
      name,
      email
    });
  });

  it('should throw ExistingUserError if passed email already exists in database', async () => {
    const name = 'Test';
    const email = 'test@gmail.com';
    const password = '123456';

    User.findOrCreate.mockResolvedValueOnce([{}, false]);

    const testFn = usersController.signUp(name, email, password);

    expect(testFn).rejects.toThrow(ExistingUserError);
  });
});

describe('method signIn', () => {
  it('should create session and return its data if user exists and correct password is sent', async () => {
    const email = 'test@gmail.com';
    const password = '1234';

    usersController._findByEmail.mockResolvedValueOnce({ id: 1, name: 'Test', password: '1234' });
    Session.create.mockResolvedValueOnce({ id: 2 });

    const response = await usersController.signIn(email, password);

    expect(Session.create).toHaveBeenCalledWith({ userId: 1 });
    expect(response).toMatchObject({
      name: 'Test',
      email,
      token: '123'
    });
  });

  it('should throw NotFoundError if invalid email is sent', async () => {
    const email = 'test@gmail.com';
    const password = '1234';

    usersController._findByEmail.mockResolvedValueOnce(null);

    const testFn = usersController.signIn(email, password);

    expect(testFn).rejects.toThrow(NotFoundError);
  });

  it('should throw WrongPasswordError if wrong password is sent', async () => {
    const email = 'test@gmail.com';
    const password = 'wrongPassword';

    usersController._findByEmail.mockResolvedValueOnce({ id: 1, name: 'Test', password: '1234' });

    const testFn = usersController.signIn(email, password);

    expect(testFn).rejects.toThrow(WrongPasswordError);
  });
});