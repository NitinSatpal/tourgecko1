var _ = require('lodash'),
  path = require('path'),
  mongoose = require('mongoose'),
  Product = mongoose.model('Product'),
  cron = require('cron'),
  async = require('async'),
  config = require(path.resolve('./config/config')),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));




var cronJob = cron.job('00 05 00 * * *', function() {
  async.waterfall([
    function (done) {
      var productSessions = [];
      Product.find({ 'isProductScheduled': true }).sort('-created').populate('').exec(function (err, products) {
        if (err) {
          console.log('error occurred in finding the required documents');
        } else {
          products.forEach(function(product) {
            var indexTracker = [];
            for (var index = 0; index < product.productScheduledDates.length; index++) {
              if (new Date().getTime() > new Date(product.productScheduledDates[index]).getTime())
                indexTracker.push(index);
            }
            for (var spliceIndex = indexTracker.length -1; spliceIndex >= 0; spliceIndex--)
              product.productScheduledDates.splice(indexTracker[spliceIndex],1);
            product.save();
          });
        }
      });
    }
  ], function (error, success) {
    if (error) {
      console.log('Something is wrong!');
    }
    console.log('Done!');
  });
  console.info('cron job completed');
}); 
cronJob.start();