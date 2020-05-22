'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Voters', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      matric: {
        type: Sequelize.INTEGER
      },
      firstName: {
        type: Sequelize.STRING
      },
      lastName: {
        type: Sequelize.STRING
      },
      otherName: {
        type: Sequelize.STRING
      },
      faculty: {
        type: Sequelize.STRING
      },
      department: {
        type: Sequelize.STRING
      },
      hall: {
        type: Sequelize.STRING
      },
      voterCode: {
        defaultValue: null,
        type: Sequelize.STRING
      },
      accreditedAt: {
        defaultValue: null,
        type: Sequelize.DATE
      },
      level: {
        type: Sequelize.INTEGER
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Voters');
  }
};