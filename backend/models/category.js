'use strict';
module.exports = (sequelize, DataTypes) => {
  const Category = sequelize.define('Category', {
    name: DataTypes.STRING,
    minLevel: DataTypes.ENUM(100,200,300,400,500,600),
    maxLevel: DataTypes.ENUM(200,300,400,500,600)
  }, {});
  Category.associate = function(models) {
    // associations can be defined here
    Category.hasMany(models.Candidate, {
      foreignKey: 'categoryId',
      as: 'candidates',
      onDelete: 'CASCADE'
    })
    Category.hasMany(models.Vote, {
      foreignKey: 'categoryId',
    })
  };

  return Category;
};