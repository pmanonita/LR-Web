  'use strict';

/**
 * @ngdoc function
 * @name lrwebApp.controller:LoginCtrl
 * @description
 * # LoginCtrl
 * Controller of the lrwebApp
 */
angular.module('lrwebApp')
  .controller('EditLrCtrl', ['$scope', '$log', '$location', 'lrService','userService', function ($scope, $log, $location, lrService,userService) {
    this.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];  
    $scope.lr = lrService.getLR();    
    $scope.lr.freightToBroker="0" ;
    $scope.lr.advance="0" ;
    var authKey = userService.getAuthToken();

     $scope.submitForm = function(){
      //send a request to user service and submit the form
      $log.debug('on add expenditure for lr form ' );
      lrService.createExpenditure($scope.lr,authKey).then(function(/*res*/) {
        //success callback
        $log.debug('LR Created Sucessfully');        
        $location.path('/editlr');
      }, function(res) {
        //error callback & show the error message
        $log.debug('Error In LR Creation ' + JSON.stringify(res));
        
      });
      return false;
    };

    $scope.submitOtherExpenditureForm = function(){
      //send a request to user service and submit the form
      console.log('on add otherexpenditure for lr form ' );
      lrService.createOtherExpenditure($scope.lr,authKey).then(function(/*res*/) {
        //success callback
        $log.debug('LR Created Sucessfully');        
        $location.path('/editlr');
      }, function(res) {
        //error callback & show the error message
        $log.debug('Error In LR Creation ' + JSON.stringify(res));
        
      });
      return false;
    };
  
  }]);
