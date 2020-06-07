'use strict';
module.exports = (sequelize, DataTypes) => {
  const Vote = sequelize.define('Vote', {
    voterId: DataTypes.INTEGER,
    candidateId: DataTypes.INTEGER,
    categoryId: DataTypes.INTEGER
  }, {});
  Vote.associate = function(models) {
    Vote.belongsTo(models.Voter, {
      foreignKey: 'voterId',
  })
  Vote.belongsTo(models.Category, {
    foreignKey: 'categoryId',
  })
    // associations can be defined here
  };
  return Vote;
};