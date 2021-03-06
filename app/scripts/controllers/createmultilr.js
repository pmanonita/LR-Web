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
    $scope.LRList = null;

    var handleBillingnameSuccess = function(data) {
      $scope.billingnameList = data; 
    };
    var handleBillingnameError = function(data) {
      $scope.billingnameList = [];
    };
    lrService.getBillingnameList(handleBillingnameSuccess, handleBillingnameError);

     $scope.$watch('text', function(v) {
      for (var i in $scope.billingnameList) {
        var option = $scope.billingnameList[i];
        if (option.name === v) {
          $scope.lr.billingname = option;
          break;
        }
      }
    });

    $scope.getLRList = function() {
      /* Default filter status to get LR that can be attached  */
      $scope.filter.multiLoad    = "true";
      $scope.filter.isLRAttached = "false";
      $scope.filter.status       = "Open";
      $log.debug($scope.filter);
      $scope.msg = "";
      
      lrService.getLRList($scope.filter).then(function(u) {        
        if(u && u.length > 0) {
          $log.debug('Got LR List');
          $scope.LRList = u;          
        } else {          
          $scope.LRList = null;
          $scope.msg = "No data found"
        }        
      }, function(res) {        
        $log.debug('Issue while getting LR data' + JSON.stringify(res));
        $scope.LRList = null;
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
      lrService.createTransaction($scope.checkedLRIdList).then(function(u) {
        $log.debug('Attached LR successfully'); 
        //$scope.transaction = u;      
        //$scope.msg = "Successfully Created Multi LR with transaction id : " + u.id;
        $location.path('/editmultilr');

      }, function(res) {        
        $log.debug('Issue while attaching LR data' + JSON.stringify(res));        
        $scope.msg = res.msg;
      });
      return false;
    }
  }]);
