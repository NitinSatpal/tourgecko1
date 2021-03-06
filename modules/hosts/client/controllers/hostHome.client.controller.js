(function () {
  'use strict';

  angular
    .module('hosts')
    .controller('HostHomeController', HostHomeController)
    .constant('mobileverificationServerResponseCodes', {
      "askForNewTokenGeneration" : "regenerateNew",
      "mobileVerificationSuccess" : "successfullyVerified",
      "mobileVerificationTokeMismatch" : "accountKeyMismatch",
      "mobileAlreadyVerified": "alreadyVerified",
      "missingVerificationCode": "missingVerificationCode",
      "someThingWentWrong": "someThingWentWrong",
      "successfullyResentAccountKey": "successfullyResentAccountKey",
      "successfullyResentNewAccountKey": "successfullyResentNewAccountKey",
      "sentCodeIsActive": "sentCodeIsActive"
    });

  HostHomeController.$inject = ['$scope', '$state', '$window', '$http', '$timeout', '$interval', 'Authentication', 'PinboardPinService', 'PinboardGoalService', 'mobileverificationServerResponseCodes'];

  function HostHomeController($scope, $state, $window, $http, $timeout, $interval, Authentication, PinboardPinService, PinboardGoalService, mobileverificationServerResponseCodes) {
    var vm = this;
    vm.goalPinStatus = [];
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
    $http.get('/api/host/companyproductscount/').success(function (response) {
      vm.productCount = response.count;
    }).error(function (response){
    });
    
    $http.get('/api/host/messageDetailsForAnalyticsAndLatestData/').success(function (response) {
      vm.messages = response.messages;
      vm.messageCount = response.messageCount;
    }).error(function (response){
    });

    $http.get('/api/host/companyproductsessionsForAnalyticsAndLatestData/').success(function (response) {
      vm.departuresCount = response.count;
      vm.departureSessions = response.departureSessions;
    }).error(function (response){
    });

    vm.noPinboardData = true;
    $http.get('/api/host/company/').success(function (response)  {
      vm.companyDetails = response[0];
      for (var index = 0; index < vm.companyDetails.pinboardGoals.length; index++) {
        if (!vm.companyDetails.pinboardGoals[index].isGoalCompleted) {
          vm.noPinboardData = false;
          break;
        }
      }
      for (var index = 0; index < vm.companyDetails.pinboardPins.length; index++) {
        if (!vm.companyDetails.pinboardPins[index].isPinCompleted) {
          vm.noPinboardData = false;
          break;
        }
      }
    }).error(function (response){
    });

    //vm.pinboardPins = PinboardPinService.query();
    //vm.pinboardGoals = PinboardGoalService.query();
    vm.pinboardDismissedMessagesId = [];
    var weekdays = ['Sunday' , 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  
    var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];
    var index = 0;
      
    vm.getPercentCompletionOfGoal = function (goal) {
      vm.percentCompletion = goal.completedPinsCounter / goal.pinsForthisGoal.length * 100;
      return 'p' + vm.percentCompletion;
    }

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

    vm.getDepartureDateOfSession = function (startDate, startTime) {
      var displayDate;
      var date = new Date(startDate);
      displayDate = weekdays[date.getDay()] + ', ' + date.getDate() + ' ' + months[date.getMonth()] + ' ' + date.getFullYear();

      if (startTime != 'Select Time' && startTime != 'No time')
        displayDate = displayDate + ' ' + startTime;
      return displayDate;
    }

    vm.getStartsInDays = function (startDate) {
      // Set the date we're counting down to
        var countDownDate = new Date(startDate).getTime();
        var now = new Date().getTime();
        var distance = countDownDate - now;
        var days = Math.floor(distance / (1000 * 60 * 60 * 24));
        if (days > 1)
          return (days + 1).toString() + ' days';
        else
          return (days + 1).toString() + ' day';
    }

    vm.getAvailabilityFigureForLatestSection = function (startDate, numberOfSeatsSession) {
      var key = new Date(startDate).getTime().toString();
      if (numberOfSeatsSession && numberOfSeatsSession[key])
        return numberOfSeatsSession[key];
      else
        return 0;
    }

    vm.dismissPinboardMessage = function (id, type, index) {
      if (type == 'pin') {
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

    vm.clickThisElement = function (id) {
      $('#'+id).click();

      if (id == 'verifyAccountPhoneNumber') {
        vm.mobileVerificationCodeEntered = undefined;
        $('#initialMobileVerificationMessage').css('display', 'block');
        $('#regenerateNew').css('display', 'none');
        $('#successfullyVerified').css('display', 'none');
        $('#accountKeyMismatch').css('display', 'none');
        $('#missingVerificationCode').css('display', 'none');
        $('#someThingWentWrong').css('display', 'none');
        $('#successfullyResentAccountKey').css('display', 'none');
        $('#successfullyResentNewAccountKey').css('display', 'none');
        $('#sentCodeIsActive').css('display', 'none');
        $http.post('/api/host/verify/mobile').success(function (response) {
          if (vm.resendAccountKeyCounter == 60)
            var resendAccountKeyCounter = $timeout($scope.onTimeout,1000);
          $('#' + mobileverificationServerResponseCodes[response]).css('display', 'block');
        }).error(function (response) {
        });
        
      }
    }
    vm.resendAccountKeyCounter = 60;
    $scope.onTimeout = function() {
        if (vm.resendAccountKeyCounter > 0) {
            vm.resendAccountKeyCounter--;
            mytimeout = $timeout($scope.onTimeout,1000);
        } else {
            $('#resendMobileKeyCode').removeClass('disableAnchorLinks');
        }
    }

    vm.getDynamicPadding = function () {
      var cssObjectOne = {
        "padding-top" : "5px"
      }
      var cssObjectTwo = {
        "padding-top" : "15px"
      }
      if (window.innerWidth <= 767) {
        return cssObjectOne;
      } else {
        return cssObjectTwo;
      }
    }

    vm.getDynamicMarginPinboardButtons = function () {
      var cssObjectOne = {
        "margin-top" : "55px"
      }
      var cssObjectTwo = {
        "margin-top" : "8px"
      }
      if (window.innerWidth <= 767) {
        return cssObjectOne;
      } else {
        return cssObjectTwo;
      }
    }

    vm.getDynamicMarginPinboardCompletion = function () {
      var cssObjectOne = {
        "margin-top" : "0",
        "float": "right"
      }
      var cssObjectTwo = {
        "margin-top" : "-5px",
        "float": "right"
      }
      if (window.innerWidth <= 767) {
        return cssObjectOne;
      } else {
        return cssObjectTwo;
      }
    }

    vm.verifyMobileNumber = function (verificationCode) {
      $('#loadingDivHostSide').css('display', 'block');
      $('#tourgeckoBody').addClass('waitCursor');
      $('#regenerateNew').css('display', 'none');
      $('#successfullyVerified').css('display', 'none');
      $('#accountKeyMismatch').css('display', 'none');
      $('#missingVerificationCode').css('display', 'none');
      $('#someThingWentWrong').css('display', 'none');
      $('#successfullyResentAccountKey').css('display', 'none');
      $('#successfullyResentNewAccountKey').css('display', 'none');
      $('#sentCodeIsActive').css('display', 'none');

      if (verificationCode === undefined || verificationCode == '' || verificationCode == null || verificationCode == ' ') {
        $('#' + mobileverificationServerResponseCodes['missingVerificationCode']).css('display', 'block');
        $('#loadingDivHostSide').css('display', 'none');
        $('#tourgeckoBody').removeClass('waitCursor');
        return;
      }
      
      $http.get('/api/auth/mobileverification/' + verificationCode).success(function (response) {
          $('#loadingDivHostSide').css('display', 'none');
          $('#tourgeckoBody').removeClass('waitCursor');
          $('#' + mobileverificationServerResponseCodes[response]).css('display', 'block');
          if (response == 'mobileVerificationSuccess') {
            $timeout(function () {
              $state.reload();
              $('.modal-backdrop').remove();
            }, 2000);
          }
      }).error(function (response){
      });
    }

    vm.resendMobileVerificationKey = function () {
      $('#loadingDivHostSide').css('display', 'block');
      $('#tourgeckoBody').addClass('waitCursor');
      $('#regenerateNew').css('display', 'none');
      $('#successfullyVerified').css('display', 'none');
      $('#accountKeyMismatch').css('display', 'none');
      $('#missingVerificationCode').css('display', 'none');
      $('#someThingWentWrong').css('display', 'none');
      $('#successfullyResentAccountKey').css('display', 'none');
      $('#successfullyResentNewAccountKey').css('display', 'none');
      $('#sentCodeIsActive').css('display', 'none');
      $http.post('/api/host/reverify/mobile').success(function (response) {
        vm.resendAccountKeyCounter = 60;
        $('#resendMobileKeyCode').addClass('disableAnchorLinks');
        var resendAccountKeyCounter = $timeout($scope.onTimeout,1000);
        $('#' + mobileverificationServerResponseCodes[response]).css('display', 'block');
        $('#loadingDivHostSide').css('display', 'block');
        $('#loadingDivHostSide').css('display', 'none');
        $('#tourgeckoBody').removeClass('waitCursor');
      }).error(function (response){
      });
    }

    vm.changeCalendarView = function (whichView) {
      $("#sessionList .fc-toolbar .fc-right .fc-button-group .fc-button").css("background-color", "#FFFFFF");
      $('#btn' + whichView).css("background-color", "#cccccc");
      $('#calendar').fullCalendar('changeView', whichView);
    }
    
    vm.goToBookingDetails = function (id) {
      $state.go('host.bookingdetails', {bookingId: id});
    }

    vm.goToSessionBookingDetailsViaList = function (index) {
      var sessionStartDate = new Date($scope.productSessions[index].start).getTime().toString();
      $state.go('host.sessionDetails', {productSessionId: $scope.productSessions[index].sessionId, sessionStartDate: sessionStartDate});
    }

    vm.disMissWelcomeMessage = function (uniqueId) {
      $http.post('/api/host/welcomemessage/dismiss', {dismissingElementUniqueCode: uniqueId}).success(function (response) {
        // success
        $('.home-section.alert.alert-welcome').css("display", "none");
      }).error(function (response) {
        // ignore if any error. let user dismiss it again
      });
    }

    vm.goToSessionBookingDetailsViaLatestSection = function (session) {
      var sessionStartDate = new Date(session.startDate).getTime().toString();
      $state.go('host.sessionDetails', {productSessionId: session.sessionId, sessionStartDate: sessionStartDate});
    }

    vm.goToSessionBookingDetailsViaCalendar = function (id) {
      var element = document.getElementById(id);
      var sessionId = element.getAttribute('sessionId');
      var sessionStartDateTemp = element.getAttribute('sessionStartDate');
      sessionStartDateTemp = sessionStartDateTemp.split(' ');
      var sessionStartDate = '';
      for (var index = 0; index < sessionStartDateTemp.length; index++) {
        if (index != 4)
          sessionStartDate = sessionStartDate + sessionStartDateTemp[index];
        if (index == 4)
          sessionStartDate = sessionStartDate + '00:00:00';
        if (index != sessionStartDateTemp.length -1)
          sessionStartDate = sessionStartDate + ' ';
      }
      sessionStartDate = new Date(sessionStartDate).getTime().toString();
      $state.go('host.sessionDetails', {productSessionId: sessionId, sessionStartDate:sessionStartDate});
    }

    vm.showTheWelcomeMessage = false;
    vm.isWelcomeMessageValid = function (uniqueId) {
      if (vm.companyDetails && vm.companyDetails.newUserFirstLoginValidElements.indexOf(uniqueId) == -1)
        vm.showTheWelcomeMessage = true;
    }
  }
}());
