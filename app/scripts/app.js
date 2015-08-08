'use strict';

/**
 * @ngdoc overview
 * @name lrwebApp
 * @description
 * # lrwebApp
 *
 * Main module of the application.
 */

var app = angular.module('lrwebApp', ['ngAnimate','ngCookies','ngMessages','ngResource','ngRoute','ngSanitize','ngTouch']);

app.config(['$routeProvider',function ($routeProvider) {
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
    .when('/createexpense', {
      templateUrl: 'views/createexpense.html',
      controller: 'GeneralExpenseCtrl',
      controllerAs: 'generalexpense'
    })
    .when('/searchexpense', {
      templateUrl: 'views/searchexpense.html',
      controller: 'SearchExpenseCtrl',
      controllerAs: 'searchexpense'
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
    .when('/createmultilr', {
      templateUrl: 'views/createmultilr.html',
      controller: 'CreateMultiLrCtrl',
      controllerAs: 'createmultilr'
    })
    .when('/searchmultilr', {
      templateUrl: 'views/searchmultilr.html',
      controller: 'SearchMultiLRCtrl',
      controllerAs: 'searchmultilr'
    })
    .when('/editmultilr', {
      templateUrl: 'views/editmultilr.html',
      controller: 'EditMultiLRCtrl',
      controllerAs: 'editmultilr'
    })
    .when('/createuser', {
      templateUrl: 'views/createuser.html',
      controller: 'AdminUserCtrl',
      controllerAs: 'adminuser'
    })
    .when('/searchuser', {
      templateUrl: 'views/searchuser.html',
      controller: 'SearchUserCtrl',
      controllerAs: 'searchuser'
    })
    .when('/lrreports', {
      templateUrl: 'views/lrreport.html',
      controller: 'LrhomeCtrl',
      controllerAs: 'lrhome'
    })
    .when('/login', {
      templateUrl: 'views/login.html',
      controller: 'LoginCtrl',
      controllerAs: 'login'
    })
    .otherwise({
      redirectTo: '/login'
    });
}]);

app.run( ['$rootScope', '$location', '$log', 'userService', function($rootScope, $location, $log, userService) {  
  $rootScope.$on('$routeChangeStart', function(event, next, current) {    
    if (!userService.isLoggedIn()) {
      // no logged user, redirect to /login
      if ( next.templateUrl === "views/login.html") {
        //do nothing (to-do: improvie)
      } else {
        $location.path("/login");
      }
    }
  });         
}]);