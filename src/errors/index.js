const ExistingUserError = require('./ExistingUserError');
const DataNotInPatternError = require('./DataNotInPatternError');
const NotFoundError = require('./NotFoundError');
const WrongPasswordError = require('./WrongPasswordError');
const AuthError = require('./AuthError');

module.exports = {
  ExistingUserError,
  DataNotInPatternError,
  NotFoundError,
  WrongPasswordError,
  AuthError
};