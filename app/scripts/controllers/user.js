	'use strict';

/**
 * @ngdoc function
 * @name lrwebApp.controller:LoginCtrl
 * @description
 * # LoginCtrl
 * Controller of the lrwebApp
 */
angular.module('lrwebApp')
  .controller('UserCtrl', ['$scope', '$log', '$location', 'userService', function ($scope, $log, $location, userService) {
    this.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
    $scope.submitForm = function(){
      //send a request to user service and submit the form
      $log.debug('on login form ' + $scope.user.username);
      userService.signup($scope.user).then(function(/*res*/) {
        //success callback
        $log.debug('Signup Sucess');
        $location.path('/lrhome');
      }, function(res) {
        //error callback & show the error message
        $log.debug('Signup failed ' + JSON.stringify(res));
        
      });
      return false;
    };
  }]);
