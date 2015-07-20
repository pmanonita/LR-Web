	'use strict';

/**
 * @ngdoc function
 * @name lrwebApp.controller:LoginCtrl
 * @description
 * # LoginCtrl
 * Controller of the lrwebApp
 */
angular.module('lrwebApp')
  .controller('AdminUserCtrl', ['$scope', '$log', '$location', 'adminUserService', 'userService', function ($scope, $log, $location, adminUserService, userService) {
    this.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];

    $scope.user = {};
    $scope.roles = ["admin", "normal"];
    $scope.user.role = "normal"; //Default role
    
    $scope.submitForm = function(){
      $log.debug('on signup form ' + $scope.user.username);
      adminUserService.createUser($scope.user).then(function(/*res*/) {
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
