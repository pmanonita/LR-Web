'use strict';

/**
 * @ngdoc function
 * @name lrwebApp.controller:EditMultiLRCtrl
 * @description
 * # EditMultiLRCtrl
 * Controller of the lrwebApp
 */
angular.module('lrwebApp')
  .controller('EditMultiLRCtrl',['$scope', '$log', '$location', 'lrService', 'userService',
    function ($scope, $log, $location, lrService, userService){

    $scope.msg = "";
    
    $scope.transaction = lrService.getTransaction();

    $scope.editTransaction = function() {      
      lrService.editTransaction($scope.transaction).then(function(u) {        
        $scope.transaction = u;        
        $scope.msg = "Edit Successful"
                
      }, function(res) {        
        $log.debug('Issue while editing Multi LR data' + JSON.stringify(res));
        $scope.msg = res.msg;
      });
      return false;
    };
       
  }]);
