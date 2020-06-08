'use strict';
module.exports = (sequelize, DataTypes) => {
  const Setting = sequelize.define('Setting', {
    startDate: DataTypes.DATE,
    endDate: DataTypes.DATE,
    isApproved: DataTypes.BOOLEAN
  }, {});
  Setting.associate = function(models) {
    // associations can be defined here
  };
  return Setting;
};