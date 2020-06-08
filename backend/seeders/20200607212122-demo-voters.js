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

   for (let i = 0; i < 500; i++) {
       const seedData = {
           firstName: faker.name.firstName(),
           lastName: faker.name.lastName(),
           otherName: faker.name.firstName(),
           voterCode: faker.random.alphaNumeric(6),
           matric: faker.random.number({min:190000,max:215999}),
           faculty: faker.helpers.randomize(['Technology','Pharmacy','Medical Sciences','Psychology']),
           department: faker.helpers.randomize(['Technology','Pharmacy','Medical Sciences','Psychology']),
           hall: "Sultan Bello",
           accreditedAt: new Date("2020-06-07 18:42:18"),
           level: faker.random.arrayElement([100,200,300,400,500]),
           createdAt: new Date(),
           updatedAt: new Date()
       };
       newData.push(seedData);
   }

   return queryInterface.bulkInsert('Voters', newData);
  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkDelete('People', null, {});
    */

   return queryInterface.bulkDelete('Voters', null, {});
  }
};
