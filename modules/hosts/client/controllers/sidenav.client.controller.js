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
      var userName = vm.authentication.user.username;
      $http.get('/api/host/toursite', { params: { 'username': userName } }).success(function (response) {
        if (response.toursite === null || response.toursite === '' || response.toursite === undefined) {
          alert('You did not provide touriste name at the time of registration. Pleas eupdate the same in your settings.');
        } else {
          $window.location.href = 'http://' + response.toursite + '.tourgecko.com:3000';
        }
      }).error(function (response) {
        vm.error = response.message;
      });
    };
  }
}());
