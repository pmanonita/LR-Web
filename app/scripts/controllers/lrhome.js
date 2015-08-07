'use strict';

/**
 * @ngdoc function
 * @name lrwebApp.controller:LrhomeCtrl
 * @description
 * # LrhomeCtrl
 * Controller of the lrwebApp
 */
angular.module('lrwebApp')
  .controller('LrhomeCtrl',['$scope', '$log', '$location', 'lrService', function ($scope, $log, $location, lrService){
    this.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];    

    $scope.msg = "";
    $scope.filter = {};

    $scope.submitForm = function() {

      lrService.searchLR($scope.lr).then(function(u) {
        $scope.lr = lrService.getLR();    
        console.log("lr value "+$scope.lr.otherExpenditures);       
        $location.path('/editlr');

      }, function(res) {      
        $log.debug('Issue while getting LR data' + JSON.stringify(res));        
      });

      return false;
    };

    $scope.getLRByDate = function() {
      $scope.filter.multiLoad = "false";
      $scope.filter.isLRAttached = "false";

      lrService.getLRList($scope.filter).then(function(u) {
        if(u && u.length > 0) {
          $log.debug('Got LR List');
          $scope.msg = "";
          $scope.LRList = u;          
        } else {
          $scope.msg = "No data found"
        }
        
      }, function(res) {
        $log.debug('Issue while getting LR data' + JSON.stringify(res));
        $scope.msg = res.msg;    
      });

      return false;
    };

  }]);
