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

  TourPreviewController.$inject = ['$scope', '$state', '$window', '$http', '$location', 'Authentication'];

  function TourPreviewController($scope, $state, $window, $http, $location, Authentication) {
    var vm = this;
    vm.authentication = Authentication;
    console.log()
    var productId = $location.path().split('/')[4];
    vm.productDetails;

    $http.get('/api/host/product/' + productId).success(function (response) {
      vm.productDetails = response[0];
      vm.companyDetails = response[0].hostCompany;
      if(response[0].productPictureURLs.length != 0)
        vm.productMainImageURL = response[0].productPictureURLs[0].split('./')[1];
    }).error(function (response) {
      vm.error = response.message;
    });

    vm.getHtmlTrustedData = function(htmlData){
      return $sce.trustAsHtml(htmlData);
    };

    vm.getMinimumPricing = function (productDetails) {

      if(productDetails && productDetails.productAdvertisedprice !== undefined)
        return vm.productDetails.productAdvertisedprice;
      else {
        if (productDetails)
          return findMinimum(productDetails.productPricingOptions);
      }
    }

    function findMinimum (pricingOptions) {
      var minimumTillNow = Number.POSITIVE_INFINITY;
      vm.priceTobeShown = -1;
      for (var index = 0; index < pricingOptions.length; index ++) {
        if (pricingOptions[index].price < minimumTillNow)
          minimumTillNow = pricingOptions[index].price;
        if(vm.priceTobeShown == -1) {
          if (pricingOptions[index].pricingType == 'Everyone' || pricingOptions[index].pricingType == 'Adult')
            vm.priceTobeShown = pricingOptions[index].price;
        }
      }
      if (minimumTillNow == 'Infinity')
        minimumTillNow = '';
      if (vm.priceTobeShown == -1)
        vm.priceTobeShown = minimumTillNow;

      return minimumTillNow;
    }
  }
}());