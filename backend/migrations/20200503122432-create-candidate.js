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
      fullName: {
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
      instagram: {
        type: Sequelize.STRING,
        defaultValue: null
      },
      twitter: {
        type: Sequelize.STRING,
        defaultValue: null
      },
      phoneNumber: {
        type: Sequelize.STRING
      },
      manifesto: {
        type: Sequelize.TEXT('long')
      },
      imageUrl: {
        type: Sequelize.STRING
      },
      categoryId: {
        type: Sequelize.INTEGER,
        references: { model: 'Categories', key: 'id' },
        onDelete: 'CASCADE',
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