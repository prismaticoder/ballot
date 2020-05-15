'use strict';
module.exports = (sequelize, DataTypes) => {
  const Region = sequelize.define('Region', {
    id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
    },
    name: DataTypes.STRING,
    slug: DataTypes.STRING,
    type: DataTypes.ENUM(['department','faculty','hall'])
  }, {timestamps: false});
  Region.associate = function(models) {
    // associations can be defined here
    Region.hasMany(models.Candidate, {
        foreignKey: 'regionId',
    })
    Region.hasMany(models.Category, {
        foreignKey: 'regionId',
    })
    Region.hasOne(models.Setting, {
        foreignKey: 'regionId'
    })
    Region.hasMany(models.Vote, {
        foreignKey: 'regionId'
    })
    Region.hasOne(models.Admin, {
        foreignKey: 'regionId'
    })
  };
  return Region;
};