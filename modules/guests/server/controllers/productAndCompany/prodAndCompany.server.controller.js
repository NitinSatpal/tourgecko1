'use strict';

/**
 * Module dependencies
 */
var _ = require('lodash'),
  path = require('path'),
  mongoose = require('mongoose'),
  Product = mongoose.model('Product'),
  ProductSession = mongoose.model('ProductSession'),
  Company = mongoose.model('HostCompany'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

// Fetch Single product details
exports.fetchProductDetails = function (req, res) {
  Product.find({ '_id': req.params.productId, isPublished: true }).sort('-created').populate('hostCompany').exec(function (err, products) {
    if (err) {
      return res.status(404).send({
        message: 'No tour found with this id'
      });
    } else {
      if(products.length == 0)
        res.json(['No tour found with this id']);
      else
        res.json(products);
    }
  });
};

exports.fethcProductSessionsOfProductWithCount = function (req, res) {
  var skipIndexForSessions = req.params.skipIndex;
  ProductSession.count({product: req.params.productId}, function(error, count) {
    ProductSession.find({product: req.params.productId}).skip(skipIndexForSessions * 5).limit(5).sort('sessionDepartureDetails.startDate').exec(function (err, productSessions) {
      if (err) {
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      }
      res.json({sessions: productSessions, sessionCount: count});
    });
  });
};

exports.fethcProductSessionsOfProduct = function (req, res) {
  var skipIndexForSessions = req.params.skipIndex;
  ProductSession.find({product: req.params.productId}).skip(skipIndexForSessions * 5).limit(5).sort('sessionDepartureDetails.startDate').exec(function (err, productSessions) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    }
    res.json(productSessions);
  });
};


