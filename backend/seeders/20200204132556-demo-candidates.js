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

      for (let i = 0; i < 50; i++) {
          const seedData = {
              fullName: faker.name.findName(),
              imageUrl: faker.image.imageUrl(),
              alias: faker.name.firstName(),
              statusCode: faker.random.alphaNumeric(6),
              matric: faker.random.number({min:190000,max:215999}),
              twitter: `https://twitter.com/${faker.name.firstName().toLowerCase()}`,
              instagram: `https://instagram.com/${faker.name.firstName().toLowerCase()}`,
              phoneNumber: faker.phone.phoneNumberFormat(),
              status: faker.helpers.randomize(['pending','confirmed']),
              categoryId: faker.random.number({min:1,max:10}),
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
