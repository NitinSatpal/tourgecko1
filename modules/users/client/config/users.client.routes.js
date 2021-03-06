(function () {
  'use strict';

  // Setting up route
  angular
    .module('users.routes')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    // Users state routing
    $stateProvider
     .state('settings', {
        abstract: true,
        url: '/settings',
        templateUrl: 'modules/users/client/views/settings/settings.client.view.html',
        controller: 'SettingsController',
        controllerAs: 'vm',
        data: {
          roles: ['user', 'hostAdmin', 'Super Admin']
        }
      })
      .state('settings.home', {
        url: '',
        templateUrl: '',
        controller: '',
        controllerAs: '',
        data: {
          pageTitle: 'Settings'
        }
      })
      /* .state('settings.profile', {
        url: '/profile',
        templateUrl: 'modules/users/client/views/settings/edit-profile.client.view.html',
        controller: '',
        controllerAs: '',
        data: {
          pageTitle: 'Settings'
        }
      }) */
      .state('settings.profile', {
        url: '/profile',
        templateUrl: 'modules/users/client/views/settings/user-profile.client.view.html',
        controller: 'UserProfileController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Profile'
        }
      })
      .state('settings.password', {
        url: '/password',
        templateUrl: 'modules/users/client/views/settings/change-password.client.view.html',
        controller: 'ChangePasswordController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Settings password'
        }
      })
      .state('settings.accounts', {
        url: '/accounts',
        templateUrl: 'modules/users/client/views/settings/manage-social-accounts.client.view.html',
        controller: 'SocialAccountsController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Settings accounts'
        }
      })
      .state('settings.picture', {
        url: '/picture',
        templateUrl: 'modules/users/client/views/settings/change-profile-picture.client.view.html',
        controller: 'ChangeProfilePictureController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Settings picture'
        }
      })
      .state('authentication', {
        abstract: true,
        url: '',
        templateUrl: 'modules/users/client/views/authentication/authentication.client.view.html',
        controller: 'AuthenticationController',
        controllerAs: 'vm'
      })
      .state('authentication.hostSignup', {
        url: '/host/signup',
        templateUrl: 'modules/users/client/views/authentication/signup.client.view.html',
        controller: 'AuthenticationController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Signup'
        }
      })
      .state('authentication.hostSignin', {
        url: '/host/login?err',
        templateUrl: 'modules/users/client/views/authentication/signin.client.view.html',
        controller: 'AuthenticationController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'login'
        }
      })
      .state('authentication.guestSignup', {
        url: '/guest/signup',
        templateUrl: 'modules/users/client/views/authentication/guestSignup.client.view.html',
        controller: 'AuthenticationController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Signup'
        }
      })
      .state('authentication.guestSignupDone', {
        url: '/guest/signup/done',
        templateUrl: 'modules/users/client/views/authentication/guestSignupDone.client.view.html',
        controller: '',
        controllerAs: '',
        data: {
          pageTitle: 'Signup | Done'
        }
      })
      .state('authentication.guestSignin', {
        url: '/guest/login?err',
        templateUrl: 'modules/users/client/views/authentication/guestSignin.client.view.html',
        controller: 'AuthenticationController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'login'
        }
      })
      .state('hostDetails', {
        abstract: true,
        url: '/host',
        templateUrl: 'modules/users/client/views/authentication/hostDetails.client.view.html',
        controller: 'AuthenticationController',
        controllerAs: 'vm'
      })
      .state('hostDetails.details', {
        url: '/details',
        templateUrl: 'modules/users/client/views/authentication/signupHostDetails.client.view.html',
        controller: 'AuthenticationController',
        controllerAs: 'vm',
        params: {
          id: null
        },
        data: {
          pageTitle: 'Signup Details'
        }
      })
      .state('hostDetails.signupDone', {
        url: '/done',
        templateUrl: 'modules/users/client/views/authentication/signupCompleted.client.view.html',
        controller: 'AuthenticationController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'tourgecko - Success!'
        }
      })
      .state('password', {
        abstract: true,
        url: '/password',
        templateUrl: 'modules/users/client/views/password/password.client.view.html',
      })
      .state('password.forgot', {
        url: '/forgot',
        templateUrl: 'modules/users/client/views/password/forgot-password.client.view.html',
        controller: 'PasswordController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Password forgot'
        }
      })
      .state('password.reset', {
        abstract: true,
        url: '/reset',
        template: '<ui-view/>'
      })
      .state('password.reset.invalid', {
        url: '/invalid',
        templateUrl: 'modules/users/client/views/password/reset-password-invalid.client.view.html',
        data: {
          pageTitle: 'Password reset invalid'
        }
      })
      .state('password.reset.success', {
        url: '/success',
        templateUrl: 'modules/users/client/views/password/reset-password-success.client.view.html',
        data: {
          pageTitle: 'Password reset success'
        }
      })
      .state('password.reset.form', {
        url: '/:token',
        templateUrl: 'modules/users/client/views/password/reset-password.client.view.html',
        controller: 'PasswordController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Password reset form'
        }
      });
  }
}());
