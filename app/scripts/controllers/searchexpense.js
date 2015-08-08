	'use strict';

/**
 * @ngdoc function
 * @name lrwebApp.controller:LoginCtrl
 * @description
 * # LoginCtrl
 * Controller of the lrwebApp
 */
angular.module('lrwebApp')
  .controller('SearchExpenseCtrl', ['$scope', '$log', '$location', 'userService', 'generalExpenseService',
    function ($scope, $log, $location, userService, generalExpenseService) {
    
      $scope.msg = "";
      $scope.editmessage = "";
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
        $scope.msg = "";      
        
        generalExpenseService.listExpense($scope.search).then(function(u) {

          $scope.expenses = u;

        }, function(res) {
          $log.debug('Issue while getting expense search data' + JSON.stringify(res));
          $scope.msg = '';
          $scope.expenses = [];
          $scope.msg = res.msg;
        });
        return false;
      };
        
      

      //Edit Expense
      $scope.editExpense = function(expense) {        
        $scope.editmessage = "";
        
        generalExpenseService.editExpense(expense).then(function(u) {
          //success callback
          $log.debug('Expense updated');
          $scope.expense = u;   //To-do, update this object in expenses list       
          $scope.editmessage = "Expense data updated successfully";
          $scope.msg = 'Please search again to get the refreshed data';
        }, function(res) {
          $log.debug('Issue while updating expense data' + JSON.stringify(res));
          $scope.editmessage = "";
          $scope.editmessage = res.msg;
        });
        return false;

      };
    }
  ]);
