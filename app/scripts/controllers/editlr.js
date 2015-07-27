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
     var handleConsignerSuccess = function(data) {
      $scope.consignerList = data;  
      console.log("hadling success"); 
      
    };
    var handleConsignerError = function(data) {
      $scope.consignerList = [];
    };
     var handleConsigneeSuccess = function(data) {
      $scope.consigneeList = data;  
      console.log("hadling success"); 
      
    };
    var handleConsigneeError = function(data) {
      $scope.consigneeList = [];
    };
    
    lrService.getConsignerList(handleConsignerSuccess, handleConsignerError);
    lrService.getConsigneeList(handleConsigneeSuccess, handleConsigneeError);

    $scope.lrotherList = [];
    $scope.lr = lrService.getLR(); 



    $scope.lr.freightToBroker="0" ;
    $scope.lr.advance="0" ;
    


     $scope.submitExpenditureForm = function(){
      //send a request to user service and submit the form
      $log.debug('on add expenditure for lr form ' );
      lrService.createExpenditure($scope.lr).then(function(/*res*/) {
        //success callback
        $log.debug('LR Expenditure Created Sucessfully');        
        $location.path('/editlr');
      }, function(res) {
        //error callback & show the error message
        $log.debug('Error In LRExpenditure Creation ' + JSON.stringify(res));
        
      });
      return false;
    };

    $scope.submitIncomeForm = function(){
      //send a request to user service and submit the form
      $log.debug('on add income for lr form ' );
      lrService.createIncome($scope.lr).then(function(/*res*/) {
        //success callback
        $log.debug('LR Income Created Sucessfully');        
        $location.path('/editlr');
      }, function(res) {
        //error callback & show the error message
        $log.debug('Error In LR Income Creation ' + JSON.stringify(res));
        
      });
      return false;
    };

    $scope.submitOtherExpenditureForm = function(){
      //send a request to user service and submit the form
      console.log('on add otherexpenditure for lr form ' );
      lrService.createOtherExpenditure($scope.lr).then(function(/*res*/) {
        //success callback
        $log.debug('LR Other Expenditure Created Sucessfully'); 
        $scope.lr = lrService.getLR();    
        console.log("lr value "+$scope.lr.otherAmount);  
        $scope.lrotherList.push( {'lrNo':$scope.lr.lrNo, 'otherAmount': $scope.lr.otherAmount, 'otherRemarks':$scope.lr.otherRemarks });
        //$scope.lrNo='';
        $scope.lr.otherAmount='';
        $scope.lr.otherRemarks='';   
        //$location.path('/editlr');

      }, function(res) {
        //error callback & show the error message
        $log.debug('Error In LR Other Expenditure Creation ' + JSON.stringify(res));
        
      });
      return false;
    };



    $scope.updateLR = function(){
      //send a request to user service and submit the form
      $log.debug('update LR ' );
      lrService.updateLR($scope.lr).then(function(/*res*/) {
        //success callback
        $log.debug('LR Updated Sucessfully');        
        $location.path('/editlr');
      }, function(res) {
        //error callback & show the error message
        $log.debug('Error In LR Updation ' + JSON.stringify(res));
        
      });
      return false;
    };


   
  
  }]);
