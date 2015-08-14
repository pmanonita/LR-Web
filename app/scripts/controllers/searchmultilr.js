'use strict';

/**
 * @ngdoc function
 * @name lrwebApp.controller:SearchMultiLRCtrl
 * @description
 * # SearchMultiLRCtrl
 * Controller of the lrwebApp
 */
angular.module('lrwebApp')
  .controller('SearchMultiLRCtrl',['$scope', '$log', '$location', 'lrService', 'userService',
    function ($scope, $log, $location, lrService, userService){

    $scope.msg = "";
    $scope.filter = {};
    $scope.statusList = [ "Open", "Approved", "Rejected"];
    $scope.checkedLRTransIdList = [];
    
    $scope.submitForm = function() {      
      lrService.getTransactions($scope.filter).then(function(u) {
        $log.debug('Got Multi LR List'); 
        if(u && u.length > 0) {          
          $scope.msg = "";
          $scope.msg = u.message;
          $scope.TransactionsList = u;
          $scope.$apply();
        } else {
          $scope.msg = "No data found"
          $scope.TransactionsList = [];
        }                
      }, function(res) {        
        $log.debug('Issue while getting Multi LR data' + JSON.stringify(res));
        $scope.msg = res.msg;
      });
      return false;
    };

    $scope.setLRTransaction = function(lrTransData) {          
        lrService.showLRTransaction(lrTransData);
        $location.path('/editmultilr');   
        return false;
     };

    $scope.updateStatusInLRTransList = function(status) {
      $scope.msg = "";
      
      lrService.updateStatusInLRTransList($scope.checkedLRTransIdList,status,$scope.filter).then(function(u) {
        if(u && u.length > 0) {
          $log.debug('Got LRTransaction List');
          
          $scope.msg = "";
          $scope.msg = u.message;
          $scope.TransactionsList = u;   
          $scope.$apply();
           
        } else {
          $scope.msg = "No data found"
          $scope.TransactionsList = [];
        }
        
      }, function(res) {
        $log.debug('Issue while getting LRTransaction data' + JSON.stringify(res));
        $scope.msg = res.msg;    
      });

      return false;
  };

    $scope.toggleCheck = function (lrTransId) {
      if ($scope.checkedLRTransIdList.indexOf(lrTransId) === -1) {
          $scope.checkedLRTransIdList.push(lrTransId);
      } else {
          $scope.checkedLRTransIdList.splice($scope.checkedLRTransIdList.indexOf(lrTransId), 1);
      }
    };


  }]);
