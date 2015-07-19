'use strict';

/**
 * @ngdoc overview
 * @name lrwebApp
 * @description
 * # lrwebApp
 *
 * Main module of the application.
 */
angular
  .module('lrwebApp', [
    'ngAnimate',
    'ngCookies',
    'ngMessages',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch'
  ])
  .config(['$routeProvider',function ($routeProvider) {
    $routeProvider
      .when('/main', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl',
        controllerAs: 'main'
      })
      .when('/about', {
        templateUrl: 'views/about.html',
        controller: 'AboutCtrl',
        controllerAs: 'about'
      })
      .when('/lrhome', {
        templateUrl: 'views/lrhome.html',
        controller: 'LrhomeCtrl',
        controllerAs: 'lrhome'
      })
      .when('/createlr', {
        templateUrl: 'views/createlr.html',
        controller: 'LrCtrl',
        controllerAs: 'lr'
      })
      .when('/editlr', {
        templateUrl: 'views/editlr.html',
        controller: 'EditLrCtrl',
        controllerAs: 'editlr'
      })
      .when('/signup', {
        templateUrl: 'views/signup.html',
        controller: 'UserCtrl',
        controllerAs: 'user'
      })
      .when('/', {
        templateUrl: 'views/login.html',
        controller: 'LoginCtrl',
        controllerAs: 'login'
      })
      .otherwise({
        redirectTo: '/'
      });
  }]);
