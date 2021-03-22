const Finance = require('../models/Finance');
const User = require('../models/User');
const { NotFoundError } = require('../errors');
const sanitize = require('../utils/sanitizer');

class FinancesController {
  async getOperations(userId) {
    const user = await User.findByPk(userId);
    if (!user) throw new NotFoundError('User not found');

    return Finance.findAll({ where: { userId } });
  }

  async postOperation(userId, newOperation) {
    const user = await User.findByPk(userId);
    if (!user) throw new NotFoundError('User not found');

    let { value, description, type } = newOperation;
    [value, description, type] = sanitize([value, description, type]);

    value = value.replace(',', '.');
    value = (type === 'Income') ? parseFloat(value) : parseFloat(value) * (-1);

    return Finance.create({ userId, type, value, description });
  }
}

module.exports = new FinancesController();