'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('sessions', 'token');
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('sessions', 'token', {
      type: Sequelize.STRING,
      allowNull: false
    });
  }
};
