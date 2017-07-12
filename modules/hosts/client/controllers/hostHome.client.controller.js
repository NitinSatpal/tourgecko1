(function () {
  'use strict';

  angular
    .module('hosts')
    .controller('HostHomeController', HostHomeController);

  HostHomeController.$inject = ['$scope', '$state', '$window', '$http', '$timeout', 'Authentication', 'AnalyticsDepartureCountService', 'PinboardPinService', 'PinboardGoalService'];

  function HostHomeController($scope, $state, $window, $http, $timeout, Authentication, AnalyticsDepartureCountService, PinboardPinService, PinboardGoalService) {
    var vm = this;
    $window.localStorage.setItem('signingupUserEmail', 'NoEmailId');
    vm.sessionsFetched = false;
    var currentDate = new Date($('#calendar').fullCalendar('getDate'));     
    var uniqueStr = (currentDate.getMonth()).toString() + (currentDate.getUTCFullYear()).toString();
    vm.listViewMonthTitle = $('#calendar').fullCalendar('getView').title;
    $scope.productSessions;
    vm.authentication = Authentication;
    vm.messageCount = 0;
    $http.get('/api/host/bookingDetailsForAnalyticsAndLatestData/').success(function (response) {
      vm.bookings = response.bookings;
      vm.totalRevenue = response.totalRevenue;
    }).error(function (response){
    });
    $http.get('/api/host/messageDetailsForAnalyticsAndLatestData/').success(function (response) {
      vm.messages = response.messages;
      vm.messageCount = response.messageCount;
    }).error(function (response){
    });

    console.log('ammammama ' + JSON.stringify(AnalyticsDepartureCountService.query()));
    vm.pinboardPins = PinboardPinService.query();
    vm.pinboardGoals = PinboardGoalService.query();
    vm.pinboardDismissedMessagesId = [];
    var weekdays = ['Sunday' , 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  
    var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];
    var index = 0;
    

    vm.getDepartureDateOfBookings = function (index) {
      var displayDate;
      if (vm.bookings[index]) {
        if (vm.bookings[index].isOpenDateTour) {
          var date = new Date(vm.bookings[index].openDatedTourDepartureDate);
          displayDate = weekdays[date.getDay()] + ', ' + date.getDate() + ' ' + months[date.getMonth()] + ' ' + date.getFullYear();
        } else {
          var date = new Date(vm.bookings[index].productSession.sessionDepartureDetails.startDate);          
          displayDate = weekdays[date.getDay()] + ', ' + date.getDate() + ' ' + months[date.getMonth()] + ' ' + date.getFullYear();
        }
      } else
        displayDate = '';
      
      return displayDate;
    }

    vm.getDepartureDateOfSession = function (startDate) {
      var displayDate;
      var date = new Date(startDate);
      displayDate = weekdays[date.getDay()] + ', ' + date.getDate() + ' ' + months[date.getMonth()] + ' ' + date.getFullYear();

      return displayDate;
    }

    vm.dismissPinboardMessage = function (id, type, index) {
      if (type == 'pin') {
        console.log('the id is ' + id);
        vm.pinboardPins.splice(index, 1)
        $http.post('/api/host/pinboard/pins/dismiss', {pinId: id}).success(function (response) {
        }).error(function (response){
        });
      }
    }

    /* $scope.$on('$stateChangeSuccess', stateChangeSuccess);

    function stateChangeSuccess() {
      if (vm.pinboardDismissedMessagesId.length > 0)
      $http.post('/api/host/pinboard/dismiss', vm.pinboardDismissedMessagesId).success(function (response) {

      }).error(function (response){

      });
    } */

    vm.fetchPrevMonthSessions = function () {
      $('#calendar').fullCalendar('prev');
      $scope.listViewMonthTitle = $('#calendar').fullCalendar('getView').title;
    }

    vm.fetchNextMonthSessions = function () {
      $('#calendar').fullCalendar('next');
      $scope.listViewMonthTitle = $('#calendar').fullCalendar('getView').title;
    }

    vm.getLoaderPositionForHomePageCalendar = function() {
      var leftMargin = ($('.home-content').width() - 25.719) / 2;
      var cssObject = {
        "left" : leftMargin,
        "color": '#ff9800'
      }
      return cssObject;
    }

    vm.getBackgroundColor = function (color) {
      var cssObject = {
        "background-color" : color
      }

      return cssObject;
    }

    vm.clickTheEvent = function (id) {
      $('#'+id).click();
    }

    vm.changeCalendarView = function (whichView) {
      $("#sessionList .fc-toolbar .fc-right .fc-button-group .fc-button").css("background-color", "#FFFFFF");
      $('#btn' + whichView).css("background-color", "#cccccc");
      $('#calendar').fullCalendar('changeView', whichView);
    }
    
    vm.goToSessionBookingDetailsViaList = function (index) {
      console.log('khappa ' + JSON.stringify($scope.productSessions[index]));
      $state.go('host.sessionBookingDetails', {productSessionId: $scope.productSessions[index].sessionId, sessionStartDate: $scope.productSessions[index].start});
    }

    vm.goToSessionBookingDetailsViaCalendar = function (id) {
      var element = document.getElementById(id);
      var sessionId = element.getAttribute('sessionId');
      var sessionStartDate = element.getAttribute('sessionStartDate');
      $state.go('host.sessionBookingDetails', {productSessionId: sessionId, sessionStartDate:sessionStartDate});
    }
  }
}());
