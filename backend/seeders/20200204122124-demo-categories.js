'use strict';

var faker = require('faker');

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
   var newData = [];

   for (let i = 0; i < 600; i++) {
       const seedData = {
           name: faker.name.jobTitle(),
           regionId: faker.random.number({min:1,max:93}),
           createdAt: new Date(),
           updatedAt: new Date()
       };
       newData.push(seedData);
   }

   return queryInterface.bulkInsert('Categories', newData);
  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkDelete('People', null, {});
    */
   return queryInterface.bulkDelete('Categories', null, {});
  }
};
