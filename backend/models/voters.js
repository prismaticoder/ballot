'use strict';
module.exports = (sequelize, DataTypes) => {
  const Voter = sequelize.define('Voter', {
    matric: DataTypes.INTEGER,
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    otherName: DataTypes.STRING,
    faculty: DataTypes.STRING,
    department: DataTypes.STRING,
    hall: DataTypes.STRING,
    accreditedAt: DataTypes.DATE,
    level: DataTypes.ENUM(100,200,300,400,500,600),
    // voterNumber: {
    //   type: DataTypes.VIRTUAL,
    //   get() {
    //     return `${this.jambReg.slice(0,4)}${this.matric.toString().slice(3)}`
    //   }
    // }
  }, {});
  Voter.associate = function(models) {
    Voter.hasMany(models.Vote, {
      foreignKey: 'voterId',
  })
    // associations can be defined here
  };
  return Voter;
};