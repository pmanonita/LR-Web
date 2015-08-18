	'use strict';

/**
 * @ngdoc function
 * @name lrwebApp.controller:LoginCtrl
 * @description
 * # LoginCtrl
 * Controller of the lrwebApp
 */
angular.module('lrwebApp')
  .controller('LrCtrl', ['$scope', '$log', '$location', 'lrService','userService', function ($scope, $log, $location, lrService,userService) {
    this.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
    $scope.msg = "";
    $scope.lPromise = null;
    $scope.lMessage = "";

    var handleConsignerSuccess = function(data) {
      $scope.consignerList = data;        
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
    var handleBillingnameSuccess = function(data) {
      $scope.billingnameList = data;  
      console.log("hadling success"); 
      
    };
    var handleBillingnameError = function(data) {
      $scope.billingnameList = [];
    };
    
    lrService.getConsignerList(handleConsignerSuccess, handleConsignerError);
    lrService.getConsigneeList(handleConsigneeSuccess, handleConsigneeError);
    lrService.getBillingnameList(handleBillingnameSuccess, handleBillingnameError);
        
    $scope.$watch('text', function(v) {
      for (var i in $scope.consignerList) {
        var option = $scope.consignerList[i];
        if (option.consignerCode === v) {
          $scope.lr.consigner = option;
          break;
        }
      }
    });

    $scope.$watch('text', function(v) {
      for (var i in $scope.consigneeList) {
        var option = $scope.consigneeList[i];
        if (option.consigneeCode === v) {
          $scope.lr.consignee = option;
          break;
        }
      }
    });

    $scope.$watch('text', function(v) {
      for (var i in $scope.billingnameList) {
        var option = $scope.billingnameList[i];
        if (option.name === v) {
          $scope.lr.billingname = option;
          break;
        }
      }
    });

    $scope.createLR = function() {
      $scope.msg = "";
      lrService.createLR($scope.lr).then(function(/*res*/) {
        //success callback
        $log.debug('LR Created Sucessfully'); 
        $location.path('/editlr');
      }, function(res) {
        //error callback & show the error message
        $log.debug('Error In LR Creation ' + JSON.stringify(res));
        $scope.msg = res.msg;        
      }, function(s) {        
        $log.debug('On progress..');
        $scope.lMessage = s;  
      });
      return false;
    };
  }]);
