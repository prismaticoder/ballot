'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Candidates', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      firstName: {
        type: Sequelize.STRING
      },
      lastName: {
        type: Sequelize.STRING
      },
      alias: {
        type: Sequelize.STRING
      },
      statusCode: {
        type: Sequelize.STRING
      },
      matric: {
        type: Sequelize.STRING
      },
      level: {
        type: Sequelize.INTEGER
      },
      status: {
        type: Sequelize.ENUM(['pending','confirmed','denied'])
      },
      manifesto: {
        type: Sequelize.TEXT('long')
      },
      imageUrl: {
        type: Sequelize.STRING
      },
      categoryId: {
        type: Sequelize.INTEGER,
        references: { model: 'categories', key: 'id' }
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
    return queryInterface.dropTable('Candidates');
  }
};