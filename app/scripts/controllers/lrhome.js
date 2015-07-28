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

    $scope.submitForm = function() {
      $log.debug("On lr search form");
      
      lrService.searchLR($scope.lr).then(function(u) {
        //success callback        
        $log.debug('Got LR data'); 
        $location.path('/editlr');   
      }, function(res) {
        //error callback & show the error message
        $log.debug('Issue while getting LR data' + JSON.stringify(res));        
      });
      return false;
    };

  }]);
