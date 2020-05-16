'use strict';
module.exports = (sequelize, DataTypes) => {
  const Candidate = sequelize.define('Candidate', {
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    alias: DataTypes.STRING,
    statusCode: DataTypes.STRING,
    matric: DataTypes.STRING,
    level: DataTypes.INTEGER,
    status: DataTypes.STRING,
    manifesto: DataTypes.TEXT,
    image: DataTypes.STRING,
    categoryId: DataTypes.INTEGER,
    fullName: {
      type: DataTypes.VIRTUAL,
      get() {
        if (this.alias !== null) {
          return `${this.firstName} "${this.alias}" ${this.lastName}`
        }
        else {
          return `${this.firstName} ${this.lastName}`
        }
      }
    }
  }, {});
  Candidate.associate = function(models) {
    // associations can be defined here
    Candidate.hasMany(models.Vote, {
      foreignKey: 'candidateId',
    })
    Candidate.belongsTo(models.Category, {
      foreignKey: 'categoryId',
    })
  };
  return Candidate;
};