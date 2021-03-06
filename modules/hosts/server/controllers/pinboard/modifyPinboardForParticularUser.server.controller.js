'use strict';

/**
 * Module dependencies
 */
var path = require('path'),
  mongoose = require('mongoose'),  
  Company = mongoose.model('HostCompany'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));


// fetch pinboard goals
exports.modifyPinboardGoalsForThisUser = function (uniqueGoalName, uniquePinName, hostCompanyId) {
  Company.findOne({_id: hostCompanyId}).exec(function (err, company) {
    var goalsOfThisUser = company.pinboardGoals;
    var goalIndexForAccountSetupAndLaunchGoal;
    for (var goalIndex = 0; goalIndex < goalsOfThisUser.length; goalIndex ++) {
      if (goalsOfThisUser[goalIndex].uniqueGoalName == uniqueGoalName) {
        goalIndexForAccountSetupAndLaunchGoal = goalIndex;
        for (var pinIndex = 0; pinIndex < goalsOfThisUser[goalIndex].pinsForthisGoal.length; pinIndex++) {
          if (goalsOfThisUser[goalIndex].pinsForthisGoal[pinIndex].uniquePinName == uniquePinName) {
            if (!goalsOfThisUser[goalIndex].pinsForthisGoal[pinIndex].isPinCompleted) {
              goalsOfThisUser[goalIndex].pinsForthisGoal[pinIndex].isPinCompleted = true;
              goalsOfThisUser[goalIndex].completedPinsCounter = goalsOfThisUser[goalIndex].completedPinsCounter + 1;
            }
            if (goalsOfThisUser[goalIndex].completedPinsCounter == goalsOfThisUser[goalIndex].pinsForthisGoal.length)
              goalsOfThisUser[goalIndex].isGoalCompleted = true;
          }
        }
      }
    }
    company.pinboardGoals = goalsOfThisUser;
    if(uniqueGoalName == 'completionOfAccountSetupAndLaunch' && company.pinboardGoals[goalIndexForAccountSetupAndLaunchGoal].isGoalCompleted)
      company.newUserFirstLoginValidElements.push('firstLoginWelcomeMessage');
    company.markModified('pinboardGoals');
    company.save(function (companySaveErr) {
      if (companySaveErr) {
      }
    });
  });
};