const supertest = require('supertest')
const server = require('../../app')
var sinon = require('sinon')
var Sequelize = require('sequelize')
var models = require('../../models');
var { Setting, sequelize, Candidate } =  models;
const votingState = [{startDate: new Date(Date.now() - (24*60*60*1000)), endDate: new Date(Date.now() + (48*60*60*1000))}]
const preVotingState = [{startDate: new Date(Date.now() + (24*60*60*1000)), endDate: new Date(Date.now() + (48*60*60*1000))}]
const postVotingState = [{startDate: new Date(Date.now() - (48*60*60*1000)), endDate: new Date(Date.now() - (24*60*60*1000))}]

const app = () => {return supertest(server)}

describe('All Prevoting endpoints', () => {

    beforeAll(() => {
        sinon.stub(Setting, 'findAll').returns(preVotingState)
    })

    describe('Accreditation Test', () => {

        it('should not accredit a non existent voter', async () => {
            const response = await app().post('/v1/accredit').send({
                matric: 132444,
                lastName: 'lastName'
            })
    
            expect(response.status).toBe(404)
            expect(response.body.error).toBe("Student not found") 
        })
        it('should not accredit an already accredited voter', async () => {
            const response = await app().post('/v1/accredit').send({
                matric: 123456,
                lastName: 'Salam'
            })
    
            expect(response.status).toBe(403)
            expect(response.body.error).toBe("You have already been accredited and given a voter's number")        
        })
        it('should not accredit a voter if the person already has a voter code', async () => {
            const response = await app().post('/v1/accredit').send({
                matric: 101010,
                lastName: 'Testlast'
            })
    
            expect(response.status).toBe(403)
            expect(response.body.error).toBe("You have been sent your voter's number but are yet to confirm accreditation. Please click the confirmation link in the mail sent to you.")        
        })

    })

    describe('Candidates Application Endpoint', () => {

        //remove test candidate before each function
        beforeEach(async () => {
            await Candidate.destroy({
                where: {
                    matric: 205629
                }
            })
        })

        it('should enter a candidate\'s application for a post', async () => {
            const response = await app().post('/v1/candidates/apply').send({
                firstName: 'Hiram',
                lastName: 'Sipes',
                alias: 'Tunmise',
                manifesto: 'This is a test manifesto for a test candidate',
                instagram: 'https://instagram.com/hiram',
                twitter: 'https://twitter.com/hiram',
                phoneNumber: '07022992299',
                imageUrl: 'myimage.com',
                level: '100',
                matric: 205629,
                categoryId: 10
            })

            expect(response.status).toBe(201)
        })

        it('should refuse an application if said candidate has already applied', async () => {
            const response = await app().post('/v1/candidates/apply').send({
                firstName: 'Ifejesu',
                lastName: 'Salam',
                alias: 'Prismatic',
                manifesto: 'This is a test manifesto for a test candidate',
                instagram: 'https://instagram.com/hiram',
                twitter: 'https://twitter.com/hiram',
                phoneNumber: '07022992299',
                imageUrl: 'myimage.com',
                level: '100',
                matric: 123456,
                categoryId: 10
            })

            expect(response.status).toBe(403)
            expect(response.body.error).toBe("You have an existing application already!")            
        })

        it('should refuse an application if said candidate has not been accredited', async () => {
            const response = await app().post('/v1/candidates/apply').send({
                firstName: 'Jesutomiwa',
                lastName: 'Salam',
                alias: 'Prismatic',
                manifesto: 'This is a test manifesto for a test candidate',
                instagram: 'https://instagram.com/hiram',
                twitter: 'https://twitter.com/hiram',
                phoneNumber: '07022992299',
                imageUrl: 'myimage.com',
                level: '100',
                matric: 192886,
                categoryId: 10
            })

            expect(response.status).toBe(403)
            expect(response.body.error).toBe("You have to be accredited as a voter to be able to apply for candidacy")            
        })

        it('should refuse an application if said candidate does not exist', async () => {
            const response = await app().post('/v1/candidates/apply').send({
                firstName: 'Jesutomiwa',
                lastName: 'Salam',
                alias: 'Prismatic',
                manifesto: 'This is a test manifesto for a test candidate',
                instagram: 'https://instagram.com/hiram',
                twitter: 'https://twitter.com/hiram',
                phoneNumber: '07022992299',
                imageUrl: 'myimage.com',
                level: '100',
                matric: 132444,
                categoryId: 10
            })

            expect(response.status).toBe(404)
            expect(response.body.error).toBe(`Student not found for this ${process.env.APP_TYPE.toLowerCase()}`)            
        })

        it('should refuse an application if said candidate\'s level does not fall within criteria', async () => {
            const response = await app().post('/v1/candidates/apply').send({
                firstName: 'Hiram',
                lastName: 'Sipes',
                alias: 'Tunmise',
                manifesto: 'This is a test manifesto for a test candidate',
                instagram: 'https://instagram.com/hiram',
                twitter: 'https://twitter.com/hiram',
                phoneNumber: '07022992299',
                imageUrl: 'myimage.com',
                level: '100',
                matric: 205629,
                categoryId: 1
            })

            expect(response.status).toBe(403)
            expect(response.body.error).toBe("Your current level (100) does not fall within the category of levels required to run for this post")            
        })
    })

    afterAll(() => {
        Setting.findAll.restore()
    })
    
})


afterAll(async done => {
    // Closing the DB connection allows Jest to exit successfully.
    sequelize.close();
    done();
})