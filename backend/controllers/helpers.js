var { Op } = require('sequelize');
var models = require('../models'); // loads index.js
var { Category,Region,Candidate,Vote,Voter } = models;       // the model keyed by its name


//Get all Departmental Voters
exports.getDepartmentalVoters = async (req, res) => {
    let { region } = res.locals;

    let facultyId,departments,categoryCount,allVoterCount,totalVotes

    facultyId = region.id;

    departments = await Region.findAll({
        where: {
            belongsTo: facultyId
        }
    })

    if (departments.length == 0) {
        return this.getLevelVoters();
    }

    //Get the names of each department in a JSON object
    departments = departments.map(department => {
        return {name: department.name, numberVoted: 0, totalNumber: 0};
    })

    //Now to get the number who have actually voted
    categoryCount = await region.countCategories();

    allVoterCount = await region.countVotes()

    totalVotes = allVoterCount/categoryCount; //This gets the total votes for the entire faculty

    let allVotes = await region.getVotes();

    //Now to the nitty-gritty
    for (let i = 0; i < allVotes.length; i+=categoryCount) {
        let vote = allVotes[i];

        var voter = await vote.getVoter();

        //Increase the number who have voted for each department if the voter belongs to that department 
        departments.forEach(department => {
            (department.name == voter.department)?department.numberVoted += 1:department.numberVoted += 0;
        });
    }

    //Get the total number of eligible voters in that department
    departments.forEach(department => {
        department.totalNumber = await Voter.count({
            where: {
                department: department.name
            }
        })
    })

    return res.json({faculty: region.name, departments});
}

//Get all voters of levels
exports.getLevelVoters = async (req, res) => {
    let { region } = res.locals;

    return res.json({region: region.name, region});
}