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
    $scope.submitForm = function(){
      //send a request to user service and submit the form
      $log.debug('on login form ' + $scope.user.username);
      userService.login($scope.user).then(function(/*res*/) {
        //success callback
        $log.debug('Login Sucess');
        $location.path('/lrhome');
      }, function(res) {
        //error callback & show the error message
        $log.debug('Login failed ' + JSON.stringify(res));
        
      });
      return false;
    };
  }]);
