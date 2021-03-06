'use strict';

/**
 * Module dependencies
 */
var mongoose = require('mongoose'),
  validator = require('validator'),
  Schema = mongoose.Schema;

var validateLocalStrategyEmail = function (email) {
  return ((validator.isEmail(email, { require_tld: false })));
};
/**
 * Host Company Schema
 */
var HostCompanySchema = new Schema({
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  },
  companyName: {
    type: String,
    default: '',
    trim: true
  },
  establishedIn: {
    type: String
  },
  companyGSTIN: {
    type: String
  },
  noGSTIN: {
    type: Boolean,
    default: false
  },
  isLogoPresent: {
    type: Boolean,
    default: true
  },
  areSocialAccountsPresent: {
    type: Boolean,
    default: true
  },
  logoURL: {
    type: String,
    default: 'modules/hosts/client/companyLogo/default/logo.png'
  },
  toursite: {
    type: String,    
    index: {
      unique: true,
      sparse: true
    },
    lowercase: true,
    trim: true,
    default: ''
  },
  aboutHost: {
    type: String,
    default: '',
    trim: true
  },
  notificationEmail: {
    type: String,
    lowercase: true,
    trim: true,
    validate: [validateLocalStrategyEmail, 'Please fill a valid email address']
  },
  notificationMobile: {
    type: Number,
    default: ''
  },
  inquiryEmail: {
    type: String,
    lowercase: true,
    trim: true,
    validate: [validateLocalStrategyEmail, 'Please fill a valid email address']
  },
  inquiryMobile: {
    type: Number,
    default: ''
  },
  inquiryTime: {
    type: String,
    default: 'Anytime'
  },
  inquiryTimeRangeFrom: {
    type: String,
    default: '9 AM'
  },
  inquiryTimeRangeTo: {
    type: String,
    default: '6 PM'
  },
  blogLink: {
    type: String,
    default: '',
    trim: true
  },
  companyWebsite: {
    type: String,
    default: '',
    trim: true
  },
  defaultCurrency: {
    type: String,
    default: 'INR'
  },
  defaultLanguage: {
    type: String,
    default: 'English'
  },
  paymentOption: {
    type: Array,
    default: []
  },
  isToursiteInactive: {
    type: Boolean,
    default: false
  },
  memberSince: {
    type: String
  },
  hostType: {
    type: String,
    default: '',
    trim: true
  },
  tourgeckoFeeType: {
    type: String
  },
  tourgeckoFee: {
    type: Number
  },
  hostPackage: {
    type: String,
    default: '',
    trim: true
  },
  hostCompanyAddress: {
    type: Schema.Types.Mixed,
    default: {}
  },
  hostSocialAccounts: {
    type:Schema.Types.Mixed,
    default: {}
  },
  hostBankAccountDetails: {
    type:Schema.Types.Mixed,
    default: {}
  },
  passConvenienceFee: {
    type: Boolean,
    default: false
  },
  isAccountActive: {
    type: Boolean,
    default: false
  },
  isOwnerAccount: {
    type: Boolean,
    default: false
  },
  paymentGatewayBehavior: {
    type: String,
    default: 'internal'
  },
  paymentGateway: {
    type: String,
    default: ''
  },
  paymentActivated: {
    type: Boolean,
    default: false
  },
  addressProofURL: {
    type: String
  },
  panProofURL: {
    type: String
  },
  toursiteBanners: {
    type: Array,
    default: []
  },
  pinboardGoals: {
    type: Array,
    default: []
  },
  pinboardPins: {
    type: Array,
    default: []
  },
  newUserFirstLoginValidElements: {
    type: Array,
    default: []
  },
  themeColor: {
    type: String,
    default: '#FF9800'
  }
});

mongoose.model('HostCompany', HostCompanySchema);
