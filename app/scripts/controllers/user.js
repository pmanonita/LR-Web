	'use strict';

/**
 * @ngdoc function
 * @name lrwebApp.controller:LoginCtrl
 * @description
 * # LoginCtrl
 * Controller of the lrwebApp
 */
angular.module('lrwebApp')
  .controller('UserCtrl', ['$scope', '$log', '$location', 'adminUserService', function ($scope, $log, $location, adminUserService) {
    this.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];

    $scope.msg = "";
    $scope.user = {};
    $scope.user.roles = ["admin", "normal"];
    $scope.user.role = "normal";

    $scope.submitForm = function(){
      //send a request to user service and submit the form
      $log.debug('on create user form ' + $scope.user.username);
      adminUserService.createUser($scope.user).then(function(u) {
        //success callback
        $scope.user = u;
        $log.debug("User created successfully with id :" + u.id);        
        $scope.msg = "User created successfully with id :" + u.id;
      }, function(res) {
        //error callback & show the error message
        $log.debug('Signup failed ' + JSON.stringify(res));        
        $scope.msg = res.msg;
      });
      return false;
    };
  }]);
