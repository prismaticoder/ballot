'use strict';
module.exports = (sequelize, DataTypes) => {
  const Candidate = sequelize.define('Candidate', {
    firstName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    lastName: {
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
    fullName: {
      type: DataTypes.VIRTUAL,
      get() {
        let lastname = this.lastName.split('-');
        let firstname = this.firstName.split('-');
        lastname.forEach((name,index) => {
          lastname.splice(index,1,name[0].toUpperCase() + name.slice(1).toLowerCase())
        })
        firstname.forEach((name,index) => {
          firstname.splice(index,1,name[0].toUpperCase() + name.slice(1).toLowerCase())
        })
        lastname = lastname.join('-');
        firstname = firstname.join('-')

        return `${firstname} ${lastname}`
      }
    },
    refinedLink: {
      type: DataTypes.VIRTUAL,
      get() {
        let name = `${this.firstName} ${this.lastName}`

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
    Candidate.belongsTo(models.Category, {
      foreignKey: 'categoryId',
      as: 'category',
      onDelete: 'CASCADE'
    })
  };
  return Candidate;
};