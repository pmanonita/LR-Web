'use strict';

/**
 * @ngdoc function
 * @name lrwebApp.controller:GeneralExpenseCtrl
 * @description
 * # GeneralExpenseCtrl
 * Controller of the lrwebApp
 */
angular.module('lrwebApp')
  .controller('GeneralExpenseCtrl',['$scope', '$log', '$location', 'generalExpenseService', 'userService',
    function ($scope, $log, $location, generalExpenseService, userService){

    $scope.msg = "";
    
    $scope.statusList = [ "Open", "Approved", "Rejected"];

    $scope.isAdmin = userService.isAdmin();

    var handleSuccess = function(data) {
      $log.debug("Account list data" + JSON.stringify(data));
      $scope.accounts = data;
    };
    var handleError = function(data) {
      $scope.accounts = [];
    };
    //Get all accounts
    generalExpenseService.getAccountList(handleSuccess, handleError); 


    $scope.submitForm = function() {
      $log.debug($scope.expense);
      $scope.msg = "";
      
      generalExpenseService.newExpense($scope.expense).then(function(u) {
        //success callback        
        $log.debug('Got general expense data' + JSON.stringify(u));         
        $scope.msg = "New expense created successfully with Id: " + u.id;

      }, function(res) {
        //error callback & show the error message
        $log.debug('Issue while creating expense data' + JSON.stringify(res));
        $scope.msg = res.msg;
      });
      return false;
    };

  }]);
