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

    //on master
    
    $scope.submitForm = function() {
      
      $log.debug($scope.filter);
      $scope.msg = "";
      
      lrService.getLRList($scope.filter).then(function(u) {
        $log.debug('Got LR List'); 
        $scope.LRList = u;      
        $scope.msg = "Successfully fetched the Data"
        
      }, function(res) {        
        $log.debug('Issue while getting LR data' + JSON.stringify(res));
        $scope.LRList = [];
        $scope.msg = res.msg;
      });
      return false;
    };

  }]);
