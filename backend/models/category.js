'use strict';
module.exports = (sequelize, DataTypes) => {
  const Category = sequelize.define('Category', {
    regionId: DataTypes.INTEGER,
    name: DataTypes.STRING
  }, {});
  Category.associate = function(models) {
    // associations can be defined here
    Category.hasMany(models.Candidate, {
      foreignKey: 'categoryId',
      onDelete: 'CASCADE'
  })
  };
  return Category;
};