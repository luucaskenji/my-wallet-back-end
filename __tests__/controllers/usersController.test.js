const usersController = require('../../src/controllers/usersController');
const User = require('../../src/models/User');
const { ExistingUserError } = require('../../src/errors');

jest.mock('../../src/utils/sanitizer', () => array => array)
jest.mock('../../src/models/User');
jest.mock('bcrypt', () => ({
  hashSync: (string, number) => string
}));

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

    User.findOrCreate.mockResolvedValueOnce([{}, true]);

    const testFn = usersController.signUp(name, email, password);

    expect(testFn).rejects.toThrow(ExistingUserError);
  });
});