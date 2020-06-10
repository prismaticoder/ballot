var sinon = require('sinon')
var models = require('../../models');
var { Setting } =  models;
var sendError = jest.fn()

const { onlyPreVoting, onlyVoting, onlyPostVoting } = require('../../controllers/middleware')

const votingState = [{startDate: new Date(Date.now() - (24*60*60*1000)), endDate: new Date(Date.now() + (48*60*60*1000))}]
const preVotingState = [{startDate: new Date(Date.now() + (24*60*60*1000)), endDate: new Date(Date.now() + (48*60*60*1000))}]
const postVotingState = [{startDate: new Date(Date.now() - (48*60*60*1000)), endDate: new Date(Date.now() - (24*60*60*1000))}]

const req = {}
const res = {locals: [], status(status) {return this}, send(msg) {return msg}}

describe('PreVoting test', () => {

    it('should return a 403 error when election is not in prevoting state', async () => {
        sinon.stub(Setting, 'findAll').returns(votingState)
        var next = jest.fn()
        await onlyPreVoting(req,res,next)

        expect(403)
        expect(next).not.toHaveBeenCalled()
    })
    it('should proceed with request when election is in prevoting state', async () => {
        sinon.stub(Setting, 'findAll').returns(preVotingState)
        var next = jest.fn()

        await onlyPreVoting(req,res,next)

        expect(next).toHaveBeenCalled()
    })
})

describe('Voting test', () => {
    it('should return a 403 error when election is not in voting state', async () => {
        sinon.stub(Setting, 'findAll').returns(preVotingState)
        var next = jest.fn()

        await onlyVoting(req,res,next)

        expect(403)
        expect(next).not.toHaveBeenCalled()
    })
    it('should proceed with request when election is in voting state', async () => {
        sinon.stub(Setting, 'findAll').returns(votingState)
        var next = jest.fn()
        await onlyVoting(req,res,next)
        
        expect(next).toHaveBeenCalled()
    })
})

describe('PostVoting test', () => {
    it('should return a 403 error when election is not in postvoting state', async () => {
        sinon.stub(Setting, 'findAll').returns(preVotingState)
        var next = jest.fn()
        await onlyPostVoting(req,res,next)

        expect(403)
        expect(next).not.toHaveBeenCalled()
    })
    it('should proceed with request when election is in postvoting state', async () => {
        sinon.stub(Setting, 'findAll').returns(postVotingState)
        var next = jest.fn()
        await onlyPostVoting(req,res,next)

        expect(next).toHaveBeenCalled()
    })
})

afterEach(() => {
    Setting.findAll.restore()
})