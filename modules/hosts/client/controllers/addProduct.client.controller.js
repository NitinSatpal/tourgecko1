(function () {
  'use strict';

  angular
    .module('hosts', [])
    .controller('AddProductController', AddProductController)
    .filter('htmlData', function($sce) {
        return function(val) {
            return $sce.trustAsHtml(val);
        };
    });

  AddProductController.$inject = ['$scope', '$state', '$stateParams', '$http', '$timeout', '$window', 'Upload'];

  function AddProductController($scope, $state, $stateParams, $http, $timeout, $window, Upload) {
    var vm = this;
    vm.error = null;
    vm.form = {};
    vm.helpVisible = true;
    vm.isAddonAvailable = false;
    vm.isDepositApplicable = false;
    vm.isAvailableThroughoutTheYear = true;
    vm.durationType = 'days';
    vm.productGrade = 'Easy';
    vm.productAvailabilityType = 'Open Date';
    vm.productTimeSlotsAvailability = 'No Time Required';
    vm.timeslots = [];
    vm.productSeatsLimitType = 'limited';
    vm.pricingOptions = ['Everyone'];
    vm.imageFileSelected = false;
    vm.mapFileSelected = false;
    vm.showProgressbar = false;
    vm.addMorePhotos = false;
    vm.productPictureURLs = [];
    vm.productMapURLs = [];
    vm.availableMonths = [];
    vm.itineraries = [];
    vm.dayCounter = 1;
    vm.showCreatedItinerary = false;
    vm.showSaveButtonForItineraries = false;
    vm.showEditItineraryElements = false;
    vm.productDuration;
    vm.heading = '';
    vm.productType = '';
    vm.isFixedTourTimeSlotAvailable = false;

    var productId = $window.localStorage.getItem('productEditId');
    if(productId != 'noProductId') {
        $http.get('/api/host/product/'+ $window.localStorage.getItem('productEditId')).success(function (response) {
            vm.tour = response[0];
            vm.itineraries = vm.tour.productItineraryDescription;
        });
    }

    vm.pricingParams = {
      Params: [{
        price: 0,
        description: '',
        minGroupSize: 0,
        maxGroupSize: 0,
        groupOption: 'Per Group',
        customLabel: '',
        seatsUsed: 0
      }]
    };

    vm.addonParams = {
      params: [{
        name: '',
        price: '',
        applyAs: 'Per Booking',
        description: ''
      }]
    };

    vm.timeslots = [''];

    vm.fixedProductSchedule = {
      params: [{
        startDate: '',
        startTime: '',
        repeatBehavior: 'Do not repeat',
        repeatTillDate: '',
        repeatOnDays: []
      }]
    };

    vm.addPricingOption = function(index) {
      var isValid = validatePricingOption(index);
      if (isValid)
        vm.pricingOptions.push('Everyone');
    };

    function validatePricingOption (index) {
      var indexTracker;
      var lastGroupOption;
      if(vm.pricingOptions[index] == 'Group') {
        if(vm.pricingParams[index].Params.minGroupSize != 0 && vm.pricingParams[index].Params.maxGroupSize != 0 && vm.pricingParams[index].Params.minGroupSize >= vm.pricingParams[index].Params.maxGroupSize) {
          alert('group max size should be greater than group min size');
          return false;
        }
        if (index > 0) {
          for (indexTracker = index-1; index >= 0; index --) {
            if (vm.pricingOptions[indexTracker] == 'Group') {
              lastGroupOption = vm.pricingParams[indexTracker].Params;
              break;
            }
          }
          if (lastGroupOption !== undefined && lastGroupOption.maxGroupSize > vm.pricingParams[index].Params.minGroupSize) {
            alert('Max size option of previous group should be less than the min size option of current group');
            return false;
          }
        }
      }
      return true;
    };

    vm.removePricingOption = function(index) {
      vm.pricingOptions.splice(index, 1);
    }

    vm.addMoreAddons = function() {
      vm.addonParams.params.push({
        name: '',
        price: '',
        applyAs: 'Per Booking',
        description: ''
      });
    };

    vm.removeAddon = function(index) {
      if (vm.addonParams.params.length === 1)
        vm.isAddonAvailable = false;
      else
        vm.addonParams.params.splice(index, 1);
    };

    vm.addMoreTimeslots = function() {
      vm.timeslots.push('');
    };

    vm.removeTimeslots = function(index) {
      vm.timeslots.splice(index, 1);
    };

    vm.createItinerary = function(done) {
      vm.itineraries.push({'title': vm.heading, 'description': CKEDITOR.instances.tourItinerary.getData(), 'day': vm.dayCounter});
      vm.dayCounter++;
      vm.showCreatedItinerary = true;
      CKEDITOR.instances.tourItinerary.setData('');
      vm.heading = '';
    }

    var indexSaved;
    vm.editItinerary = function(index) {
      vm.editIndex = index;
      indexSaved = index;
      vm.showEditItineraryElements = true;
      vm.editHeading = vm.itineraries[index].title;
      var idOfEditor = 'editItinerary'+index;

      CKEDITOR.replace(idOfEditor, {
          toolbarGroups: [
            {name: 'basicstyles', groups: 'basicstyles'},
            {name: 'paragraph',   groups: [ 'list', 'indent', 'align']}
          ]
      });

      
      CKEDITOR.instances[idOfEditor].setData(vm.itineraries[index].description);
    }

    vm.saveEditedItinerary = function(index) {
      var idOfEditor = 'editItinerary'+index;
      vm.itineraries[indexSaved].title = vm.editHeading;
      vm.itineraries[indexSaved].description = CKEDITOR.instances[idOfEditor].getData();
      vm.showEditItineraryElements = false;
      CKEDITOR.instances[idOfEditor].setData('');
      vm.editHeading = '';

      if (CKEDITOR.instances[idOfEditor]) 
        CKEDITOR.instances[idOfEditor].destroy();
    }

    vm.deleteItinerary = function(index) {
      vm.itineraries.splice(index,1);
    }

    vm.getHtmlTrustedData = function(htmlData){
      return $sce.trustAsHtml(htmlData);
    };

    // SAve the data here
    vm.save = function (isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.tourForm');
        return false;
      }
      
      setProductInformation();

      var productId = $window.localStorage.getItem('productEditId');
      if(productId != 'noProductId'){
        $window.localStorage.setItem('productEditId', 'noProductId');
        $http.post('/api/host/editproduct/', vm.tour).success(function (response) {
          // And redirect to the tour list page
          $state.go('host.tours');
        }).error(function (response) {
          vm.error = response.message;
        });
      } else {
        $http.post('/api/host/product/', vm.tour).success(function (response) {
          // And redirect to the tourlist page
          $state.go('host.tours');
        }).error(function (response) {
          vm.error = response.message;
        });
      }
    };

    function setProductInformation() {
      vm.tour.destination = document.getElementById('tour_main_destination').value;
      vm.tour.productGrade = vm.productGrade;
      vm.tour.productDurationType = vm.durationType;
      vm.tour.productDuration = vm.productDuration;
      vm.tour.productAvailabilityType = vm.productAvailabilityType;
      vm.tour.productTimeSlotsAvailability = vm.productTimeSlotsAvailability;
      vm.tour.productSeatsLimitType = vm.productSeatsLimitType;
      vm.tour.productMonthsAvailableForBoking = vm.availableMonths;
      vm.tour.productSummary = CKEDITOR.instances.describe_tour_briefly.getData();
      vm.tour.productCancellationPolicy = CKEDITOR.instances.cancellationPolicies.getData();
      vm.tour.productGuidelines = CKEDITOR.instances.tour_guidelines.getData();
      vm.tour.productInclusions = CKEDITOR.instances.tour_inclusions.getData();
      vm.tour.productExclusions = CKEDITOR.instances.tour_exclusions.getData();
      vm.tour.productItineraryDescription = vm.itineraries;
      vm.tour.productType = $window.localStorage.getItem('productType');
      $window.localStorage.setItem('productType', '');
      vm.tour.fixedProductSchedule = vm.fixedProductSchedule.params;

      var index = 0;
      // Pricing options
      vm.pricingOptionStore = {};
      if (vm.pricingParams[0] !== undefined) {
        for (index = 0; index < vm.pricingOptions.length; index++) {
          var pricingInfo = {};
          if (vm.pricingOptions[index] !== 'Group')
            vm.pricingParams[index].Params.groupOption = '';
          vm.pricingOptionStore[vm.pricingOptions[index]] = vm.pricingParams[index].Params;
        }

        vm.tour.productPricingOptions = vm.pricingOptionStore;
      }

      vm.tour.productAddons = vm.addonParams.params;

      vm.tour.isDepositNeeded = vm.isDepositApplicable;

      vm.tour.productTimeSlots = vm.timeslots;

      vm.tour.productPictureURLs = vm.productPictureURLs;

      vm.tour.productMapURLs = vm.productMapURLs;
    }

    vm.goToTourCreationPage = function() {
      $timeout(function () {
        $state.go('host.addProduct');
      }, 800);
      $window.localStorage.setItem('productType', vm.productType);
    }

    $scope.imageFilesToBeUploaded = $window.globalImageFileStorage;
    vm.uploadImage = function () {
      vm.success = vm.error = null;
      vm.showImageProgressbar = true;
      
      Upload.upload({
        url: 'api/product/productPicture',
        arrayKey: '',
        data: {
          files: $scope.imageFilesToBeUploaded
        }
      }).then(function (response) {
        $timeout(function () {
          onSuccessItem(response.data, 'image');
        }, 3000);
      }, function (response) {
        if (response.status > 0) onErrorItem(response.data);
      }, function (evt) {
        vm.progress = parseInt(100.0 * evt.loaded / evt.total, 10);
      });
    };

    $scope.mapFilesToBeUploded = $window.globalMapFileStorage;
    vm.uploadMap = function () {
      vm.success = vm.error = null;
      vm.showMapProgressbar = true;
      Upload.upload({
        url: 'api/product/productMap',
        arrayKey: '',
        data: {
          files: $scope.mapFilesToBeUploded
        }
      }).then(function (response) {
        $timeout(function () {
          onSuccessItem(response.data, 'map');
        }, 3000);
      }, function (response) {
        if (response.status > 0) onErrorItem(response.data);
      }, function (evt) {
        vm.progress = parseInt(100.0 * evt.loaded / evt.total, 10);
      });
    };

    // Called after the user has successfully uploaded a new picture
    function onSuccessItem(response, pictureType) {
      // Show success message
      vm.success = true;
      // hide progressbar
      vm.showProgressbar = false;

      if (pictureType == 'image') {
        // Reset form
        vm.imageFileSelected = false;
        $scope.picFile = '';
        vm.showImageProgressbar = false;

        //change label
        vm.addMorePhotos = true;

        // add uploaded image urls to database
        vm.productPictureURLs.push(response);
      } else {
        // Reset form
        vm.mapFileSelected = false;
        $scope.mapFile = '';
        vm.showMapProgressbar = false;

        // add uploaded map urls to database
        vm.productMapURLs.push(response);
      }
      
    }

    // Called after the user has failed to uploaded a new picture
    function onErrorItem(response, pictureType) {
      if (pictureType == 'image') {
        // Reset form
        vm.imageFileSelected = false;
      } else {
        // Reset form
        vm.mapFileSelected = false;
      }

      // Show error message
      vm.error = response.message;
    }
    vm.cancelSelection = function(pictureType) {
      if (pictureType == 'image') {
        // Reset form
        vm.imageFileSelected = false;
        $scope.picFile = '';
      } else {
        // Reset form
        vm.mapFileSelected = false;
        $scope.mapFile = '';
      }
    }
  }
}());
