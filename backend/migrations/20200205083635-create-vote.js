'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Votes', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      voterId: {
        type: Sequelize.INTEGER,
        references: { model: 'voters', key: 'id' }
      },
      regionId: {
        type: Sequelize.INTEGER,
        references: { model: 'regions', key: 'id' }
      },
      candidateId: {
        type: Sequelize.INTEGER,
        references: { model: 'candidates', key: 'id' }
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
    return queryInterface.dropTable('Votes');
  }
};