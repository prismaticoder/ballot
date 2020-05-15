'use strict';
module.exports = (sequelize, DataTypes) => {
  const Admin = sequelize.define('Admin', {
    username: DataTypes.STRING,
    password: DataTypes.STRING,
    regionId: DataTypes.INTEGER
  }, {});
  Admin.associate = function(models) {
    // associations can be defined here
  };
  return Admin;
};