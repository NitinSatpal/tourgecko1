(function () {
  'use strict';

  angular
    .module('hosts')
    .controller('sidenavController', sidenavController);

  sidenavController.$inject = ['$window', '$http', 'Authentication'];

  function sidenavController($window, $http, Authentication) {
    var vm = this;
    vm.authentication = Authentication;

    vm.goToHostWebsite = function() {
      $http.get('/api/host/toursite').success(function (response) {
        if (response.toursite === null || response.toursite === '' || response.toursite === undefined) {
          alert('You have not provided touriste name at the time of registration. Please update the same in your settings.');
        } else if(response.isToursiteInactive == true) {
          alert('your toursite is inactive. Please make it active in your settings');
        } else if(response.user.isActive == false) {
          alert('your account is inactive. Tourgecko will verify and activate your account.');
        } else {
          $window.location.href = 'http://' + response.toursite + '.tourgecko.com:3000';
        }
      }).error(function (response) {
        vm.error = response.message;
      });
    };
  }
}());
