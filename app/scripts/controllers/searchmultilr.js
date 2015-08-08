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
    
    $scope.submitForm = function() {      
      lrService.getTransactions($scope.filter).then(function(u) {
        $log.debug('Got Multi LR List'); 
        $scope.TransactionsList = u;      
        $scope.msg = "Successfully fetched Multi LR List"
        
      }, function(res) {        
        $log.debug('Issue while getting Multi LR data' + JSON.stringify(res));
        $scope.msg = res.msg;
      });
      return false;
    };

  }]);
