	'use strict';

/**
 * @ngdoc function
 * @name lrwebApp.controller:LoginCtrl
 * @description
 * # LoginCtrl
 * Controller of the lrwebApp
 */
angular.module('lrwebApp')
  .controller('SearchUserCtrl', ['$scope', '$log', '$location', 'adminUserService', function ($scope, $log, $location, adminUserService) {  
    $scope.message = "";
    $scope.roles = ["admin", "normal"];    
    
    console.log("loading Search..")
    var handleSuccess = function(data) {
      $log.debug("User list data" + JSON.stringify(data));
      $scope.userList = data;
    };
    var handleError = function(data) {
      $scope.userList = [];
    };

    //Get all users
    adminUserService.getUserList(handleSuccess, handleError);    

    //Get individual user data
    $scope.getUserData = function() {
      $.each ($scope.userList, function(i, u) {        
        if(u && u.id === $scope.user.id) {
          $log.debug(JSON.stringify(u));
          $scope.userData = u;
          //set conf password to password
          $scope.userData.confpassword = $scope.userData.password;
        }
      });
    };

    //Edit user
    $scope.submitEditForm = function() {
      $log.debug("On edit user form");
      
      adminUserService.editUser($scope.userData).then(function(u) {
        //success callback
        $log.debug('User updated'); 
        $scope.userData = u;
        $scope.message = "User data updated successfully";

      }, function(res) {
        //error callback & show the error message
        $log.debug('No user found ' + JSON.stringify(res));
        $scope.message = res.msg;
      });
      return false;

    };

  }]);
