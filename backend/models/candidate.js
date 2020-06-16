'use strict';
module.exports = (sequelize, DataTypes) => {
  const Candidate = sequelize.define('Candidate', {
    fullName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    alias: DataTypes.STRING,
    statusCode: DataTypes.STRING,
    matric: DataTypes.STRING,
    level: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    status: DataTypes.STRING,
    instagram: DataTypes.STRING,
    twitter: DataTypes.STRING,
    phoneNumber: {
      type: DataTypes.STRING,
      allowNull: false
    },
    manifesto: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    imageUrl: {
      type: DataTypes.STRING,
      allowNull: false
    },
    categoryId: DataTypes.INTEGER,
    refinedLink: {
      type: DataTypes.VIRTUAL,
      get() {
        let name = `${this.fullName}`

        let link = name.toLowerCase().split(' ')
        link.push(this.id)
        link = link.join('-')

        return link
      }
    }
  }, {});
  Candidate.associate = function(models) {
    // associations can be defined here
    Candidate.hasMany(models.Vote, {
      foreignKey: 'candidateId',
    })
    Candidate.belongsToMany(models.Voter, {
      through: 'votes',
      as: "voters"
    })
    Candidate.belongsTo(models.Category, {
      foreignKey: 'categoryId',
      as: 'category',
      onDelete: 'CASCADE'
    })
  };
  return Candidate;
};