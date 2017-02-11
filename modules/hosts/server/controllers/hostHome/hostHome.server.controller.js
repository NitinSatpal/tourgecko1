'use strict';

/**
 * Module dependencies
 */
var path = require('path'),
  mongoose = require('mongoose'),  
  Pinboard = mongoose.model('Pinboard'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

// Fetch categorized bookings
exports.fetchPinboardData = function (req, res) {
  Pinboard.find({ $or: [{to: null}, {to: req.user._id}], dismissedBy: {$not: { $elemMatch: {$eq: req.user._id}}} }).sort('-created').exec(function (err, pinboardData) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    }
    res.json(pinboardData);
  });
};

// Set dissmiss messages ids

exports.setDismissedMessageIds = function (req, res) {
  var conditions = { _id: {$in : req.body} },
      update = { $push: { dismissedBy:  req.user._id}},
      options = { multi: true };

  Pinboard.update(conditions, update, options, callback);

  function callback (err, numAffected) {
    // numAffected is the number of updated documents
  }
};