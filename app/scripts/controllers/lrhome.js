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

     

    $scope.filter = {};

    $scope.submitForm = function() {
      $log.debug("On lr search form");
      
      lrService.searchLR($scope.lr).then(function(u) {
        //success callback        
        $log.debug('Got LR data'); 
        $scope.lr = lrService.getLR();    
        console.log("lr value "+$scope.lr.otherExpenditures);  
        
       
        $location.path('/editlr');   
      }, function(res) {
        //error callback & show the error message
        $log.debug('Issue while getting LR data' + JSON.stringify(res));        
      });
      return false;
    };


    $scope.searchLR = function(lrData) {
      $log.debug("On lr search formehicleno "+lrData.vehicleNo);
      
      lrService.showLR(lrData);
      $location.path('/editlr');   
      return false;
    };

   

    $scope.getLRByDate = function() {
      $log.debug("On lr getLRByDate");
      $scope.filter.multiLoad = "true";
      
      lrService.getLRList($scope.filter).then(function(u) {
        //success callback        
        $log.debug('Got LR By date data'); 
        $scope.LRList = u;          
       
        
      }, function(res) {
        //error callback & show the error message
        $log.debug('Issue while getting LR data' + JSON.stringify(res));        
      });
      return false;
    };

  }]);
