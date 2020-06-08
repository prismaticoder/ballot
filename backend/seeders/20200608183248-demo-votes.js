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
  var categoryArray = [1,2,3,4,5,6,7,10,11]
  var candidateArray = {1:[1,36],2:[10,34,50,52],3:[24,45,47],4:[8,19,21],5:[18,20,56],6:[3,5,12,27,31,32,39],7:[40],10:[4,35,38,41],11:[58]}
   var newData = [];

   for (let i = 854; i < 1353; i++) {
     for (let j = 0; j < categoryArray.length; j++) {
       const seedData = {
        voterId: i,
        categoryId: categoryArray[j],
        candidateId: faker.helpers.randomize(candidateArray[categoryArray[j]]),
        createdAt: new Date("2020-06-07 18:42:18"),
        updatedAt: new Date("2020-06-07 18:42:18")
      };
      newData.push(seedData);
     }
   }

   return queryInterface.bulkInsert('Votes', newData);
  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkDelete('People', null, {});
    */

   return queryInterface.bulkDelete('Votes', null, {});
  }
};
