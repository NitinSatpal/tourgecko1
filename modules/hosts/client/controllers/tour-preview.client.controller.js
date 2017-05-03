(function () {
  'use strict';

  angular
    .module('hosts')
    .controller('TourPreviewController', TourPreviewController)
    .filter('htmlData', function($sce) {
        return function(val) {
          return $sce.trustAsHtml(val);
        };
    });

  TourPreviewController.$inject = ['$scope', '$state', '$stateParams', '$window', '$http', '$location', 'Authentication', 'ProductDataShareService'];

  function TourPreviewController($scope, $state, $stateParams, $window, $http, $location, Authentication, ProductDataShareService) {
    var vm = this;
    vm.authentication = Authentication;
    var productId = $location.path().split('/')[4];
    vm.productDetails;
    vm.productImageURLs = [];

    var weekdays = ['Sunday' , 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  
    var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];

    if (productId) {
      $http.get('/api/host/product/' + productId).success(function (response) {
        vm.productDetails = response[0];
        vm.companyDetails = response[0].hostCompany;
        vm.productImageURLs = response[0].productPictureURLs;
        $('#loadingDivTourPreview').css('display', 'none');
        $('#tourgeckoBody').removeClass('waitCursor');
      }).error(function (response) {
        vm.error = response.message;
        $('#loadingDivTourPreview').css('display', 'none');
        $('#tourgeckoBody').removeClass('waitCursor');
      });
    } else {
      $http.get('/api/host/company').success(function (response) {
        vm.companyDetails = response[0];
        $('#loadingDivTourPreview').css('display', 'none');
        $('#tourgeckoBody').removeClass('waitCursor');
      }).error(function (response) {
        vm.error = response.message;
        $('#loadingDivTourPreview').css('display', 'none');
        $('#tourgeckoBody').removeClass('waitCursor');
      });
      vm.productDetails = JSON.parse($window.localStorage.getItem('productData'));
      vm.productImageURLs = vm.productDetails.productPictureURLs;
    }

    vm.resetLocalStorage = function () {
      $window.localStorage.setItem('productData', '');
    }
    

    vm.getHtmlTrustedData = function(htmlData){
      return $sce.trustAsHtml(htmlData);
    };

    vm.getMinimumPricing = function (productDetails) {
      if (productDetails)
        return findMinimum(productDetails);
      else {
        vm.priceTobeShown = '';
        return '';
      }
    }

    function findMinimum (productDetails) {
      vm.minimumTillNow = Number.POSITIVE_INFINITY;
      vm.priceTobeShown = -1;
      
      if(productDetails.productPricingOptions) {
        for (var index = 0; index < productDetails.productPricingOptions.length; index ++) {
          if (productDetails.productPricingOptions[index].price < vm.minimumTillNow)
            vm.minimumTillNow =  productDetails.productPricingOptions[index].price;
          
          if (productDetails.productPricingOptions[index].pricingType == 'Everyone' || productDetails.productPricingOptions[index].pricingType == 'Adult')
            vm.priceTobeShown = productDetails.productPricingOptions[index].price;
        }
      }
      if (vm.minimumTillNow == 'Infinity')
        vm.minimumTillNow = '';
      if (vm.priceTobeShown == -1)
        vm.priceTobeShown = vm.minimumTillNow;

      if(productDetails.productAdvertisedprice !== undefined)
        return vm.productDetails.productAdvertisedprice;
      else
        return vm.minimumTillNow;      
    }

    vm.getDepartureDates = function (isoDate) {
      var date = new Date (isoDate);
      // date = new Date(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(),  date.getUTCHours(), date.getUTCMinutes(), date.getUTCSeconds());
      var displayDate = weekdays[date.getDay()] + ', ' + date.getDate() + ' ' + months[date.getMonth()] + ' ' + date.getFullYear();

      return displayDate;
    }

    vm.getDynamicCSSForStripedTable = function (index) {
      var oddCSS = {
        "background-color" : "#fff",
      };
      var evenCSS = {
        "background-color" : "#eee",
      };
      if (index % 2 == 1)
        return oddCSS;
      else
        return evenCSS;
    }

    vm.setMarginDynamically = function () {
      if ($window.innerWidth <= 767) {
        var cssObject = {
          "margin-left": "0%",
          "margin-right": "3%"
        }
        return cssObject;
      } else {
        console.log('coming here');
        var cssObject = {
          "margin-left": "15%",
          "margin-right": "15%"
        }
        return cssObject;
      }
    }

    vm.getLoaderPositionForPreview = function () {
      var leftMargin = ($window.innerWidth - 34.297) / 2;
      var topMargin = ($window.innerHeight - 40) / 2;
      var cssObject = {
        "left" : leftMargin,
        "top" : topMargin,
        "color": '#ff9800'
      }
      return cssObject;
    }
  }
}());
