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
    $scope.errorMsg = "";    
    
    console.log("loading Search..")
    var handleSuccess = function(data) {
      $log.debug("User list data" + JSON.stringify(data));
      $scope.userList = data;
    };
    var handleError = function(data) {
      $scope.userList = [];
    };

    adminUserService.getUserList(handleSuccess, handleError);

    $scope.submitForm = function(){
      //send a request to user service and submit the form
      $log.debug('on search user form ' + $scope.username);
      adminUserService.search($scope.username).then(function(u) {
        //success callback
        $log.debug('User found'); 
      }, function(res) {
        //error callback & show the error message
        $log.debug('No user found ' + JSON.stringify(res));
        $scope.errorMsg = res.msg;        
      });
      return false;
    };

    $scope.getUserData = function() {
      $.each ($scope.userList, function(i, u) {        
        if(u && u.id === $scope.user.id) {
          $log.debug(JSON.stringify(u));
          $scope.userData = u;
        }
      });
    };

  }]);
