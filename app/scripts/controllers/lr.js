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
    var handleSuccess = function(data) {
      $scope.consignerList = data;      
    };
    var handleError = function(data) {
      $scope.consignerList = [];
    };
    lrService.getConsignerList(handleSuccess, handleError);
    var options = [];

    $scope.options = $scope.consignerList

     
  $scope.$watch('text', function(v) {
    for (var i in $scope.options) {
      var option = $scope.options[i];
      if (option.name === v) {
        $scope.selectedOption = option;
        break;
      }
    }
  });

    var authKey = userService.getAuthToken();
    console.log("authkey is "+authKey);

    $scope.submitForm = function(){
      //send a request to user service and submit the form
      $log.debug('on lr form ' );
      lrService.createLR($scope.lr,authKey).then(function(/*res*/) {
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
