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

    $scope.msg = "";
    $scope.user = {};
    $scope.roles = ["admin", "normal"];
    $scope.user.role = "normal";

    $scope.submitForm = function(){
      //send a request to user service and submit the form
      $log.debug('on create user form ' + $scope.user.username);
      adminUserService.createUser($scope.user).then(function(u) {
        //success callback
        $scope.user = u;      
        $scope.msg = "User created successfully with id :" + u.id;
      }, function(res) {
        //error callback & show the error message
        $log.debug('Signup failed ' + JSON.stringify(res));        
        $scope.msg = res.msg;
      });
      return false;
    };      
      
}]);
