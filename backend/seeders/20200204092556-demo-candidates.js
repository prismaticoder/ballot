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

      for (let i = 0; i < 1001; i++) {
          const seedData = {
              firstName: faker.name.firstName(),
              lastName: faker.name.lastName(),
              image: faker.image.imageUrl(),
              alias: faker.name.firstName(),
              statusCode: faker.random.alphaNumeric(6),
              matric: faker.random.number({min:190000,max:215999}),
              status: faker.helpers.randomize(['pending','confirmed']),
              categoryId: faker.random.number({min:1,max:602}),
              regionId: faker.random.number({min:1,max:93}),
              manifesto: faker.lorem.paragraph(),
              level: faker.random.arrayElement([100,200,300,400,500]),
              createdAt: new Date(),
              updatedAt: new Date()
          };
          newData.push(seedData);
      }

      return queryInterface.bulkInsert('Candidates', newData);
  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkDelete('People', null, {});
    */
   return queryInterface.bulkDelete('Candidates', null, {});
  }
};
