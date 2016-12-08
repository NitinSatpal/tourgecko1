(function () {
  'use strict';

  angular
    .module('core')
    .controller('HeaderController', HeaderController);

  HeaderController.$inject = ['$scope', '$state', 'Authentication', '$location', 'menuService'];

  function HeaderController($scope, $state, Authentication, $location, menuService) {
    var vm = this;
    vm.authentication = Authentication;
    vm.hideHeader = false;
    var hideHeaderHere = new Set();
    hideHeaderHere.add('/host/tourdetails');

    vm.accountMenu = menuService.getMenu('account').items[0];
    vm.authentication = Authentication;
    vm.isCollapsed = false;
    vm.menu = menuService.getMenu('topbar');
    $scope.$on('$stateChangeSuccess', stateChangeSuccess);

    function stateChangeSuccess() {
      // Collapsing the menu after navigation
      vm.isCollapsed = false;
      if(hideHeaderHere.has($location.path()))
        vm.hideHeader = true;
      else
        vm.hideHeader = false;
    }

    vm.goToHomePage = function() {
      if ($state.$current.url.source !== '/')
        $state.go('abstractHome');
    };
  }
}());