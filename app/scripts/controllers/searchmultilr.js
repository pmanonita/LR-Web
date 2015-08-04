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
      
      $log.debug($scope.filter);
      $scope.msg = "";
      
      lrService.getMultiLRs($scope.filter).then(function(u) {
        $log.debug('Got Multi LR List'); 
        $scope.MultiLRList = u;      
        $scope.msg = "Successfully fetched Multi LR  Data"
        
      }, function(res) {        
        $log.debug('Issue while getting LR data' + JSON.stringify(res));
        $scope.MultiLRList = [];
        $scope.msg = res.msg;
      });
      return false;
    };

    //On branch test

  }]);
