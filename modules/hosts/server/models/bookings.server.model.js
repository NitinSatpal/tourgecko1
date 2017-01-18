'use strict';

/**
 * Module dependencies
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Booking Schema
 */
var BookingSchema = new Schema({
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  },
  hostOfThisBooking : {
    type: Schema.ObjectId,
    ref: 'User'
  },
  product: {
    type: Schema.ObjectId,
    ref: 'Product'
  },
  productSession: {
    type: Schema.ObjectId,
    ref: 'ProductSession'
  },
  isOpenDateTour: {
    type: Boolean
  },
  openDatedTourDepartureDate: {
    type: Date
  },
  bookingReference: {
    type: Number
  },
  bookingStatus: {
    type: String,
    default: 'Pending'
  },
  bookingComments: {
    type: String
  },
  providedGuestDetails: {},
  numberOfBookings: {
    type: Number,
    default: 1
  },
  numberOfAddons: {
    type: Number,
    default: 0
  },
  totalDiscount: {
    type: Number,
    default: 0
  },
  depositPaid: {
    type: Number,
    default: 0
  },
  totalAmountPaid: {
    type: Number,
    default: 0
  },
  totalAmountPaidForProduct: {
    type: Number,
    default: 0
  },
  totalAmountPaidForAddons: {
    type: Number,
    default: 0
  },
  paymentMode: {
    type: String,
    default: 'tourgecko Wallet',
    trim: true
  },
  created: {
    type: Date
  }
});

mongoose.model('Booking', BookingSchema);

