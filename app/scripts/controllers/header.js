angular.module('lrwebApp')
  .controller('HeaderCtrl', ['$scope', '$log', '$location', 'userService', function ($scope, $log, $location, userService) {
    $scope.isLoggedIn = userService.isLoggedIn();    
    var user = userService.getUser();    
    $scope.username = user.firstName || user.name;
   
  }]);
          
  






 