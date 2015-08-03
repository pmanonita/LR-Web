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
      console.log("inside watch consigner"+v);
      for (var i in $scope.consignerList) {
        var option = $scope.consignerList[i];
        if (option.consignerCode === v) {
          $scope.lr.consigner = option;
          break;
        }
      }
    });

     $scope.$watch('text', function(v) {
      console.log("inside watch consignee"+v);
      for (var i in $scope.consigneeList) {
        var option = $scope.consigneeList[i];
        if (option.consigneeCode === v) {
          $scope.lr.consignee = option;
          break;
        }
      }
    });

     $scope.$watch('text', function(v) {
      console.log("inside watch billingname"+v);
      for (var i in $scope.billingnameList) {
        var option = $scope.billingnameList[i];
        if (option.name === v) {
          $scope.lr.billingname = option;
          break;
        }
      }
    });

    $scope.submitForm = function(){      
      $log.debug('on lr form ' );
      lrService.createLR($scope.lr).then(function(/*res*/) {
        //success callback
        $log.debug('LR Created Sucessfully');        
        $location.path('/editlr');
      }, function(res) {
        //error callback & show the error message
        $log.debug('Error In LR Creation ' + JSON.stringify(res));
        $scope.msg = res.msg;
        
      });
      return false;
    };
  }]);
