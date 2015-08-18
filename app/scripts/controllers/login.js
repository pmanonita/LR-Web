  'use strict';

/**
 * @ngdoc function
 * @name lrwebApp.controller:LoginCtrl
 * @description
 * # LoginCtrl
 * Controller of the lrwebApp
 */
angular.module('lrwebApp')
  .controller('LoginCtrl', ['$scope', '$log', '$location', 'userService', function ($scope, $log, $location, userService) {
    this.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];

    var isLoggedIn = userService.isLoggedIn();
    if(isLoggedIn){
      userService.signout();
    }

    $scope.lPromise = null;
    $scope.lMessage = "";
    $scope.errorMsg = "";
    $scope.user = {};

    $scope.submitForm = function(){
      //Clear error msg
      $scope.errorMsg = "";
      $scope.lMessage = "";
    
      //send a request to user service and submit the form
      $log.debug('on login form ' + $scope.user.username);

      $scope.lPromise = userService.login($scope.user);
      $scope.lPromise.then(function(u) {
        //success callback
        $log.debug('Login Sucess');                
        $location.path('/lrhome');
      }, function(res) {
        //error callback & show the error message
        $log.debug('Login failed ' + JSON.stringify(res));
        $scope.errorMsg = res.msg;        
      }, function(s) {        
        $log.debug('On progress ' + s);
        $scope.lMessage = s;    
      });
      return false;
    };
  }]);