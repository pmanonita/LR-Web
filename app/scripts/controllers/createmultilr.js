'use strict';

/**
 * @ngdoc function
 * @name lrwebApp.controller:CreateMultiLrCtrl
 * @description
 * # CreateMultiLrCtrl
 * Controller of the lrwebApp
 */
angular.module('lrwebApp')
  .controller('CreateMultiLrCtrl',['$scope', '$log', '$location', 'lrService', 'userService',
    function ($scope, $log, $location, lrService, userService){

    $scope.msg = "";
    $scope.filter = {};
    $scope.checkedLRIdList = [];

    $scope.getLRList = function() {
      $scope.filter.multiLoad = "true";
      $scope.filter.isLRAttached = "false";
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

    $scope.toggleCheck = function (lrId) {
      if ($scope.checkedLRIdList.indexOf(lrId) === -1) {
          $scope.checkedLRIdList.push(lrId);
      } else {
          $scope.checkedLRIdList.splice($scope.checkedLRIdList.indexOf(lrId), 1);
      }
    };

    $scope.attachLRs = function() {
      console.log($scope.checkedLRIdList);
    }


    //On master

  }]);
