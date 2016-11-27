'use strict';

/**
 * Module dependencies
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Tour Schema
 */
var ProductSessionSchema = new Schema({
  sessionDate: {
    type: Date
  },
  product: {
    type: Schema.ObjectId,
    unique: true,
    ref: 'Product'
  }
});

// TourSchema.index( { "expireAt": 1 }, { expireAfterSeconds: 0 } );
mongoose.model('ProductSession', ProductSessionSchema);