'use strict';

var bcrypt = require('bcryptjs')

module.exports = {
  up: (queryInterface, Sequelize) => {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkInsert('People', [{
        name: 'John Doe',
        isBetaMember: false
      }], {});
    */

    let username = process.env.MAIN_USER
    let rawPassword = process.env.MAIN_PASS

    bcrypt.genSalt(10, function(err, salt) {
      bcrypt.hash(rawPassword, salt, function(err, hash) {
        if (!err) {
          return queryInterface.insert('Admins',{
            username,
            password: hash,
            createdAt: new Date(),
            updatedAt: new Date()
          })
        }

        else {
          throw err
        }
      });
    });
  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkDelete('People', null, {});
    */

   return queryInterface.bulkDelete('Admins', null, {});
  }
};
