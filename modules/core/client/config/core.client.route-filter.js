(function () {
  'use strict';

  angular
    .module('core')
    .run(routeFilter);

  routeFilter.$inject = ['$rootScope', '$state', 'Authentication'];

  function routeFilter($rootScope, $state, Authentication) {
    $rootScope.$on('$stateChangeStart', stateChangeStart);
    $rootScope.$on('$stateChangeSuccess', stateChangeSuccess);
    function stateChangeStart(event, toState, toParams, fromState, fromParams) {
      // Check authentication before changing state
      if (toState.data && toState.data.roles && toState.data.roles.length > 0) {
        var allowed = false;
        for (var i = 0, roles = toState.data.roles; i < roles.length; i++) {
          if ((roles[i] === 'guest') || (Authentication.user && Authentication.user.roles !== undefined && Authentication.user.roles.indexOf(roles[i]) !== -1)) {
            allowed = true;
            break;
          }
        }
        if (!allowed) {
          event.preventDefault();
          if (Authentication.user !== undefined && typeof Authentication.user === 'object' && Authentication.user !== null) {
            $state.transitionTo('forbidden');
          } else {
            $state.go('authentication.hostSignin').then(function () {
              // Record previous state
              storePreviousState(toState, toParams);
            });
          }
        } else {
          if ($rootScope.productCreationOrEditDirtyDataPresent) {
            if(toState.name != 'host.showProduct') {
              event.preventDefault();
              $('#loadingDivHostSide').css('display', 'none');
              $('#tourgeckoBody').removeClass('waitCursor');
              $('#navigatingFromAddProduct').click();
            }
          }
        }
        $("#navigate-from-addProduct-yes").click(function () {
          $('.modal-backdrop').remove();
          $rootScope.productCreationOrEditDirtyDataPresent = false;
          $rootScope.doNotNavigateFromDirtyDataState = false;
          $state.go(toState.name, toParams);
        });
        $("#navigate-from-addProduct-no").click(function (event) {
          $("#navigate-from-addProduct-close").click();
        });
      }
    }

    function stateChangeSuccess(event, toState, toParams, fromState, fromParams) {
      // Record previous state
      storePreviousState(fromState, fromParams);
    }

    // Store previous state
    function storePreviousState(state, params) {
      // only store this state if it shouldn't be ignored
      if (!state.data || !state.data.ignoreState) {
        $state.previous = {
          state: state,
          params: params,
          href: $state.href(state, params)
        };
      }
    }
  }
}());
